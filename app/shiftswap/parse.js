//parse.js
//Useful link: https://www.w3.org/TR/NOTE-datetime

var exports = module.exports = {};

var moment = require('moment'),
pad        = require('pad')
;

exports.json = {
    loose: (str)=>{
        if(typeof str === 'string' && typeof str != 'undefined')
            return JSON.parse(str);
        return str;
    },
    parsify: (obj, func)=>{
        func = func || function(a){return a};
        return JSON.parse(JSON.stringify(obj, func));
    },
    clean: (obj)=>{
        return exports.json.parsify(obj, (key, val)=>{     //look at keys in object
            if(key[0] === '_')                             //remove keys that begin with _
                return undefined;
            return val;
        });
    },
    cleanArray: (array)=>{
        if(typeof array != 'object')
            return console.error('Expected array.');
        for(var i = array.length; i--;){
            array[i] = exports.json.clean(array[i]);
        }
        return array;
    }
}
exports.access = (str1, str2, str3)=>{
    str = str1 + str2 + str3;
    var types = ["floor","manager","gm","admin","spec"];
    var out = [];
    //Must contain one of these types
    types.forEach(function(ty){
        if(str.toLowerCase().includes(ty)){
            var small = ty[0];
            out.push(small);
        }
    });
    return out;
}
exports.time = (str)=>{
    //Parses times into a standard HHMM military format
    //str is a string that must be in the form:
    // H: M am(pm)
    // H:MM am(pm)
    //HH.MM am(pm)
    //HH:MM am(pm)
    //HH:MM:SS am(pm)


    //str will also accept military formats including integer values:
    // HMM
    //HHMM

    //Warning: literal integers with a leftmost 0 are interpreted as octal numbers.
    //http://stackoverflow.com/a/27871169/4147786
    //http://stackoverflow.com/q/850341/4147786



    //Reject empty
    if(typeof str === 'undefined' || str === ''){ return console.error('Got an empty value instead of a string'); }

    //Reject wrong type
    if(typeof str === 'number'){str = String(pad(4,str,'0'));}
    if(typeof str != 'string'){return console.error('Got'+typeof str +' instead of a string'); }

    //Reject dates
    if(str.match(/[\/\\]/)){return console.error('Got a suspected date instead of a time string -- cannot contain slashes'); }    

    //Reject negatives
    if(str.match(/-/)){return console.error('Cannot contain negatives, minus sign'); }    

    //Use lowercase and remove trailing whitespace
    str = str.toLowerCase().trim();

    var regMilitary = /\d{3,4}(?![\s\w])/;
    if(str.match(regMilitary) === null){

        //Use colon separators
        str = str.replace(/\s\\\/\.-/g, ':');

        //Grab hours, minutes
        var array = str.match(/\d+/g);
        var errLength = false;
        var nextDigit = function(){
            do{
                if(array.length === 0){
                    errLength = true;
                    return;
                }
                var p = Number(array.shift());
            }while(p === NaN);
            return p;
        };

        //Reject if no digits found
        if(!array)
            return console.error('Time string must contain digits', str);

        //Reject if too many digits
        if(array.length > 2){
            return console.error('Got back too many values '+array+' from time string: '+str);
        }

        var h = nextDigit();
        var m = nextDigit();

        //Reject if not enough digits
        if(errLength){
            return console.error(str+' did not contain enough numbers');
        }

        //Reject out of range times
        if(h <= 0 || h >= 13){
            return console.error('Hours must be between 1 and 12. instead got: '+ h+' str:'+str);
        }
        if(m <= -1 || m >= 60){
            return console.error('Minutes must be between 0 and 59. instead got: '+ m+' str:'+str);
        }


        //Convert hours to military
        if(str.match('a') && h === 12){
            h=0;
        }
        else if(str.match('p') && h < 12){
            h+=12;
        }
        else if(str.match('p')){
            h=12;
        }
        else if(str.match('a')){
            ''; //do nothing
        }
        //Reject if missing am/pm
        else{
            return console.error('couldn\'t find am or pm in string ', str);
        }

        //Output the time in correct military HHHH standard.
        return exports.military.pad(h,m)
    }
    else{
        //Reject too long
        if(str.length > 4){
            return console.error('String was too long to be a military time: ', str);
        }
        //Pad too short
        else if(str.length > 2){
            str = pad(4,str,'0');
        }
        //Reject too short
        else{
            return console.error('String must be at least 3 digits long: ', str);
        }

        var h = Number( str[0] + str[1] );
        var m = Number( str[2] + str[3] );


        //Reject out of range times
        if(h <= -1 || h >= 25){
            return console.error('hours must be between 0 and 24. instead got: '+ h+' str:'+str);
        }
        if(m <= -1 || m >= 60){
            return console.error('minutes must be between 0 and 59. instead got: '+ m+' str:'+str);
        }

        //Output the time in correct military HHHH standard.
        return exports.military.pad(h,m);
    }
}
exports.date = {
    multi: function(str){
        //Parses dates into an object containing ISO, unix timestamp, and human-readable for maximum compatibility
        //ISO-8601 is in the format MM-DD-YYYY
        //Unixstamp is in the format seconds since Epoch
        //Human is displayed as Weekday, Month DDth YYYY
        var iso = exports.date.iso(str);
        var unix = exports.date.unix(str);
        var human = exports.date.human(str);

        if(typeof iso != 'string')
            return console.error('Failed to parse', iso);

        console.log('iso',iso);
        return {
            iso:   iso,
            unix:  unix,
            human: human,
        };
    },
    unix: function(str){
        //Parse unix
        if(typeof str === 'number' || countDigitsInNumber(parseInt(str)) === str.length){
            if(str.length === 10)
                str = str + '000';
            return str;
        }
        //Parse iso
        return moment(str,'MM-DD-YYYY').utc().unix();
    },
    human: function(str){
        return moment(str,'MM-DD-YYYY').utc().format('dddd, MMMM Do YYYY');
    },
    unixToday: function(str){
        var today = moment();
        today = today.
        return moment(str, 'MM-DD-YYYY').utc().unix();
    },
    build: function(month, day, year){
        var iso = pad(2,month,'0')+'-'+pad(2,day,'0')+'-'+pad(4,year,new Date().getUTCFullYear());
        return exports.date.multi;
    }
    iso: function(str){
        //Parses dates into a standard MM-DD-YYYY ISO-8601 format
        //str is a string in the form:
        //MM-DD
        //MM-DD-YY
        //MM-DD-YYYY
        //YYYY-MM-DD
        //MM/DD
        //MM\DD
        //MM DD
        //SSSSSSSSSSSSSS+ (also accepts unixstamp in seconds)


        //Reject empty
        if(str === null){
            return console.error('String cannot be empty or null');
        }

        //Assume no parameter means today
        if(typeof str === 'undefined' || str === ''){
            console.log('Assume no parameter means today',str);
            var today = new Date();
            return pad(2,(today.getUTCMonth()+1),'0')+'-'+pad(2,today.getUTCDate(),'0')+'-'+today.getUTCFullYear();
        }

        //Parse Unix timestamps
        if(typeof str === 'number' || countDigitsInNumber(parseInt(str)) === str.length){
            if(str.length === 10)
                str = str + '000';
            var today = new Date(Number(str));
            return pad(2,(today.getUTCMonth()+1),'0')+'-'+pad(2,today.getUTCDate(),'0')+'-'+today.getUTCFullYear();
        }

        //Reject invalid types
        if(typeof str != 'string'){ return console.error('Got a '+typeof str+' instead of a string', str); }

        //Reject bad formats, reject time
        var iso = new Date(str);
        if(iso === 'Invalid Date'){ return console.error('In parse.date,'+str+' is an invalid date format.'); }

        //Reject time
        if(str.match(':')){return console.error('Got a suspected time instead of a date string -- cannot contain colons'); }    

        

        //Use dash separators
        str = str.replace(/[\s\\\/\.-]/g, '-');

        //Add year if missing eg: MM-DD becomes MM-DD-YYYY
        if(str.split('-').length === 2){
            str = str + (new Date().getFullYear());
        }

        //Grab month, day, year
        var array = str.match(/\d+/g);

        if(!array){return console.error('Date string expecting numbers',str);}
        if(array.length > 3){return console.error('Too many placeholders in date string',str);}
        if(array.length < 3){return console.error('Not enough placeholders in date string',str);}
        var m = Number(array[0]);
        var d = Number(array[1]);
        var y = Number(array[2]);

        if(m > 1000 && m < 6000){
            //Assume correct ISO format YY-MM-DD
            y = array[0];
            m = array[1];
            d = array[2];
        }


        //Reject out of range dates
        if(d <= 0 || d >= 32){
            return console.error('days must be between 1 and 31. instead got: '+ d+' str:'+str);
        }
        if(m <= 0 || m >= 13){
            return console.error('months must be between 1 and 12. instead got: '+ m+' str:'+str);
        }

        //Convert YY to YYYY
        if(String(y).length == 2){
            var y1 = String(y);
            var y2 = String(new Date().getFullYear());
            y = y2[0]+y2[1]+y1[0]+y1[1];
        }

        //Output correct ISO 8601: YYYY-MM-DD
        //example:                 2016-07-11
        return String(y)+'-'+
        pad(2,String(m),'0')+'-'+
        pad(2,String(d),'0');

        function countDigitsInNumber(num){
            return Math.log(num) * Math.LOG10E + 1 | 0;
        }
    },
    forceCurrentWeek: function(str){
       str = exports.date.iso(str);

        var origDay  = moment(str).day();
        var scaleDay = moment().day() - origDay;
        return exports.date.iso(  moment().subtract(scaleDay, 'days').unix()*1000  );
    },
};
exports.military = {
    add: function(a, b){
        //Adds two military times together, outputs the result.
        //Both values must be strings 4 characters long in HHHH format.

        function toHM(mili){
            return {
                h: Number(mili[0] + mili[1]),
                m: Number(mili[2] + mili[3]),
            };  
        }
        var x = toHM(a);
        var y = toHM(b);

        var total = {
            h: x.h + y.h,
            m: x.m + y.m,
        }

        total.h += Math.floor(total.m/60);
        total.m  = total.m%60;

        return exports.military.pad(total.h,total.m);

    },
    pad: function(a,b){
        //Pads/creates a 4 digit long military time string.
        //Accepts:
        //(Object {h,m})
        //(string h, string m)
        //(number h, number m)

        if(typeof a === 'string' && typeof b === 'string'){
            a = Number(a);
            b = Number(b);
        }
        else if(typeof a === 'string'){
            //f(  HH) => returns HHHH
            //f( HHH) => returns HHHH
            a = a.trim();
            if(a == '' || !a.match(/d+/))  return console.error('Expecting digits');
            return pad(4, a, '0');
        }
        if(typeof a === 'object'){
            b = a.m;
            a = a.h;
        }
        if(typeof a === 'number' && typeof b === 'number'){
            //f(h,m) => returns HHHH

            //Reject out of range times
            if(a <= -1 || a >= 25){
                return console.error('hours must be between 0 and 24. instead got: '+ a);
            }
            if(b <= -1 || b >= 60){
                return console.error('minutes must be between 0 and 59. instead got: '+b);
            }

            h = String(a);
            m = String(b);
            return pad(2,h,'0') + pad(2,m,'0');
        }
        else{
            return console.error(
            'Invalid arguments to padMilitary. Accepts (string), (object), and (number, number).\n'+
            'Object = {h,m} where h = hours and m = minutes.'
            );
        }
    }
};
exports.schedule = {
    pretty: function(schedule){
        return schedule;
    },
}
