//server.js
var exports = module.exports = {};

var express = require("express"),
    mongoose = require("mongoose"),
    Q = require("q"),
    colors = require("colors"),
    bodyParser = require("body-parser"),
    autoIncrement = require('mongoose-auto-increment')
;

//promises
var ready = {
    mongo: Q.defer(),
    express: Q.defer()
}

//Get configs
var config = {
    mongo: require("app/_config/mongo.json"),
    server: require("app/_config/server.json"),
    clicksend: require("app/_config/clicksend.json"),
}

const NAME = config.mongo.name,
    ADDRESS = config.mongo.address,
    VERSION = config.server.version,
    PORT = config.server.port;




/*******  Setup Mongoose *******/
var conn = mongoose.connect(config.mongo["address"]).connection;
conn.once("open", function () {
    console.log("Mongo is connected\n" + "Using DB " + config.mongo["db-name"].yellow);
    ready.mongo.resolve();
});
conn.on("error", (err) => console.error("Error: " + err));

autoIncrement.initialize(conn);


/*******  Setup Express *******/
var app = express();
Q.when(ready.mongo.promise).then(function () { //only start after Mongo is up.
    app.listen(PORT, function () {
        console.log("API server started on port ".green + colors.yellow(PORT));

        //Pass the Mongo variable to all route functions.
        app.locals.conn = conn;
        ready.express.resolve();
    })
    .on("error", (err)=> console.error("Error: in Express, "+ err.code));
});

app.on('error', (err)=> console.error('Error: in Express, '+ err.code));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(function (req, res, next) {
    res.set("Content-Type", "application/json");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "DELETE, GET, HEAD, POST, PUT, PATCH, OPTIONS, TRACE");
    req.locals = app.locals;
    next();
});


exports.app = app;
exports.conn = conn;
exports.ready = ready;
exports.config = config;