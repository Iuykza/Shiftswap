angular.module('scheduleApp')
.service('dataService', ['$q', 'ajaxService', function($q, ajaxService){
	var t = this;

var that = this;

	this.list = {
		userInfos: {},   //Type:    Object
		                 //Descr:   User information of each user.
		                 //Depends: Independent.
		                 //Key:     UserID
		                 //         userInfos -> [{userInfo}, {userInfo}, {userInfo}]

		days: [],        //Type:    Array of type object
		                 //Descr:   Schedule data organized by day.  
		                 //Depends: Independent.
		                 //Keys:     UNIX timestamp, UserID
		                 //         days(array) -> day -> [{schedule}, {schedule}, ...]
		                 //                     -> day -> [{schedule}, {schedule}, ...]
		                 //                     -> ..

		userDatas: [],   //Type:    Array of type object
		                 //Descr:   Schedule data organized by user.  Duplicated from days array.
		                 //Depends: Dependent to list.days.
		                 //Keys:     UserID, UNIX timestamp
		                 //         userDatas(array) -> user(obj) -> user.data(array) [{schedule}, {schedule}, ..]
		                 //                          -> user(obj) -> user.data(array) [{schedule}, {schedule}, ..]
		                 //                          -> ..

		fuzzy: {},      //Type:    Object
		                 //Descr:   Fuzzyset containing matches for each user.

	};
	
	this.currentUser = '10080';
	this.today       = 1480572000;
	this.friday      = 1480572000;//getWeekBegin(this.today);

	this.unix = {
		dayName: (unix, extraDays) => unixStd(unix, extraDays).format("ddd"),
		date:    (unix, extraDays) => unixStd(unix, extraDays).format("MM/DD"),
		add:     (unix, extraDays) => unixStd(unix, extraDays).unix(),
	};

	this.ready = {
		userInfos: $q.defer(),
		days:      $q.defer(),
	}

	this.tmp = {};

	





	
	var list = this.list;
	this.user = {
		name: (userid => (list.userInfos[userid] || {name: ''}).name),
		/*name: function(matchid){
			return list.userInfos.find(u => u.uid === matchid) || {name: ''};
		},*/

		IDfromName: (name => list.fuzzy.get(name)[0][1]),

		role: function(userid){
			var r = (list.userInfos[userid] || {role: []}).role;
			return (r.indexOf('concession') != -1)? 'user-con' :
			       (r.indexOf('box'       ) != -1)? 'user-box' :
			       (r.indexOf('usher'     ) != -1)? 'usher-usher' : '';
		},
		
		start: function(userid){
			var r = (list.userInfos[userid] || {start: ''}).start;
			if(r === '')
				return;
			
			var year = 31556926*1000;
			r = r * 1000;

			return (Date.now() - r >= year*5)?'user-year-5':
			       (Date.now() - r >= year*3)?'user-year-3':
			       (Date.now() - r >= year*1)?'user-year-1':'';
		},
		getInfoIndex: (uid)=>{
			//Finds a user's index based upon uid.
			//Returns index within userInfos.

			var userInfos = t.list.userInfos;
			for(var i = userInfos.length; i--;){
				var userInfo = userInfos[i];
				if(userInfo.uid === uid){
					return i;
				}
			}//end for
			return -1;
		},
		getDataIndex: (uid)=>{
			//Finds a user's index based upon uid.
			//Returns index within userDatas.

			var userDatas = t.list.userDatas;
			for(var i = userDatas.length; i--;){
				var userData = userDatas[i];
				if(userData.uid === uid){
					return i;
				}
			}//end for
			return -1;
		},
	};
	this.schedule = {
		getDay: (date)=>{
			//Loops through the days array until it finds a day that matches the given date.
			//Returns a day object

			//Input:
			//date = string value of a unix timestamp

			var found = null;
			for(var i = 0, len = list.days; i < len; i++){
				var day = list.days[i];
				if(day.date === date){
					found = day;
					break;
				}
			}

			if(found){
				return found;
			}
			else{
				return update(date);
			}
		},
		getDayIndex: (date, n, indexStart)=>{
			//Loops through the days array until it finds a day that matches the given date.
			//Returns an index.

			//Inputs:
			//date = a 
			//indexStart (optional) = the index from the day array to begin searching.

			date = t.unix.add(date, n);

			var found = null;
			for(var i = indexStart || 0, len = list.days; i < len; i++){
				var day = list.days[i];
				if(day.date === date){
					found = i;
					break;
				}
			}

			if(found){
				return i;
			}
			else{
				return update(date);
			}
		},
		getUserShift: (date, n, uid)=>{
			//Finds a user's shift from within a day.
			//Returns entire shift object.

			//Inputs:
			//date = ISO string, unix timestamp.
			//uid = the uid of the user to find.

			date = t.unix.add(date, n);

			var uIndex = t.user.getDataIndex(uid);
			if(uIndex === -1)
				return false;

			if(!t.list.userDatas[uIndex])
				return false;

			var uDatas = t.list.userDatas[uIndex].data;
			for(var i=uDatas.length;i--;){
				var uData = uDatas[i];
				//LEAK: unix/1000 could break 100+ years from now.
				if(uData.date === date || uData.date.unix === date || uData.date.unix/1000 === date || uData.date.iso === date){
					t.tmp = uData;
					return uData;
				}
			}
			return false;


		},
		usersActiveWeek: (date, days)=>{
			//Finds all users that are "active" for a particular schedule
			//returns integer array of UIDs

			//inputs:
			//date = a unix timestamp to begin the search.
			//days = number of days to consecutively search.

			var usersOfWeek = [];
			
			//days => day => shifts => shift.user
			for(var i = 0; i < days; i++){ //Look at each day
				var day = list.days[date];
				for(var j = 0, jlen = day.length; j < jlen; j++){ //Look at shifts of each day
					var shift = day[j];
					//Look at user that belongs to this shift
					//Save this user to the list
					usersMatchWeek.push(shift.uid);

				}
			}

			return usersOfWeek;
		},
		update: ()=>{


		},
		shiftMorningOrAfternoonOrBoth: ()=>{
			const MORNING_END = 1700;
			const AFTERNOON_START = 1400;

		},
		lastTimecardApproval: (date, uid)=>{
			//finds the last possible day a user can approve their timecard.

			//1. Look at Thursday.
			//0=sun, 1=mon, 2=tue, 3=wed, 4=thu, 5=fri, 6=sat
			const WEEK_ENDING = 4;
			var count = 0;
			do{

				//2. Is the user working this day?
				var day = this.schedule.getUserShift(date);
				var isWorking = typeof day === 'object';
				
				//2.1.
				if(isWorking){
				//   If Yes.
				//	   This is the day we want.
				//	   End.
					return date;
				}
				else{
				//   If No.
				//	   Look at the day before this one.
				//	   Disallow stepping more than 7 previous days.
				//	      This prevents an infinite loop.
				//   Goto 2.
				}
				count++;
			}while(count < 7);

			//3. Reaching this point means the user does not exist within the schedule


		},



	};

	this.formatTime = formatTime;


}]);






function unixStd(unix, extraDays){

	return moment(unix*1000).add(extraDays || 0, 'days');
}

function formatTime(t, military){

	t = t || {};
	var timeArray      = t.time     || '';
	var enableDetail   = t.detail   || false;
	var enableMilitary = military;



	if(typeof timeArray === 'undefined' || timeArray === '')
		return '';

	var first = timeArray[0];
	var last =  timeArray[timeArray.length-1];


	if(!enableDetail){
		//minimal, Military time
		if(enableMilitary){
			first = hour24(first);
			last  = hour24(last);

		//minimal, AM/PM time
		}else{
			first = hour12(first);
			last  = hour12(last);
		}
		return `${first} to ${last}`;

	}else{
		var formattedLong='';

		//Full detail
		for(var i = 0; i<timeArray.length; i++)
			formattedLong +=
				(i>0?                    //Excluding the first,
					(i%2==0?', ':' to ') //Separate durations on their own lines, add 'time to time' between both.
				:
					('')
				)+(enableMilitary?       //Use military format or standard.
					hour24(timeArray[i])
				:
					hour12(timeArray[i])
				);
		return formattedLong;
	}

	function hour12(str){
		str = str.toString();
		while(str.length < 4)
			str = '0'+str;

		var hour = str[0]+str[1];
		var min  = str[2]+str[3];
		var sign = ['am','pm'][(hour >= 12 && hour < 24) | 0];

		if(hour == 12 || hour == 24) //implicit typecast
			hour = 12;
		else
			hour = hour % 12;

		return `${hour}:${min}${sign}`;
	}
	function hour24(str){
		str = str.toString();
		while(str.length < 4)
			str = '0'+str;
		return str;

	}




}


/*** Function Helpers ***/

function getWeekBegin(str){

		return moment(str*1000).day(5).unix();
}

function makeFuzzy(from){
	var tmp = [];

	for(var u in from)
		tmp.push(from[u].name);

	return FuzzySet(tmp);
}



