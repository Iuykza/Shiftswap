angular.module('scheduleApp')
.service('ajaxService', ['$http', function($http){
	//var server = 'http://api.shiftswapsanity.xyz/v1/';
	var server = 'http://localhost:3000/v1/';

	this.getUsers = function(callback){
		return $http.get(server+'users')
		.then(callback)
		.catch(err => console.log('Error in getUsers ',err) );
	};

	this.getWeek = function(access, day, callback){
		access = String( access || 'floor'                                );
		day    = String( day    || new Date().toISOString().substr(0, 10) );

		console.log(day, server+'schedule/access/'+access+'/day/'+day);
		$http.get(server+'schedule/access/'+access+'/day/'+day)
		.then(callback)
		.catch(err => console.log('Error in getWeek ',err) );
	};





}]);