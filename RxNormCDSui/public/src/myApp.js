angular.module('RxNormReport', ['ngRoute', 'ngResource', 'ngMessages'])
.config(function ($routeProvider, $locationProvider) {	
		$routeProvider
		.when('/rxnormtable', {
			controller: 'RxNormList',
			templateUrl: 'views/rxnormlist.html'
		})
		.when('/tdetails/:tableName', {
			controller: 'RxNormTableDetails',
			templateUrl: 'views/rxnormtabledetails.html'
		});
		
		$locationProvider.html5Mode(true);
});