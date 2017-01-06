var exports = module.exports = {};

var mongoose = require("mongoose"),
    autoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;
var schema = {
    day: Schema({
        date:     Object,   //ISO timestamp
        sids:     Array,     //array of schedule data
    }),
    schedule: Schema({
        sid:      Number,    //primary key
        uid:      Number,    //foreign key
        date:     Object,    //{human, ISO, unix} timestamps

        time:     Array,     //array of clock ins and outs
        detail:   Array,     //string or array describing the role
        access:   String,    //"M"anager or "F"loor schedule
        tags:     Array,     //array of tags For Trade, For Sell, Just Traded, etc...
    }),
    trade: Schema({
        tid:      Number,   //primary key
        sid:      Number,   //foreign key
        uid:      Number,   //foreign key

        term:     Object,   //conditions of the trade
        status:   Number,   //is trade pending, complete, or failed
    }),
    user: Schema({
        uid:      Number,   //primary key
        name:     String,   //full name
        nick:     String,   //displayed name

        access:   Array,    //security clearance across shiftswap
        role:     Array,    //different jobs the user can do

        lastlog:  Date,   
        period:   Array,    //When the user began working and their termination.
    }),
    userPrivate: Schema({
        uid:      Number,   //primary key
        pass:     String,
        email:    String,
        phone:    String,
        ipHistory: Array,
    }),
    history: Schema({
        hid:      Number,   //primary key
        uid:      Number,   //foreign key
        time:     Date,
        
        weight:   String,   //system gen the impact of the change
        descr:    String,   //system gen description of the change
        comment:  String,   //user submitted description of the change

        change:   Object,   //the data after the change
        undo:     Object,   //the data before the change
    }),
    site: Schema({
        siteCount: Number,    //Number of times the site was visited

        newsurl: String,      //the URL of a wordpress site to pull posts from
    }),
};

var model = {
    User:     mongoose.model('User'     , schema.user     ),
    History:  mongoose.model('History'  , schema.history  ),
    Site:     mongoose.model('Site'     , schema.site     ),
    Day:      mongoose.model('Day'      , schema.day      ),
    Trade:    mongoose.model('Trade'    , schema.trade    ),
    Schedule: mongoose.model('Schedule' , schema.schedule ),
}

schema.trade.plugin(autoIncrement.plugin, {model: 'Trade',    field: 'tid'});
schema.trade.plugin(autoIncrement.plugin, {model: 'History',  field: 'hid'});
schema.trade.plugin(autoIncrement.plugin, {model: 'User',     field: 'uid'});
schema.trade.plugin(autoIncrement.plugin, {model: 'Schedule', field: 'sid'});


exports.schema = schema;
exports.model = model;
