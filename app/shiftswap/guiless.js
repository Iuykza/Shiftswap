//gui-less.js
//A text based way of interfacing with the ShiftSwap server.

var S = require('string');
var moment = require('moment');



var verbList = [
	'today','now',
	'yesterday','prev',
	'tomorrow','next',

	'monday','tuesday','wednesday','thursday','friday','saturday','sunday',
	
	'nextshift',
	'prevshift',

	'date',
	
	'alarm','warm','remind',
	'alarms','alarm get','getalarm',

	'break',
	'end','out',
	'user',

    'sign in','signin',
    'sign up','signup',
    'sign out','signout',

    'passchange', 'change pass', 'pass reset', 'resetpass',

];

var verbBuild = {
    today: {cm: 0},
    now: {dup: 'today'},

    yesterday: {cm: 0},
    prev: {dup: 'yesterday'},

    tomorrow: {cm: 0},



    user: {cm: 1},


};



function readString(str){
	/*Takes a string and converts it into something the computer understands*/
	str = prepare(str);

	words = str.split(' ');
	//remove bad words
	for(var i=0, len=words.length; i<len; i++){
		var word = words[i];
		if(word.trim() === '' || 
           verbList(word
		){

		}

	}
}

function prepare(str){
	str = str.trim().tolower();
	return str;
}



day = {
	specifiedDay: (day)=>{
        return;
	},
	today: ()=>{
        var t = moment().unix();
        return specifiedDay();
	},
	yesterday: ()=>{
        var t = moment().subtract(1,'days').unix();
        return specifiedDay();
	},
	tomorrow: ()=>{
        var t = moment().add(1,'days').unix();
        return specifiedDay();
	},
    dayOfWeek: (day)=>{
        var t = moment().day(day).unix();
        return specifiedDay(t);
    },
    monday:    ()=>dayOfWeek('mon'),
    tuesday:   ()=>dayOfWeek('tue'),
    wednesday: ()=>dayOfWeek('wed'),
    thursday:  ()=>dayOfWeek('thu'),
    friday:    ()=>dayOfWeek('fri'),
    saturday:  ()=>dayOfWeek('sat'),
    sunday:    ()=>dayOfWeek('sun'),

    this:    day.today,
    current: day.today,
    now:     day.today,
    present: day.today,
    next:    day.tomorrow,
    future:  day.tomorrow,
    later:   day.tomorrow,
    last:    day.yesterday,
    past:    day.yesterday,
    prev:    day.yesterday,

    mon: day.monday,
    tue: day.tuesday,
    wed: day.wednesday,
    thu: day.thursday,
    fri: day.friday,
    sat: day.saturday,
    sun: day.sunday,
};
shift = {
    clock: (sid)=>{

    },
	start: (sid)=>{

	},
    break: (sid)=>{

    },
    return: (sid)=>{

    },
    end: (sid)=>{

    },

    begin:   shift.start,
    open:    shift.start,
    head:    shift.start,
    close:   shift.end,
    term:    shift.end,
    tail:    shift.end,
    foot:    shift.end,
    leave:   shift.end,

};
owner = {
	name: (str)=>{
        //defaults to self.

        //and grab data.
	},
};
session = {
  login: (uid)=>{
    
   },
   logout: (uid)=>{

   },
   admin: (uid)=>{

   },
};
auth = {
    matienanceServer: ()=>{

    },
    resumeServer: ()=>{

    },
	killUser: (uid)=>{

	},
	noPass: (uid)=>{

	},

};
alarm = {
	user: (uid)=>{

	},
	make: (aid)=>{

	},
	check: (aid)=>{

	},
	expire: (aid)=>{

	},
};