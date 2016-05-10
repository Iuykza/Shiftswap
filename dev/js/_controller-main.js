angular.module('scheduleApp')
.controller('scheduleMain', ['$scope', 'dataService', 'ajaxService', function($scope, dataService, ajaxService){


	$scope.today              = 1460696400;
	$scope.friday             = getFriday();

	$scope.militaryTimeEnable = false;
	$scope.detailEnable       = false;
	
	$scope.list           = {
		userInfos: null, //Type:    Object
		                 //Descr:   User information of each user.
		                 //Depends: Independent.
		                 //Key:     UserID
		                 //         userInfos -> [{userInfo}, {userInfo}, {userInfo}]

		days: null,      //Type:    Array
		                 //Descr:   Schedule data organized by day.  
		                 //Depends: Independent.
		                 //Keys:     UNIX timestamp, UserID
		                 //         days -> day -> [{schedule}, {schedule}, ...]
		                 //              -> day -> [{schedule}, {schedule}, ...]
		                 //              -> ..

		userDatas: [],   //Type:    Array
		                 //Descr:   Schedule data organized by user.
		                 //Depends: Dependent to list.days.
		                 //Keys:     UserID, UNIX timestamp
		                 //         userDatas -> user -> [{schedule}, {schedule}, ..]
		                 //                   -> user -> [{schedule}, {schedule}, ..]
		                 //                   -> ..


		render: [],      //Type:    Array
		                 //Descr:   Used to determine whether or not a users exist
		                 //           within the current displayed schedule.
		                 //Depends: Dependent to list.days.
		                 //Key:     (None)
		                 //         render -> [{user}, {user}, {user}]

	};
	$scope.fuzzy = null;
	$scope.currentUser = null;

	$scope.unix       = dataService.unix;
	$scope.formatTime = dataService.formatTime;
	
	ajaxService.getUsers(function(res){
		$scope.list.userInfos = res.data;

		var fuzzyRay = [];
		for(var u in $scope.list.userInfos){
			fuzzyRay.push($scope.list.userInfos[u].name);
		}

		$scope.fuzzy = FuzzySet(fuzzyRay);

		$scope.renderWeek();
	});


	ajaxService.getWeek($scope.friday, function(res){
		//merge res.data onto listDays.
		$scope.list.days = res.data;

		$scope.renderWeek();
	});


	$scope.renderWeek = function(){
			render = [];
		(function(){ //"this" is now scoped as $scope.list
			var render = this.render;
			var userDatas  = this.userDatas;

			//Reject if list hasn't finished loading.
			if(this.userInfos === null || this.days === null)
				return;


			//Reject if list doesn't have data for this week.
			var secsInDay = 60 * 60 * 24;
			var friday = $scope.friday;
			for(var i = 0; i <=6; i++){
				if(typeof this.days[ friday+secsInDay*i ] === 'undefined')
					return;
			}

			//1 INPUT
				//days array -> single day -> schedule data
				for(var i in this.days){
					var day = this.days[i];

					for(var data of day){

						//1.1. Get all users

						//add this user if he isn't there.
						if(render.indexOf(data.userid) === -1){
							render.push(data.userid);
						}

						if(typeof userDatas[data.userid] === 'undefined'){
							userDatas[data.userid] = {};
						}


						//1.2  Get user data
						userDatas[data.userid][i] = data;

					}
				}

				//2 SORT
				$scope.list.render = _.sortBy(render, z => z);

		}).call($scope.list);

	};



	$scope.data = {
		schedule: (userid, day, offset) => $scope.formatTime({
			time:     $scope.data.data(userid, day, offset).time,
			detail:   $scope.detailEnable,
			military: $scope.militaryTimeEnable
		}),
		detail:   (userid, day, offset) => $scope.data.data(userid, day, offset).detail,
		class: function(userid, day, offset){
			var detail = $scope.data.detail(userid, day, offset);
			if(detail.toLowerCase().includes('concession')) return 'con';
			if(detail.toLowerCase().includes('usher'))      return 'ush';
			if(detail.toLowerCase().includes('box'))        return 'box';
			if(detail == '')                                return '';
			return 'mis';
		},
		data: function(userid, day, offset){
			if(typeof offset != 'undefined')
				day = $scope.unix.add(day, offset);
			var data = $scope.list.userDatas[userid][day];

			if(typeof data === 'undefined')
				return {id:'',  userid:'',  detail:'',  time:''};

			return data;
		}
	};
	$scope.user = {
		name: (userid => ($scope.list.userInfos[userid] || {name: ''}).name),
		IDfromName: (name => $scope.fuzzy.get(name)[0][1]),
		role: function(userid){
			var r = ($scope.list.userInfos[userid] || {role: []}).role;
			if(r.indexOf('concession') != -1){ return 'user-con'; }
			if(r.indexOf('box'       ) != -1){ return 'user-box'; }
			if(r.indexOf('usher'     ) != -1){ return 'user-usher'; }
		},
		start: function(userid){
			var r = ($scope.list.userInfos[userid] || {start: ''}).start;
			if(r === '')
				return;
			
			var year = 31556926*1000;
			r = r * 1000;

			if(Date.now() - r >= year*5){return 'user-year-5'}
			if(Date.now() - r >= year*3){return 'user-year-3'}
			if(Date.now() - r >= year*1){return 'user-year-1'}
		}
	}





	/*** Function Helpers ***/

	function getWeekBegin(str){
			return moment(str*1000).day(5).unix();
	}

	function getFriday(){
		return getWeekBegin($scope.today)
	};



}]);


