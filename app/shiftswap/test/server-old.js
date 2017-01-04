var express  = require('express'),
	colors   = require('colors'),
	mongoose = require('mongoose'),
	routes   = require('app/shiftswap/routes.js')
	Q        = require('q')
	//db       = require('shiftswap/db.js')
;

/*******  Setup MongoDB *******/
var mongoReady = Q.defer();
var Schema = mongoose.Schema;

var timespanSchema = Schema({
	start:    Date,   
	end:      Date, 
	val:      Array,     //array of days 
});
var daySchema      = Schema({
	day:      Date,      //unix timestamp
	val:      Array,     //array of schedule data
});
var scheduleSchema = Schema({
	tid:      Schema.Types.ObjectId,  //primary key
	uid:      Schema.Types.ObjectId,  //foreign key

	time:     Array,     //array of clock ins and outs
	detail:   Array,     //string or array describing the role
});
var userSchema     = Schema({
	uid:      Schema.Types.ObjectId,   //primary key
	name:     String,     //full name
	nick:     String,     //displayed name

	access:   Array,      //security clearance across shiftswap
	role:     Array,      //different jobs the user can do

	lastlog:  Date,   
	period:   Array,       //When the user began working and their termination.
});

var User = mongoose.model('User', userSchema);







/*** MongoDB ***/
var name = 'sanity';
var conx = mongoose.connect('mongodb://localhost/'+name).connection;
conx.once('open', function(){

	console.log(
		'Mongo is connected\n'.green +
		'Using DB '.green + name.yellow
	);

	mongoReady.resolve();
});

conx.on('error', (err) => console.error('Error: '+err));







/*******  Setup Express *******/


var app     = express();
var PORT    = 3000;
var VERSION = 'v1';

Q.when(mongoReady.promise).then(function(){ //only start after Mongo is up.

	app.listen(PORT, function(){
		console.log(
			'API server started on port '.green + colors.yellow(PORT) + '\n' +
			'All systems are go!'
		);
	})
	.on('error', (err)=> console.error('Error: in Express, '+ err.code));

});

app.use(function(req, res, next){
	res.set('Content-Type', 'application/json');

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	next();
});





/*******  Routes  *******/

app.get('/' , home.welcome)

.post('/'+VERSION+'/user/:name'   , user.post)  //make a user
.delete('/'+VERSION+'/user/:name' , user.del)   //delete a user
.get('/'+VERSION+'/user'          , user.all)   //get all users

.get('/'+VERSION+'/stats'  , stats.get)          //get all stats
.put('/'+VERSION+'/stats'  , stats.put)          //submit a stat

.get('/'+VERSION+'/trade'    , trade.shop)       //view trades
.put('/'+VERSION+'/trade/give/:tid')             //give shift
.put('/'+VERSION+'/trade/take/:tid')             //take shift
.put('/'+VERSION+'/trade/accept/:tid')           //accept shift trade (manager)

.get('/'+VERSION+'/schedule/role/:role/:day'    , schedule.role)   //get 
.get('/'+VERSION+'/schedule/userid/:userid/:day', schedule.userid) //get

.put('/'+VERSION+'/sms/send/:number'   , sms.send) //send sms
.get('/'+VERSION+'/sms/poll'           , sms.poll) //receive sms
.put('/'+VERSION+'/voice/send/:number' , voice.send) //send voice
;

/*******  Errors  *******/

app.on('error', (err)=> console.error('Error: in Express, '+ err.code));






















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

