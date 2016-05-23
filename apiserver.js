var express = require('express');
var colors  = require('colors');
var routes = require('./node_modules/shiftswap/routes.js');




/*******  Setup  *******/


var app = express();
var port = 3000;


app.listen(port, function(){
	console.log("Backend API server started on port ".green+port);
});

app.use(function(req, res, next){
	res.set('Content-Type', 'application/json');

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	next();
});


/*******  Routes  *******/

app.get('/' , home.welcome)

.get('/sms/send/:number'   , sms.send)
.get('/sms/poll'           , sms.poll)
.get('/voice/send/:number' , voice.send)

.get('/users'         , user.all)
.get('/userid/:userid', user.userid)
.get('/role/:role'    , user.role)
.get('/name/:name'    , user.name)

.get('/stats/all'  , stats.all)

.get('/trade/shop'    , trade.shop)
.get('/trade/pend'    , trade.pend)
.get('/trade/fail'    , trade.fail)

.get('/logged/never'  , logged.never)
.get('/logged/last'   , logged.last)

.get('/schedule/role/:role/:day'    , schedule.role)
.get('/schedule/userid/:userid/:day', schedule.userid)




/*******  Errors  *******/

app.on('error', function(e){
	if(e.code == 'EADDRINUSE'){
		console.log('Error: port already in use'.red);
	}else{
		console.log(e.red);
	}
});






















/*
***** Access *****

              view      view manager   trade     edit      full     full
              schedule  schedule                 users     stats    edit
Admin     =    X           X                       X        X        X  
GM        =    X           X                                X           
Manager   =    X           X            X                               
Floor     =    X                        X                               
Spectator =    X                                                        


Combining Spectator with any role will remove trade.

Spectator + Floor   = access to floor schedule.
Spectator + Manager = access to floor and manager schedule.

*/

