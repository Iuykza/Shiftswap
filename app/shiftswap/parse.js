//parse.js
//Useful link: https://www.w3.org/TR/NOTE-datetime

var exports = module.exports = {};

var moment = require('moment'),
_          = require('lodash'),
pad        = require('pad')
;

const TIMEZONE_OFFSET_SECS = -21600;


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

    //str is rejected if it contains slashes, because it is assumed a date.


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
    //If not a military time
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

    //If is a military time
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
    makeUTC: function(y, m, d){
        //Accepts raw data where
        // y = year
        // m = month
        // d = day

        //Also accepts a UTC unix timestamp where
        // y = unixstamp

        if(typeof y != undefined &&
           typeof m === undefined &&
           typeof d === undefined){
            //possibly sent a unix timestamp
            
            var secondsInDay = 60 * 60 * 24;
            var unix = y;
            unix = unix - (unix % secondsInDay); //Remove hours, minutes, seconds.
            unix = unix - secondsInDay; //Remove extra day
            return unix/1000;
        }
        //Otherwise sent raw
        return (Date.UTC(y,m-1,d)/1000);
    },
    unix: function(str){
        //Parse unix
        if(!str)
            return;

        if(typeof str === 'object' && str.unix){
            str = str.unix;
        }
        if(typeof str === 'number' || countDigitsInNumber(parseInt(str)) === str.length){
            if(str.length === 13)
                str = str.substr(0,10);
            return str;
        }
        //Parse iso
        return moment(str,'MM-DD-YYYY').unix();
    },
    humanize: function(str, format){
        format = format || 'MM-DD-YYYY'; 
        return moment(str,format).utc().format('dddd, MMMM Do YYYY');
    },
    unixToday: function(){
        var today = new Date();
        today = exports.date.makeUTC(today.getUTCFullYear(), today.getUTCMonth()+1, today.getUTCDate());
        console.log('today',today);
        return today;
    },
    stringAmerican: function(month, day, year){
        return pad(2,month,'0')+'-'+pad(2,day,'0')+'-'+pad(4,year,new Date().getUTCFullYear());
    },
    stringISO: function(year, month, day){
        return pad(4,year,new Date().getUTCFullYear())+'-'+pad(2,month,'0')+'-'+pad(2,day,'0');
    },
    convertToRaw: function(get){
        var raw={};

        /*** 1. Get type ***/
        var type = exports.date.identify(get);
        console.log(exports.date.identify, type);


        
        if(!type){
            return;
        }
        
        if(type === 'empty'){//empty is used case by case
            return -1;
        }
        
        if(type === 'full'){ //echo if correct
            return get;
        }
        

        /*** 2. Salvage everything to raw. ***/
        switch(type){
            case 'raw':
               raw.y = String(get.y);
               raw.m = String(get.m);
               raw.d = String(get.d);
                break;
            case 'raw-p':
                raw.yyyy = String(get.yyyy);
                raw.mm   = String(get.mm);
                raw.dd   = String(get.dd);

                raw.y = String(get.yyyy);
                raw.m = String(get.mm);
                raw.d = String(get.dd);
                break;
            case 'unix':
                var get = unixToRaw(get.unix || get);
                raw.y = String(get.y);
                raw.m = String(get.m);
                raw.d = String(get.d);
                break;
            case 'iso':
                var get = isoToRaw(get.iso || get);
                raw.y = String(get.y);
                raw.m = String(get.m);
                raw.d = String(get.d);
                break;
            default:
                return console.error('Unknown type sent: '+type);
                break;
        }

        /*** 3. Convert raw to everything. ***/
        //Add full year to raw.y
        console.log(raw.y);
        if(String(raw.y).length === 2){
            var curr = String(raw.y);
            var temp = String(new Date().getUTCFullYear());
            raw.y = temp[0] + temp[1] + curr[0] + curr[1];
        }
        console.log(raw.y);

        //Unix from raw
        raw.unix = Date.UTC(raw.y, Number(raw.m)-1, raw.d) / 1000;  

        //raw padded from raw
        raw.yyyy = raw.y;
        raw.mm   = pad( 2, raw.m,'0' );
        raw.dd   = pad( 2, raw.d,'0' );

        //iso from raw padded
        raw.iso = raw.yyyy+'-'+raw.mm+'-'+raw.dd;

        //human
        raw.human = exports.date.humanize(raw.iso,'YYYY-MM-DD');

        return raw;

    },
    identify: function(get){
        //Empty, null or undefined
        if(!get){
            return 'empty';

        //Array
        }else if(Array.isArray(get)){
            return console.error('Arrays not allowed', get);

        //Object with syntax
        }else if(typeof get === 'object'){
            var type = 'empty';
            var has = function(props){
                if(typeof props === 'string')
                    props = [props];
                return props.every( (prop)=> get.hasOwnProperty(prop) );
            }

            if( has(['y','m','d','yyyy','mm','dd','unix','iso','human']) )
                return 'full';

            if( has(['y','m','d']) )
                return 'raw';
            
            if( has(['yyyy','mm','dd']) )
                return 'raw-p';

            if( has('iso') )
                type = 'iso';

            if( has('unix') )
                type = 'unix';
                
            return type;

        //Number or String
        }else if(typeof get === 'number' || typeof get === 'string'){

            if(Number(get) < 0){
                return 'negative';
            }

            get = String(get);
            if(countDigitsInNumber(parseInt(get)) === get.length){
                return 'unix';
            }
            return 'iso';

        //???
        }else{
            return console.error('Unknown type not allowed', get);
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
    },
    toStandard: function(str, shorten, end){
        /*Accepts:
        str = a military HHMM string, assuming valid data.
        short = a boolean that determines if minutes 00 are removed.
        end = a boolean that determines if the suffix am|pm is on the return string.  Defaults to true.

        Returns:
        a string in standard time using h:mm am|pm format.
        */

        if(typeof end === 'undefined'){
            end = true;
        }

        console.log('toStandard ', str, end);

        var hour = Number(str[0] + str[1]);
        var min = str[2] + str[3];
        var suffix = "";

        //Add the am, pm suffix
        if(end){
            if(hour < 12){
                suffix = 'am';
            }else{
                suffix = 'pm'
            }
        }

        //change 1300, 1400, 1500 into 1pm, 2pm, 3pm ...
        if(hour >= 13){
            console.log(str, '', hour, typeof hour, hour%12);
            hour = hour % 12;
            console.log(hour);
        }
        //change 0000 into 12am
        if(hour === 0){
            hour = 12;
        }

        if(shorten && min === '00'){
            return `${hour}${suffix}`;
        }else{
            return `${hour}:${min}${suffix}`;
        }
    },

};
exports.schedule = {
    pretty: function(sched, enableLong){
        if(!sched || objectIsEmpty(sched)){
            return "No data beyond this point.";
        }

        var start = sched.time[0];
        var startMinutes = Number(start[0] + start[1])*60 + Number(start[2] + start[3]);

        var m = moment((sched.date.unix - TIMEZONE_OFFSET_SECS + (Number(startMinutes)*60) )*1000);
        var stdTime = exports.military.toStandard;

        var prettyStart  = stdTime(sched.time[0],true);
        var prettyEnd    = stdTime(sched.time[sched.time.length-1],true,false);
        var prettyDate   = m.calendar().split(' ')[0] +' '+ m.format('MMM Do');
        var prettyDetail = sched.detail[0];

        var fromNow = m.fromNow();
        var verb = [];
        var tense = fromNow.substr(-3) === 'ago';

        return `You ${tense? 'worked' : 'work'} ${prettyDate} from ${prettyStart} to ${prettyEnd} as ${prettyDetail}. `+
               `This ${tense? 'was' : 'is'} ${fromNow}.`;
    },
};
exports.phone = function(str){
    var regexJunk = /\w-\+\(\)/;
    //1. Remove whitespace, dashes, plus sign, parenthesis.
    //2. Prepend country code if too short.
    return str;
};







function countDigitsInNumber(num){
    return Math.log(num) * Math.LOG10E + 1 | 0;
}

function objectIsEmpty(obj){
    return Object.getOwnPropertyNames(obj).length === 0;
}

function isUnixToday(unix){
    return exports.date.unixToday() === Number(unix);
}





function isoToRaw(str){
    //Parses dates into an object containing year, month, day.
    //str is a string in the form:
    //MM-DD
    //MM-DD-YY
    //MM-DD-YYYY
    //YYYY-MM-DD
    //MM/DD
    //MM\DD
    //MM DD


    /*** 1. Reject bads ***/
    //Reject empty
    if(!str){
        return console.error('ISO cannot be empty or null');
    }

    //Reject invalid types
    if(typeof str != 'string'){ return console.error('Got a '+typeof str+' instead of a string', str); }

    //Reject bad formats, reject time
    var iso = new Date(str);
    if(iso === 'Invalid Date'){ return console.error('In parse.date,'+str+' is an invalid date format.'); }

    //Reject time
    if(str.match(':')){return console.error('Got a suspected time instead of a date string -- cannot contain colons'); }    



    /*** 2. Parse ***/
    //Use dash separators
    str = str.replace(/[\s\\\/\.-]/g, '-');

    //Add year if missing eg: MM-DD becomes MM-DD-YYYY
    if(str.split('-').length === 2){
        str = str + (new Date().getUTCFullYear());
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
        var y2 = String(new Date().getUTCFullYear());
        y = y2[0]+y2[1]+y1[0]+y1[1];
    }

    /*** 3. Output raw ***/

    //Output correct ISO 8601: YYYY-MM-DD
    //example:                 2016-07-11
    return {
        y: y,
        m: m,
        d: d,
    };
}



























function unixToRaw(unix){
    //unixToRaw f()
    //converts a unix string to an object containing year, month, day.
    //Assumes a string or number at least 10 digits long.
    //13 digit long strings will be considered in milliseconds and converted to seconds.

    unix = Number(unix);

    //Convert millisecs to secs (assuming we don't need dates in the year 2283)
    if(countDigitsInNumber(unix) === 13){
        unix = unix / 1000;
    }

    var date = new Date(unix);
    return {
        y: Number(date.getUTCFullYear()),
        m: Number(date.getUTCMonth()+1),
        d: Number(date.getUTCDate()),
    };
}