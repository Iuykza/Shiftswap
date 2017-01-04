//sms.js
//The sms interface for Shiftswap

var exports = module.exports = {};

var _      = require('lodash'),
moment     = require('moment'),
pad        = require('pad'),

clicksend  = require('app/clicksend'),
readConfig = require("app/_config/clicksend.json"),
;

//Get authentication from file.
var config = clicksend.configuration;
config.apikey       = readConfig["api-key"];
config.username     = readConfig["user"];
config.dedicatedNum = readConfig["dedicated-number"];


exports.sms = {
    get: (req, res, callback)=>{
        clicksend.SMSController.getInboundSms(function(err, smsRes){
            if(err)
                return console.err(error);

            callback(parseCommand(smsRes));
        });

    },
    send: (req, res)=>{
        var number  = JSON.parse(req.params.number);
        var msg     = 'hello world';
        sendTxt(msg, number, (smsRes)=> res.send(smsRes));
    },
};

var private = {
    parseCommand: function(str){
        var aliases = [
            {key:'today', val:['today','now']},
            {key:'alarm', val:['alarm','warn','remind']},
            {key:'break', val:['break']},
            {key:'end',   val:['end','out','finish','done']},
        ];

        return {
            command: 'schedule',
            options: 'today',
            personModifier: null,
            raw: str
        };

    },
    sendTxt: function(body, number, callback){
        clicksend.SMSController.sendSms({
            "messages":[{
                "from": dedicatedNum,
                "body": msg,
                "to":   "+1"+number,
                "custom_string": "uid: 1001, sid: 10, role: [floor,admin]",
            }]
        }, function(err, smsRes){
            if(err)
                return console.err(error);
            callback(smsRes);
        });
    };

    }
};
