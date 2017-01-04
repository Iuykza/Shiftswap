var mongoose = require('mongoose');
var Schema = mongoose.Schema;




/*** Schemas ***/
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

userSchema.methods.say = function(obj){
	console.log("Hello I am " + (this.nick||this.name) + ".");
	console.log(this.uid);
}

var User = mongoose.model('User', userSchema);







/*** Set up ***/
var name = "sanity"
var conx = mongoose.connect('mongodb://localhost/'+name).connection;
conx.once('open', function(){
	console.log('Connected to MongoDB. Using DB '+name+'.');
	addThings();

	console.log('Current users are:');
	readThings();
});
conx.on('error', console.error.bind(console, 'connection error:'));







/*** Control ***/
function addThings(){

	var chasity = new User({
		name: "Adams, Caitlin C",
		nick: "Cat",
		access:["floor"],
		period: [Date.now()],
	});

	chasity.say();

	// chasity.save(saveCallback);

	function saveCallback(err, obj){
		console.log("saved "+obj);
	}
}
function readThings(){
	User.find(function(err, users){
		if(err)
			console.error(err);
		
		users.forEach(function(user){
			console.log(user.nick||user.name);
		});
	});

}