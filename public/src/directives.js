// this file will have field types defined and the messages in case we need duing validation.
// you can think of this file as a property file where messages are stored
// We just use text type for now so we can comment others.

angular.module('RxNormReport')
.value('FieldTypes', {
	text: ['Text', 'should be text']
	,email: ['Email', 'should be an email address']
	//,number: ['Number', 'should be a number']
	//,date: ['Datea', 'should be a date']
  })
// here timeout is for time out when user stays in that field after typing a value in a form
// We restrict this directive to be used.
// an angular directives can be used as:
// as an element, (e.g form-field)
// an attribute on that element, - EA (an attribute of form-field or any other tag)
// as a class on an element,  (a class defined on a tag element)
// as a comment on an element  
//
.directive('formField', function ($timeout, FieldTypes) {
	return {
		restrict : 'EA',
		templateUrl: 'views/form-field.html',
		// replace means the html in form-field.html will replace the invoking element in create.html
		// if replace is false then the html in form-field.html  will be placed inside the invoking element 
		replace : true,
		// scope tells us what all attributes of invoking element will be available in this directive.
		// an '=' indicates that it is a two way binding, any changes to fields of a record will be 
		// persisted/changed when value is changed
		// an '@' shows that it is only one way - read value and use it. does not change in incoming
		// object.
		scope: {
			record: '=',
			field: '@',
			live: '@',
			required: '@'
		},
		// we use link to add or edit what values go the invoking element.
		// Here we add types = FieldTyoes, and remove method which is needed
		// by the invoking element
		// We add methods that we need to update the record for update()
		// blurUpdate() [see form-field.html]
		link: function ($scope, element, attr){

				// Listen for record:invalid message
				$scope.$on('record:invalid', function (){
					$scope[$scope.field].$setDirty();
				});

				$scope.types = FieldTypes;

				$scope.remove = function(field){
					delete $scope.recrod[field];
					$scope.blurUpdate();
				};

				$scope.blurUpdate = function () {
					// we have to use !== because 'false' is a string not a boolean value.
					if ($scope.live !== 'false') {
						$scope.record.$update(function (updatedRecord) {
							$scope.record = updatedRecord;
						});
					}
				};

				// update will call blurUpdate method if user types something and then
				// waits for a second (1000 ms). If user keeps typing without a second of
				// pause in between, update will be called for each character changed,
				// but blurUpdate won't be called. blurUpdate is called only when user types
				// somethind and waits for at least a second. so the application can keep 
				// the value updated with what user types, but wont keep updating for each
				// keystroke which are usually less than a second apart.

				var saveTimeout;
				$scope.update = function () { 
					$timeout.cancel(saveTimeout);
					saveTimeout = $timeout($scope.blurUpdate, 1000);
				};
		}
	};
});
