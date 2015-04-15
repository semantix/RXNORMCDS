angular.module('RxNormReport')
.factory('MyList', function ($resource){
	return $resource('/api/rxnormtable', {id : '@id'}, {
		'update' : { method: 'PUT'}
	});
}).factory('MyTableDetails', function ($resource){
	//console.log('factory DEEPAKDEEPAKDEEPAK');
	return $resource('/api/tdetails/:tableName', {tableName : '@tableName'});
}).factory('allDrugs', function ($resource){
	//console.log('factory DEEPAKDEEPAKDEEPAK');
	return $resource('/api/scds');
}).factory('existingValues', function ($resource){
	//console.log('factory DEEPAKDEEPAKDEEPAK');
	return $resource('/api/scd/:cui1', {cui1 : '@cui1'});
}).factory('proposedValues', function ($resource){
	//console.log('factory DEEPAKDEEPAKDEEPAK');
	return $resource('/api/scdproposed/:cui2', {cui2 : '@cui2'});
}).factory('Comment', function ($resource){
	//console.log('factory DEEPAKDEEPAKDEEPAK');
	return $resource('/api/scdcomments/:cui', {cui : '@cui'}, {
            'save': { method: 'PUT' }});
});