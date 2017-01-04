//db.js
//Communicates with the Mongo database

var exports = module.exports = {};

var parse = require("app/shiftswap/parse"),
schema = require("app/shiftswap/schema"),
serverConfig = require('app/_config/server.json')
;

var model = schema.model;

exports.schedule = {
    get: (start, end, get, callback)=>{
        get   = get || {};
        start = parse.date.unix(start);
        end   = parse.date.unix(end  );

        query = {$and: [
            {'date.unix': {$gt: start}},
            {'date.unix': {$lt: end}},
            get,
        ]};

        model.Schedule.find(query, function(err, data){
            if(callback){ callback(err,data);}
        });
    },
    getFloor:   (start, end, callback)=>{ getAll(start, end, {access: 'f'}, callback) },
    getManager: (start, end, callback)=>{ getAll(start, end, {access: 'm'}, callback) },
};
exports.users = {
    getUser: (query, callback)=>{
        //query = query || {};
        query = {$or: [
            { uid: '0' },
            { uid: '1' },
        ]};

        model.User.find(query, (err, users)=>callback(err,users) );
    },
    getManagers: (callback)=>{

    },
    getFloor: (callback)=>{

    },
    getUserByPersonNum:(get, callback)=>{ exports.users.getUser({'personNum': get}, callback)},
    getUserByBadge:    (get, callback)=>{ exports.users.getUser({'badge':     get}, callback)},
    getUserByUID:      (get, callback)=>{ exports.users.getUser({'uid':       get}, callback)},
    getUserByPhone:    (get, callback)=>{ exports.users.getUser({'phone':     get}, callback)},
    getUserByEmail:    (get, callback)=>{ exports.users.getUser({'email':     get}, callback)},
    getAll:            (callback     )=>{ exports.users.getUser({}                , callback)},
};
exports.trades = (callback)=>{

};
exports.history = (callback)=>{

};
exports.rewards = (callback)=>{

};
exports.site = (callback)=>{

};

var private = {

};
