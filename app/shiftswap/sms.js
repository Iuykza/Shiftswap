//sms.js
//The sms interface for Shiftswap

var exports = module.exports = {};

var _      = require('lodash'),
moment     = require('moment'),
S          = require('string'),

config = require("app/_config/twilio.json"),
twilio  = require('twilio')(config.id, config.token)
;


exports.parseIncoming = (req, res, db, parse, get)=>{
    get = get || {};

    var number = get.number;

    db.users.getByPhone(number, callbackUID);
    function callbackUID(err, uid){
        if(err){
            return console.error(err);
        }

        var body     = S(get.body).toLowerCase().collapseWhitespace().s;
        var found  = false;

        if(!uid){
            return exports.send(number, 'Who are you?  Reply back with "This is ..."');
        }

        var commands = [
            {
                name:'echo',
                f: ()=>{
                    exports.send(number, body);
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
                    exports.send(number, body);
                },  
            },
            {
                name:'today',
                alias:['now'],
                f: ()=>{
                    //First get schedule by UID
                    var today = parse.date.unixToday();
                    db.schedule.getByUID(today, today, uid, function(err, schedule){
                        if(err)
                            return console.error(err);

                        schedule = schedule[0]; //grab only the first schedule
                        body = parse.schedule.pretty(schedule); //make it pretty
                        exports.send(number, body); //text it
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

        //Match their text to the list of commands above
        for(var i=commands.length; i--;){
            var command = commands[i];
            if(S(body).contains(command.name)){
                body = S(body).chompLeft(command.name+' ').s;
                params = body.split(' ');
                command.f(params);
                found = true;
            }
        }
        if(found){
            return body;
        }

        //Reaching this point means nothing matched
        body = "Sorry didn't understand that.  For a list of commands type help.  For help on a specific command type the command and help.";
        exports.send(number, body);
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
