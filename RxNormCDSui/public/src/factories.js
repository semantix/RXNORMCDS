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
}).factory('existingAndProposedValues', function ($resource){
	//console.log('factory DEEPAKDEEPAKDEEPAK');
	return $resource('/api/scd/:cui1', {cui1 : '@cui1'});
}).factory('proposedValues', function ($resource){
	//NOT USED FOR NOW;
	return $resource('/api/scdproposed/:df/:route/:ndf', {df : '@df', route : '@route', ndf : '@ndf'});
}).factory('Comment', function ($resource){
	//console.log('factory DEEPAKDEEPAKDEEPAK');
	return $resource('/api/scdcomments/:cui', {cui : '@cui'}, {
            'save': { method: 'PUT' }});
}).factory('ReviewStatus', function ($resource){
	//console.log('factory DEEPAKDEEPAKDEEPAK');
	return $resource('/api/scdreviewstatus/:cui3', {cui3 : '@cui3'}, {
            'save': { method: 'PUT' }});
});