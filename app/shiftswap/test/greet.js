var greet = require('./db.js');

var a = greet.user.hello(function(m){

	return console.log(m+' there.');
});
console.log(a);
