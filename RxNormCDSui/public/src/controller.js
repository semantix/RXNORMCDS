angular.module('RxNormReport')
.controller('RxNormReview', function ($scope) {
	$scope.mainReviewers = ['Kelly A', 'Robert B', 'Anne C'];
	$scope.guestReviewers = ['Guest Reviewer'];

	$scope.propertyList = ['Dose Form: Drug Form',
							'Dose Form: Release Pattern',
							'Dose Form: Delivery Form',
							'Dose Form: ER Time',
							'Administration: Route',
							'Administration: Method',
							'Delivery Device: Type',
							'Delivery Device: Capacity',
							'Delivery Device: ER Time'];

	function exitingValues () {
    	this.rxndf = "rxndf_value_here";
    	this.rxtndf = "rxtndf_value_here";
    	this.rxtroute= "rxtroute_value";
	};

	function proposedValues () {
    	this.dfdrugform = "DF_Drug_Form_here";
    	this.dfreleasepattern = "DF_Release_Pattern_here";
    	this.dfdeliveryform= "DF_Delivery_Form_here";
    	this.dfertime= "DF_ER_time_here";

    	this.admroute= "ADMIN_Route_here";
    	this.admmethod= "ADMIN_Method_here";

    	this.ddtype= "DEL_Type_here";
    	this.ddcapacity= "DEL_Capacity_here";
    	this.ddertime= "DEL_ER_Time_here";
	};

	var drug = {
    	scd : "exst_scd_value", 
		rxcui : "rxcui_value",
   		getExistingValues: function(){
   			return new exitingValues();
   		},
   		getProposedValues: function(){
   			return new proposedValues();
   		}
   	}

   	$scope.currentDrug = drug;
})
.controller('RxNormList', function ($scope, MyList, $location) {
	$scope.list1 = MyList.query();
	$scope.fields = ['Tables_in_rxnormcds'];

	$scope.sort = function (field)
	{
		$scope.sort.field = field;
		$scope.sort.order = !$scope.sort.order;
	};

	$scope.sort.field = 'Tables_in_rxnormcds';
	$scope.sort.order = false;

	$scope.show = function (tName) {
		$location.url('/tdetails/' + tName);
	};
})
.controller('RxNormTableDetails', function ($scope, $routeParams, MyTableDetails, $location) {
		//console.log(' new controller DEEPAKDEEPAKDEEPAK ' + $routeParams.tableName);
		//console.log('controller DEEPAKDEEPAKDEEPAK');	
	$scope.tableName = $routeParams.tableName;
	$scope.tableDetails = MyTableDetails.query({tableName: $routeParams.tableName});

	//console.log('tableDetails:' + $scope.tableDetails);

	$scope.fields = ['Total'];

	$scope.sort = function (field)
	{
		$scope.sort.field = field;
		$scope.sort.order = !$scope.sort.order;
	};

	$scope.sort.field = 'Total';
	$scope.sort.order = false;

	$scope.show = function (tName) {
		$location.url('/tdetails/' + tName);
	};
});