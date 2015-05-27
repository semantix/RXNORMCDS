angular.module('RxNormReport', ['ngRoute', 'ngResource', 'ngMessages', 'ngTable'])
.config(function ($routeProvider, $locationProvider) {	
		$routeProvider
		.when('/', {
			controller: 'RxNormReview',
			templateUrl: 'views/rxnormreview.html'
		})
		.when('/rxnormtable', {
			controller: 'RxNormList',
			templateUrl: 'views/rxnormlist.html'
		})
		.when('/:rxcui', {
			controller: 'RxCUIDetails',
			templateUrl: 'views/rxcuidetails.html'
		})
		.when('/tdetails/:tableName', {
			controller: 'RxNormTableDetails',
			templateUrl: 'views/rxnormtabledetails.html'
		});
		
		$locationProvider.html5Mode(true);
});