angular.module('scheduleApp')
.service('ajaxService', ['$http', 'dataService', function($http){
	var server = 'http://localhost:3000/';

	this.getUsers = function(callback){
		$http.get(server+'users')
		.then(callback)
		.catch(function(error){
			console.log('Error, JSON file "users.json" is broken.  Reason: ',error);
		});
	};


	this.getWeek = function(week, callback){
		console.log('GET floor/'+week);
		$http.get(server+'schedule/role/floor/'+week)
		.then(callback)
		.catch(function(error){
			console.log('Error, JSON file "'+week+'.json" is broken.  Reason: ',error);
		});
	};





}]);