//db.js
//Communicates with the Mongo database

var exports = module.exports = {};

var parse = require("app/shiftswap/parse"),
schema = require("app/shiftswap/schema"),
serverConfig = require('app/_config/server.json')
;

var model = schema.model;

exports.schedule = {
    find: (start, end, get, callback)=>{
        get   = get || {};
        start = parse.date.unix(start);
        end   = parse.date.unix(end  );

        //default start to today
        if(!start){

        }

        //default end to 7 days
        if(!end){
            end = -7;
        }

        //negative values are x days forward.
        if(end < 0){
            var secondsInDay = 60 * 60 * 24;
            end = Number(start) + Number(secondsInDay*Math.abs(end));
            end = String(end);
        }

        query = {$and: [
            {'date.unix': {$gte: start}},
            {'date.unix': {$lte: end}},
            get,
        ]};

        console.log(JSON.stringify(query));

        model.Schedule.find(query, function(err, data){
            console.log(data, callback);
            if(callback){
                callback(err, data);
            }
        });
    },
    getFloor:   (start, end, callback)=>     { getAll(start, end, {access: 'f'}, callback) },
    getManager: (start, end, callback)=>     { getAll(start, end, {access: 'm'}, callback) },
    getByUID:   (start, end, uid, callback)=>{ getAll(start, end, {uid: uid   }, callback) },
    insert: (data,callback)=>{
        new model.Schedule(data).save(()=>{
            if(callback)
                callback();
        });
    },
    replaceSection: (uid, data, callback)=>{
        if(!Array.isArray(data)){
            if(typeof data === 'object'){
                data = [data];
            }else{
                return console.error('Data must be of type array');
            }
        }


        /*** 1. Get timespan ***/
        var low = Infinity;
        var high = -Infinity;

        for(var i=data.length; i--;){
            data[i].date = parse.date.convertToRaw(data[i].date);

            if(data[i].date.unix < low){
                low = data[i].date.unix;
            }

            if(data[i].date.unix > high){
                high = data[i].date.unix;
            }
        }


        /*** 2. Delete data within timespan ***/
        var query = { $and: [
            {'date.unix': {$gte: low}},
            {'date.unix': {$lte: high}},
            {'uid': uid},
        ]};

        model.Schedule.find(query).remove(insert);


        /*** 3. Insert **/
        function insert(){
            new model.Schedule(data).save(()=>{
                if(callback)
                    callback();
            });
        }
    },
};
exports.users = {
    getUser: (query, callback)=>{
        query = query || {};
        model.User.find(query, (err, users)=>callback(err,users) );
    },
    getManagers: (callback)=>{

    },
    getFloor: (callback)=>{

    },
    getByPersonNum:(get, callback)=>{ exports.users.getUser({'personNum': get}, callback)},
    getByBadge:    (get, callback)=>{ exports.users.getUser({    'badge': get}, callback)},
    getByUID:      (get, callback)=>{ exports.users.getUser({      'uid': get}, callback)},
    getByPhone:    (get, callback)=>{ exports.users.getUser({    'phone': get}, callback)},
    getByEmail:    (get, callback)=>{ exports.users.getUser({    'email': get}, callback)},
    getAll:        (callback     )=>{ exports.users.getUser({}                , callback)},
    insert: (data,callback)=>{
        new model.User(data).save(()=>{
            if(callback)
                callback();
        });
    }
};
exports.userPrivate = {
    getByUID: (get, callback)=>{
        model.UserPrivate.find({'uid': get}, (err, docs)=>callback(err,docs) );
    },
};
exports.trades = {
    getTrade: (query, callback)=>{
        query = query || {};
        model.Trade.find(query, (err, docs)=>callback(err,docs) );
    },
    getSinceTime:    (get, callback)=>{ exports.trades.getTrade({'date.unix':  get}, callback)},
    getByUID:        (get, callback)=>{ exports.trades.getTrade({      'uid':  get}, callback)},
    getForTrade:     (callback     )=>{ exports.trades.getTrade({    'state':  1  }, callback)},
    getForApproval:  (callback     )=>{ exports.trades.getTrade({    'state':  2  }, callback)},
    getComplete:     (callback     )=>{ exports.trades.getTrade({    'state':  3  }, callback)},
    getIncomplete:   (callback     )=>{ exports.trades.getTrade({    'state': -1  }, callback)},
    getLastApproval: (callback     )=>{ exports.trades.getTrade({
        'state': 3,
        'date.unix': -3
    }, callback)},
};
exports.history = {
    get: (query, callback)=>{
        query = query || {};
        model.History.find(query, (err, docs)=>callback(err,docs) );
    },
};
exports.rewards = (callback)=>{

};
exports.site = (callback)=>{

};

var private = {

};
