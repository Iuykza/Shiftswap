angular.module('scheduleApp')
.controller('scheduleMain', ['$scope', '$q', '$route', 'ajaxService', 'dataService',
function($scope, $q, $route, ajaxService, dataService){

	$scope.unix       = dataService.unix;
	$scope.formatTime = dataService.formatTime;
	$scope.user       = dataService.user;
	$scope.list       = dataService.list;
	$scope.friday     = dataService.friday;
	$scope.today      = dataService.today;
	$scope.timespan   = 2;
	$scope.ched       = dataService.schedule;

	$scope.refresh = function(){$route.reload();console.log('reloading!');};
	$scope.militaryTimeEnable = dataService.militaryTimeEnable;

	$scope.tmp = dataService.tmp;



	/*** Initial load and entry point ***/

	var list  = $scope.list;
	var ready = dataService.ready;
	
	ajaxService.getUsers(function(res){
		list.userInfos = res.data;
		list.fuzzy = makeFuzzy(list.userInfos);
		ready.userInfos.resolve(res);
		console.log('getusers finished');
	});
	console.log($scope.friday, 'friday');
	ajaxService.getWeek('floor', $scope.friday, function(res){
		dataService.ready.days.resolve(res);
		rend($scope.today);
		console.log('week finished');
	});

	var readyday  = ready.days.promise,
	    readyinfo = ready.userInfos.promise;
	
	$q.when(readyday, readyinfo).then(function(){

	});
	

	/**************************                    **************************/
	/*************************   Function Methods   *************************/
	/**************************                    **************************/

	function rend(timeStart){
		console.log('rend started');
		//not rendered?
		if(!$scope.list.render || !$scope.list.render[timeStart]){
			ready.days = $q.defer();

			//get data if necessary & render it

			$q.when(readyday).then(callbackGetData);
		}

		function callbackGetData(res){
			//empty list or needed days missing
			if(!$scope.list.days || !$scope.list.days[timeStart]){
				//go get them, and build it
				console.log('start');
				ajaxService.getWeek('floor', timeStart, callbackParse); 
			}else{
				//just build it
				callbackBuild();
			}
		}
		function callbackParse(res){

			if(!res){
				return console.error('Response non-existent.');
			}
			if(res.error){
				return console.error(res.error);
			}

			//var data = res.data;
			var days = dataService.list.days;
			var userDatas = dataService.list.userDatas;
			//Response sends back a list of user schedule data.
			//Go through list and compare it to ours.

			for(var i=res.data.length; i--;){
				console.log('days',days);

				var newData = res.data[i];
				var exist = userDataExists(newData.uid);
				var existIndex = exist;

				//Don't have user in list, create new and append.
				if(exist === -1){
					userDatas.push({
						uid: newData.uid,
						data: [newData]
					});
				}
				else{
					//Append data to existing.
					userDatas[existIndex].data.push(newData);
				}


				existIndex = exist = dayExists(newData.date.unix);
				console.log(exist, existIndex);
				if(exist === -1){
					days.push({
						date: newData.date,
						data: [newData]
					});
				}
				else{
					days[existIndex].data.push(newData);
				}


					
			}//end for
			function userDataExists(uid){
				var userDatas = dataService.list.userDatas;
				for(var i=userDatas.length;i--;){
					if(userDatas[i].uid === uid)
						return i;
				}
				return -1;
			}
			function dayExists(unix){
				var days = dataService.list.days;
				for(var i=days.length;i--;){
					if(days[i].date.unix === unix){
						return i;
					}
				}
				return -1;
			}

			callbackBuild();
		}//end function parse
		function callbackBuild(res){
			//$scope.list.render[timeStart];
			console.log('data finished');

		}
	}//end function rend





	/**************************                    **************************/
	/*************************   Function Methods   *************************/
	/**************************                    **************************/

	$scope.find = {
		schedule: (userid, day, offset) => $scope.formatTime({
			time:     $scope.data.data(userid, day, offset).time,
			detail:   $scope.detailEnable,
			military: $scope.militaryTimeEnable
		}),
		isMorning: (userid, day, offset) => $scope.data.data(userid, day, offset).time[0] < 1400,
		detail:    (userid, day, offset) => $scope.data.data(userid, day, offset).detail,
		class: function(userid, day, offset){
			var detail = $scope.data.detail(userid, day, offset);
			if(detail.toLowerCase().includes('concession')) return 'con';
			if(detail.toLowerCase().includes('usher'))      return 'ush';
			if(detail.toLowerCase().includes('box'))        return 'box';
			if(detail == '')                                return '';
			return 'mis';
		},
		data: function(uid, day, offset){
			var userDatas = dataService.list.userDatas;
			var index = userDataExists(uid);
			//day = day + offset
			
			if(index != -1){
				return userDatas[index].data;
			}

			function userDataExists(uid){
				for(var i=userDatas.length;i--;){
					if(userDatas[i].uid === uid)
						return i;
				}
				return -1;
			}
		}
	};









}]);


		// (function(){ //"this" is now scoped as $scope.list
		// 	var render = this.render;
		// 	var userDatas  = this.userDatas;

		// 	//Reject if list hasn't finished loading.


		// 	//Reject if list doesn't have data for this week.
		// 	var secsInDay = 60 * 60 * 24;
		// 	var friday = $scope.friday;
		// 	for(var i = 0; i <=6; i++){
		// 		if(typeof this.days[ friday+secsInDay*i ] === 'undefined'){
		// 			console.error('Rejected.  Missing data for the week.');
		// 			return;
		// 		}
		// 	}
			
			

		// 	//1 INPUT
		// 		//days object -> single day -> schedule data
		// 		for(var i in this.days){
		// 			var day = this.days[i];

		// 			for(var data of day){

		// 				//1.1. Get all users

		// 				//add this user if he isn't there.
		// 				if(render.indexOf(data.userid) === -1){
		// 					render.push(data.userid);
		// 				}

		// 				if(typeof userDatas[data.userid] === 'undefined'){
		// 					userDatas[data.userid] = {};
		// 				}


		// 				//1.2  Get user data
		// 				userDatas[data.userid][i] = data;

		// 			}//end for data
		// 		}//end for days

		// 		//2 SORT
		// 		$scope.list.render = _.sortBy(render, z => z);

		// }).call($scope.list);