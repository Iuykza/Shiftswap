//routes.js

var exports = module.exports = {};

var _  = require('lodash'),
fuzzy  = require('fuzzy'),
os     = require('os'),

moment = require('moment'),
parse  = require('app/shiftswap/parse'),

sms    = require('app/shiftswap/sms'),
db     = require('app/shiftswap/db'),

serverConfig = require('app/_config/server.json')
;




exports.home = {
    welcome: (req, res)=>{
        res.send("\"Welcome. You have connected to the Shiftswap API.\"");
        //res.send(JSON.stringify(parse.date.unixToday()));
    },
    time: (req, res)=>{
        var m = moment.utc();
        res.send({
            human:   m.format('dddd, MMMM Do YYYY, h:mm:ss a'),
            unix:    m.valueOf(),
            iso8601: m.toISOString(),
        });
    },
    echo: (req, res)=>{
        res.send(req.params.str);
    },
    whoami: (req, res)=>{
        res.send({
            ip:     req.connection.remoteAddress || req.ip,
            host:   req.headers['user-agent'],
            cookie: req.headers['cookie'],
            dnt:    req.headers['dnt'],
        });
    },
};
exports.user = {
    post: (req, res)=>{ 
        var post = req.body;
        console.log("POST user");

        //Validate
        post.access = post.access || "f";

        //Parsing
        post.access = minifyAccess(post.access, post.spectator);

        if(post.spectator)
            post.access.push("s");


        function createUserDB(err, uid){
            new model.User({
                name:   post.full   || "",
                nick:   post.nick   || "",
                access: post.access || ["f"],
                period: post.period || [Date.now()],
            }).save(callback);
        }
        function callback(err, obj){
            res.send({stat:201,res:"Created"});
            logHistory("Normal|Created user "+obj.name, obj, null);
        }
    },
    del: (req, res)=>{
        var uid = JSON.parse(req.params.uid);
        console.log('DELETE user '+uid);
        logHistory("Very High|Deleted user "+uid, null, {_id: uid}, callback);

        function callback(){
            model.User.remove({_id: uid}, () => res.send({state:200, res:'Ok'}) );
        }
    },
    all: (req, res)=>{
        console.log('GET users');
        db.users.getAll(callback);

        function callback(err, list){
            list = parse.json.cleanArray(list);
            res.send(list);
        }
    },
    patch: (req, res)=>{
        var uid;
        try{
            uid = JSON.parse(req.params.uid) || req.params.uid;
        }
        catch(e){
            uid = req.params.uid;
        }

        var patch = req.body;
        console.log('PATCH user '+uid);


        patch.access = minifyAccess(patch.access);

        model.User.findOneAndUpdate({_id: uid}, patch, {upsert: false}, function(err, doc){
            if(err){
                res.send({state:500, res:'Internal error: '+err});
                return console.error(err);
            }

            res.send({state:200, res:'Ok'});
            logHistory("Normal|Editted user "+doc.name, patch, doc);
        });
    },

    userid: (req, res)=>{

        var userid = JSON.parse(req.params.uid);
        if(!users.some( obj => {
                if(obj.userid === userid){
                    res.send('<p>'+JSON.stringify(obj)+'</p>');
                    return true;
                }
        })){
            res.send('<p>No userid matches '+userid+'</p>');
        }
    },
};
exports.stats = {
    get: (req, res)=>{
        var a = parse.military.pad(14, 30);
        console.log(a);
        res.send(a);
    },
    put: (req, res)=>{

    },
    delete: (req, res)=>{

    },
};
exports.schedule = {
    post: (req, res)=>{
        console.log('POST schedule');
        var post = req.body || {};

        if(post.jquery){
            post = post.jquery;
        }
        
        db.schedule.insert(post, (err, doc)=>{
            if(err){
                console.error(err);
                return res.send(JSON.stringify(err));
            }

            res.send(JSON.stringify('saved'));
        });
    },
    userid: (req, res)=>{
        
    },
    get: (req, res)=>{
        var day = req.params.day; 
        var uid = req.params.uid;
        var access = req.params.access;

        var find;

        if(!day){
            //No day selected, send full list.
            console.log('day empty');
            find = {};
        }
        else{
            //Day found, send partial.
            console.log('GET schedule',day.human, day.unix);
            find = {'date.unix': day.unix};            
        }

        if(!day)
            day = parse.date.unixToday();
        if(uid)
            find.uid = uid;
        if(access)
            find.access = access[0];

        db.schedule.getBetweenDates(day, -7, find, function(err, docs){
            var list = [];

            if(err)
                return console.error(err);

            docs.forEach((d)=>{
                d=parse.json.clean(d); //clean
                list.push(d); //copy
            });

            res.send(list); //send
        });

    },
    delete: (req, res)=>{

    },
};
exports.logged = {
    never: (req, res)=>{

    },
    last: (req, res)=>{

    },
};
exports.trade = {
    all: (req, res)=>{
        model.Trade.find({}, (err, docs)=>{
            if(err)
                return console.error(err);

            sortByStatus(docs);
        });

        function sortByStatus(docs){
            docs = docs || [];
            var statusList = {
                pending:  [],
                complete: [],
                fail:     [],
            };
            for(var i = 0, len = docs.length; i < len; i++){
                var obj = docs[i];
                switch(obj.status){
                    case 0: statusList.pending.push(obj);  break;
                    case 1: statusList.complete.push(obj); break;
                    case 2: statusList.fail.push(obj);     break;
                }
            }
            res.send(statusList);
        }
    },
    post: (req, res)=>{
        var post = req.body || {sid: -1, uid: -1};

        if(!post.sid) return console.error('scheduleId is required');
        if(!post.uid) return console.error('userId is required');

        new model.Trade({
            sid: post.sid,
            uid: post.uid,
            term: post.term,
            status: 0,
        }).save(callback);

        function callback(err, doc){
            if(err){
                res.send({state: 500, res: err});
                return console.error(err);
            }

            res.send({state: 200, res: 'Ok', doc: doc});
        }
    },
    take: (req, res)=>{
        var tid = parse.json.loose(req.params.tid);
    },
    admin: (req, res)=>{
        var tid = parse.json.loose(req.params.tid);
    },
};
exports.history = {
    all: (req, res)=>{
        console.log('GET history');
        model.History.find({}, (err, docs)=>{
            if(err)
                return console.error(err);

            res.send(docs);
        });

    },
    comment: (req, res)=>{

    },
    self: (req, res)=>{

    },
    userid: (req, res)=>{

    },
};
exports.reward = {
    all: (req, res)=>{

    },
    take: (req, res)=>{

    },
    edit: (req, res)=>{

    },
};
exports.sms = {
    poll: (req, res)=>{
        console.log('POST sms');

        var number = req.body.From;
        var body   = req.body.Body;

        if(!number){
            var msg = 'SMS rejected because no phone number given.';
            res.status(400).send(msg);
            return console.error(msg);
        }

        var sent = sms.parseIncoming(req, res, db, parse, {
            number: number,
            body: body,
        });
        console.log(`Num: ${number}, Recv: ${body}, Send: ${sent}`);
        

        res.sendStatus(200);
    },
    send: (req, res)=>{
        console.log('GET sms');
        var body   = req.params.msg;
        //var body   = JSON.parse(req.params.msg);
        var number = JSON.parse(req.params.number);
        sms.send(number, body, function(err, smsRes){
            if(err)
                return console.error('Sms failure', err);
            console.log('sms successful.');
        });
    },
}
exports.voice = {

}















function getUserFromName(name, callback){
    name = (typeof name==='string')? name : '';

    name = name.toLowerCase();
    var names = [];

    getUsers(f1);
    function f1(list){
        names = list;
        var results = fuzzy.filter(name, names, {extract: e=>e.name});
        
        if(results[0] && results[0].original)
            results = results[0].original;

        if(callback)
            callback(results);
    }
}
function getUsers(callback){
    var list = [];
    model.User.find(function(err, users){
        if(err)
            return console.error(err);
        
        users.forEach((user)=>list.push(user));
        callback(list);
    });
}

function minifyAccess(str1, str2, str3){
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
function createID(type, callback){
    console.log('create ID type ',type);
    var t = this;
    var id, found, update;
    type = type.toLowerCase();
    callback = callback || function(){};

    if(!['u','s','h'].some(o=>type===o))
         return console.error('In createID type '+type+' does not match an ID type.  Types are u,s,h.');

    model.Site.find({}, function(err, f){

        if(err)
            return console.error(err);

        //is empty, make new IDs
        if(f.length === 0){
            new model.Site({
                uidCount: 1,
                hidCount: 1,
                sidCount: 1,
            }).save();
            callback(null, 0);

        //is not empty, return ID and increment it.
        }else{
            f = f[0];

            id = ++f[type+'idCount'];
            update = {[type+'idCount']: f[type+'idCount']};

            callback(null, id);
        }

    }).then(doc=>{
        model.Site.findOneAndUpdate(doc, update, {upsert: false}, function(err, doc){
            if(err)
                return console.error('Couldn\'t update site IDs ', err);
        });
    });
}

function logHistory(typedescr, change, undo, callback){

    //Split description and weight
    typedescr  = typedescr.split("|");
    var weight = typedescr.shift();
    var descr  = typedescr.join("|");
    console.log(typedescr);

    //Convert undo id's to actual data
    if(_.find(Object.keys(undo || {}), p => p === '_id')){ //undo is a user id, find the user.
        model.User.findOne(undo, function(err, found){
            if(err)
                return console.error(err);
            createDoc(found);
        });
    }
    else{
        createDoc();
    }

    //Save the history change
    function createDoc(altUndo){
        new model.History({
            //hid:    getID.h();
            //uid:      Schema.Types.ObjectId,  
            time:     Date.now(),
            weight: weight,
            descr: descr,
            comment: "",
            change: change,  //the data after the change
            undo: altUndo || undo,
        }).save(callback);
    }

    //Converts MM-DD-YYYY and MM-DD to Unix timestamps
    function HumanToUNIX(human){
        human = string(human);
        if(human.length <= 4){ //MM-DD format
            human = human+String(new Date().getFullYear()); //append year
        }

        if(human.length <= 8){ //MM-DD-YYYY format
            human = String(Date.parse(human)); //convert to UNIX timestamp
        }

        return human;
    }
}
