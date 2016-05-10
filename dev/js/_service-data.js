angular.module('scheduleApp')
.service('dataService', [function(dataService, $scope){



	this.unix = {
		dayName: (unix, extraDays) => unixStd(unix, extraDays).format("ddd"),
		date:    (unix, extraDays) => unixStd(unix, extraDays).format("MM/DD"),
		add:     (unix, extraDays) => unixStd(unix, extraDays).unix(),
	};

	function unixStd(unix, extraDays){
		return moment(unix*1000).add(extraDays || 0, 'days');
	}



	this.formatTime = function(t){
		t = t || {};
		var timeArray      = t.time     || '';
		var enableDetail   = t.detail   || false;
		var enableMilitary = t.military || false;

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
			var formattedLong = '<div>';

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

			return formattedLong+'</div>';
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



}]);