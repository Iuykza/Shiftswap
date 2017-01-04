angular.module('scheduleApp')
.controller('controlwelcome', ['dataService', 'ajaxService', '$scope', '$q', '$timeout', '$interval',
function(dataService, ajaxService, $scope, $q, $timeout, $interval){

	//Loader screen
	$scope.progress = true;
	$scope.timeUntilShift = '';
	$scope.shiftToday = {};
	$scope.shiftTomorrow = '';
	$scope.breaks = [];
	$scope.unix = dataService.unix;

	$scope.untilStep = 1;
	$scope.untilClock = {
		str: '',
		detail: '',
	};

	var t = this;
	t.stopGaps = [];

	
	$interval(function(){
		t.currentTime = now().format('hh:mm:ss a');
	}, 1000);

	$scope.$watch(
		(scope) => t.currentTime,
		function(newV, oldV){
			//update currentTime ticker
			$scope.currentTime = now().format('hh:mm a');

			//Update the stopGap ticker
			$q.all([d.ready.days.promise, d.ready.userInfos.promise]).then(function(){

				//Find where the current time lands in the stop gaps.
				var gap = 0;
				while(t.stopGaps[gap].m.isBefore(now())){
					gap++;
				}

				//Check if we're waiting for the shift to start, end, break...
				$scope.untilStep =
					gap===0                  ? 'start':
					gap===t.stopGaps.length-1? 'end':
					gap===t.stopGaps.length  ? 'afterhour':
				    gap%2===1                ? 'br-start':
				    gap%2===0                ? 'br-end':
				    '';

				//Output the difference between now and the stop gap.
				var untilTotal = -now().diff(t.stopGaps[gap].m, 'seconds');
				var clock = {
					s: padLeft(          (untilTotal     )%60, 2),
					m: padLeft(Math.floor(untilTotal/60  )%60, 2),
					h: padLeft(Math.floor(untilTotal/3600)%24, 2),
				};
				$scope.untilClock.str =    clock.h + ':'        + clock.m + ':'          + clock.s;
				$scope.untilClock.detail = clock.h + ' hours, ' + clock.m + ' minutes, ' + clock.s + ' seconds.';


				function padLeft(nr, n, str){
    				return Array(n-String(nr).length+1).join(str||'0')+nr;
				}
			});
		}
	);


	//Finished loading
	var d     = dataService;
	var today = dataService.today;
	var l     = dataService.list;
	$q.all([d.ready.days.promise, d.ready.userInfos.promise]).then(function(){
		console.log('d',d);
		console.log('today',today);

		var stopGaps = t.stopGaps;

		try{
			//Find user's time in list.
			var time;
			for(i in l.days[today]){
				var obj = l.days[today][i];
				if(obj.userid == d.currentUser){
					time = obj.time;
					break;
				}//if
			}//for


			//Get shift "you work" data.
			var youWork = {};
			youWork.start = todayFromClock(time[0]                ).format('hh:mm a');
			youWork.end   = todayFromClock(time[time.length-1]).format('hh:mm a');
			$scope.shiftToday = youWork.start + ' to ' + youWork.end;//d.formatTime({time:time});


			//Convert stop gaps to data.
			for(s in time){
				var stopGap  = {};
				stopGap.str  = time[s];
				stopGap.data = timestringToData(stopGap.str);
				stopGap.m    = now()
					.hours(stopGap.data.h)
					.minutes(stopGap.data.m)
					.seconds(0);

				//save gaps
				stopGaps.push(stopGap);

				//save breaks
				if(stopGaps.length%2===0)
					$scope.breaks.push(stopGap.m.format('hh:mm a'));
			}//for stopGap


			//last break is actually a clock out.
			$scope.breaks.pop();


		}//try
		catch(e){
			console.error('Error: couldn\'t read from dataService.list.\n'+
			              'Ajax probably failed to load.\n'+
			              'Or server could have sent a corrupted response.\n'
			);
		}

		try{
			$scope.name = d.user.name(d.currentUser).split(' ')[1];
		}
		catch(e){
			console.error('Error: couldn\'t read from dataService.user.\n'+
		                  'Ajax probably failed to load.\n'+
		                  'Or server could have sent a corrupted response.\n'
			);
		}

		$scope.progress = false; //reveal the welcomeinfo screen.
	});




	function now(){
		var actual = moment();
		var g = {
			h: actual.hour(),
			m: actual.minute(),
			s: actual.second(),
			ms: actual.millisecond(),
		};
		return moment(today*1000)
		.add(g.h, 'h')
		.add(g.m, 'm')
		.add(g.s, 's')
		.add(g.ms, 'ms');
	}
	function todayFromClock(str){
		var g = timestringToData(str);

		console.log('adding', g.h, g.m);
		return moment(today*1000)
			.hours(g.h)
			.minutes(g.m);
	}
	function timestringToData(str){
		str = str.toString();
		if(str.length < 4)
			str = '0'+str;

		return{
			h: str[0]+str[1],
			m: str[2]+str[3],
		};
		
	}
	function isWorkDay(shift){
		console.log('shift',shift);
		return true;
	}
	function generalForm(){
		return 'YYYY MMM Do [at] h:mm:ss a';
	}
}]);



