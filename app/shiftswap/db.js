//db.js
//Communicates with the Mongo database

var exports = module.exports = {};

var parse = require("app/shiftswap/parse"),
_         = require("lodash"),
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
            end = Number(end);
        }

        query = { $and: [
            {'date.unix': {$gte: start, $lte: end}},
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
    insert: (datas,callback)=>{
        var errors = [];

        if(!Array.isArray(datas)){
            datas = [datas];
        }
        for(var i=datas.length; i--;){
            var data = datas[i];
            insertOne(data);
        }//end for

        function insertOne(data){
            if(!data.time || !data.uid || !data.date || !data.access)
                return callback('Body must include uid, date, access, and time.');
            if(!Array.isArray(data.time))
                return callback('time must be an array');
            if(typeof data.uid != 'number' && typeof data.uid != 'string')
                return callback('uid must be a number');
            if(data.detail && typeof data.uid != 'string')
                return callback('detail must be a string');
            if(data.access != 'm' && data.access != 'f')
                return callback('access must be a string either m or f, for manager and floor');

            data.date = parse.date.convertToRaw(data.date);
            data.uid = Number(data.uid);

            var time = [];
            data.time.forEach(function(stamp){
                time.push(parse.time(stamp));
            });
            data.time = time;

            if(data.time.length % 2 === 1)
                return callback('time must contain an even number of timestamps');

            console.log('find by date', JSON.stringify({'date.unix':data.date.unix, uid: data.uid}));
            model.Schedule.findOneAndUpdate({'date.unix':data.date.unix, uid: data.uid}, data, function(err, docs){
                if(err){
                    errors.push(err);
                    return console.error(err);
                }
                
                console.log('found?', !!docs);

                if(docs){
                    return console.log('already found', docs.date.human);
                }
                new model.Schedule(data).save((err)=>{
                    if(err)
                        console.error(err);
                });
            });
        }//end function

        console.log(errors);
        return callback(errors.join('\r\n'));

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
        /*var query = { $and: [
            {'date.unix': {$gte: low}},
            {'date.unix': {$lte: high}},
            {'uid': uid},
        ]};*/
        var query = { $and: [
            {'date.unix': {$gte: low, $lte: high}},
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
