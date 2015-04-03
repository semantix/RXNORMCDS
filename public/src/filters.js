angular.module('RxNormReport')
	.filter('labelCase', function(){
		return function(input){
			// First we find first capital letter in 
			// the string and sepaerate them by a space
			// e.g. firstName -> first Name
			input = input.replace(/([A-Z])/g, ' $1');

			// then we make first letter in the string uppercase
			// and concatenate the rest of the string with it
			// by slicing it at second letter (at index = 1)
			// This retrns First Name
			return input[0].toUpperCase() + input.slice(1);
		};
	})
	.filter('keyFilter', function () {
		return function (obj, query) {
				var result = {};
				angular.forEach(obj, function (key, val) {
					if (key !== query){
						result[key] = val;
					}
				});
				return result;
		};
	});