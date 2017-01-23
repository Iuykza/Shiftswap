//sms.js
//The sms interface for Shiftswap

var exports = module.exports = {};

var _      = require('lodash'),
moment     = require('moment'),
S          = require('string'),

config = require("app/_config/twilio.json"),
twilio  = require('twilio')(config.id, config.token)
;

const TIMEZONE_OFFSET_SECS = -6 * (60*60);
const SECONDS_IN_DAY = 60*60*24;


exports.parseIncoming = (req, res, db, parse, get, callback)=>{
    get = get || {};

    var number = get.number;

    db.users.getByPhone(number.substr(-10), callbackUID);
    
    function callbackUID(err, docs){
        var user = docs[0];
        console.log(user.name);
        if(err){
            return console.error(err);
        }
        if(!user){
            //no user associated with number
            return callback(false, 'Who are you?  Reply back with This is ...');
        }

        var uid = user.uid;
        var body = S(get.body).toLowerCase().collapseWhitespace().s;



        var commands = [
            {
                name:'echo',
                f: ()=>{
                    callback(false, body);
                },
            },
            {
                name:'time',
                alias:['date','clock'],
                f: ()=>{
                    var m = moment.utc();
                    body = JSON.stringify({
                        human:   m.format('dddd, MMMM Do YYYY, h:mm:ss a'),
                        unix:    m.valueOf(),
                        iso8601: m.toISOString(),
                    });
                    callback(false, body);
                },  
            },
            {
                name:'ereyesterday',
                alias:['nudiustertian'],
                f: ()=>scheduleByDates(-2, false, false),
            },
            {
                name:'yesterday',
                f: ()=>scheduleByDates(-1, false, false),
            },
            {
                name:'today',
                alias:['now','t'],
                f: ()=>scheduleByDates(false, false, false),
            },
            {
                name:'tomorrow',
                alias: ['tt'],
                f: ()=>scheduleByDates(1, false, false),
            },
            {
                name:'overmorrow',
                f: ()=>scheduleByDates(2, false, false),
            },
            {
                name:'next',
                f: (params)=>{
                    var date = parseInt(new Date().valueOf()/1000) + TIMEZONE_OFFSET_SECS;
                    db.schedule.find({uid: uid, 'date.unix': {$gte:date/*-(60*60*24)*/}}, function(err, schedule){

                        if(err)
                            return console.error(err);

                        if(schedule.length === 0)
                            return callback(false, 'You are off');

                        var skip = Number(params[1]);
                        if(Number.isNaN(skip)){
                            skip = 0;
                        }
                        schedule = schedule[skip];

                        body = parse.schedule.pretty(schedule); //make it pretty
                        callback(false, body);
                    });
                },
            },
            {
                name:'alarm',
                val:['alarm','warn','remind'],
                f: ()=>{

                },
            },
            {
                name:'break',
                f: ()=>{

                },
            },
            {
                name:'end',
                alias:['end','out','finish','done'],
                f: ()=>{

                },
            },
            {
                name: 'shifts',
                f: ()=>{

                },
            }
        ];
        function scheduleByDates(DayOffset, countOffset, uidDiff){
            uid = uidDiff || uid;
            if(countOffset === undefined || countOffset === false){
                countOffset = 0;
            }
            if(DayOffset === undefined || DayOffset === false){
                DayOffset = 0;
            }

            

            var date = parseInt(new Date().valueOf()/1000) + TIMEZONE_OFFSET_SECS + DayOffset * SECONDS_IN_DAY;

            db.schedule.getByDateAndUID(date-SECONDS_IN_DAY, date, uid, function(err, schedule){

                if(err)
                    return console.error(err);

                if(schedule.length === 0)
                    return callback(false, 'You are off');

                schedule = schedule[countOffset]; //grab only the first schedule

                body = parse.schedule.pretty(schedule); //make it pretty
                callback(false, body);
            });
        };


        //Match their text to the list of commands above
        var found  = false;

        for(var i=commands.length; i--;){
            var command = commands[i];
            if(S(body).contains(command.name)){
                //body = S(body).chompLeft(command.name+' ').s;
                params = body.split(' ');
                command.f(params);
                found = true;
            }
        }
        if(found){
            return;
        }

        //Reaching this point means nothing matched
        body = "Didn't understand that command.  Need commands?  Type help.";
        callback(false, body);
    }

};
exports.send = (toNumber, msg, callback)=>{
    twilio.sendMessage({
        "to":   toNumber,
        "from": config.number,
        "body": msg,
    }, function(err, smsRes){
        if(callback)
            callback(err, smsRes);
    });
};

var private = {
    parseCommand: function(str){

    },
};
