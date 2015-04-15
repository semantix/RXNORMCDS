angular.module('RxNormReport')
.factory('MyList', function ($resource){
	return $resource('/api/rxnormtable', {id : '@id'}, {
		'update' : { method: 'PUT'}
	});
}).factory('MyTableDetails', function ($resource){
	//console.log('factory DEEPAKDEEPAKDEEPAK');
	return $resource('/api/tdetails/:tableName', {tableName : '@tableName'});
}).factory('AllDrugs', function ($resource){
	//console.log('factory DEEPAKDEEPAKDEEPAK');
	return $resource('/api/scds');
}).factory('selectedDrug', function ($resource){
	//console.log('factory DEEPAKDEEPAKDEEPAK');
	return $resource('/api/scd/:cui', {cui : '@cui'});
});