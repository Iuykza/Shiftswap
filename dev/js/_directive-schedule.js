
angular.module('scheduleApp')
.directive('tabledom', [function(){
	return {
		templateUrl: 'template/table.html',
		controller: 'scheduleMain',
		replace: true
	};
}]);

