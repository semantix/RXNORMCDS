angular.module('RxNormReport')
.controller('RxNormReview', function ($scope, allDrugs, existingValues, proposedValues, $location) {
	$scope.mainReviewers = ['Kelly K. Wix', 'Robert R. Freimuth', 'Stacy J. Ellingson'];
	$scope.guestReviewers = ['Guest Reviewer'];

	$scope.propertyList = [[0,'Dose Form: Drug Form'],
							[1,'Dose Form: Release Pattern'],
							[2,'Dose Form: Delivery Form'],
							[3,'Dose Form: ER Time'],
							[4,'Administration: Route (site)'],
							[5,'Administration: Method'],
							[6,'Delivery Device: Type'],
							[7,'Delivery Device: Capacity'],
							[8,'Delivery Device: ER Time']];

	// function getExitingValues (cindex) 
	// {
	// 	//return selectedDrug.query({cui: cindex})

	// 	this.rxndf = "rxndf_value_here" + cindex;
 //    	//this.rxtndf = existingVals[0];
 //    	this.rxtroute= "rxtroute_value";

 //    	//this.rxndf = "rxndf_value_here" + cindex;
 //    	this.rxtndf = "rxtndf_value_here";
 //    	//this.rxtroute= "rxtroute_value";
	// };

	function proposedDummyValues (cindex) {
    	this.dfdrugform = "DF_Drug_Form_here" + cindex;
    	this.dfreleasepattern = "DF_Release_Pattern_here";
    	this.dfdeliveryform= "DF_Delivery_Form_here";
    	this.dfertime= "DF_ER_time_here";

    	this.admroute= "ADMIN_Route_here";
    	this.admmethod= "ADMIN_Method_here";

    	this.ddtype= "DEL_Type_here";
    	this.ddcapacity= "DEL_Capacity_here";
    	this.ddertime= "DEL_ER_Time_here";
	};

	var allDrugs = allDrugs.query();

   	var drug = 
   	{
   			entries: allDrugs,
   			ind : 0
   	} ;

	$scope.cuis = drug;

	$scope.initializeValues = function(ci)
	{
		$scope.getExisting(drug.entries[ci]['SCD_rxcui']);
		$scope.getProposed(drug.entries[ci]['SCD_rxcui']);
	}

	$scope.getExisting = function(cuiValue1) 
	{
		console.log("This was called for existing values");
		$scope.existing = existingValues.query({cui1:cuiValue1});
	};
   	
   	$scope.getProposed = function(cuiValue2) 
	{
		console.log("This was called for proposed values");
		$scope.proposed = proposedValues.query({cui2:cuiValue2});
	};

   	$scope.getNext = function() {

		var nxtI = parseInt(drug.ind) + 1;

		if (!(nxtI < drug.entries.length - 1))
		{
			nxtI = drug.entries.length - 1;
		}

		drug.ind = nxtI;
		$scope.getExisting(drug.entries[nxtI]['SCD_rxcui']);
		$scope.getProposed(drug.entries[nxtI]['SCD_rxcui']);
   	};

   	$scope.getPrev = function() {

		var nxtI = parseInt(drug.ind) - 1;

		if (nxtI < 1)
		{
			nxtI = 0;
		}

		drug.ind = nxtI;
		$scope.getExisting(drug.entries[nxtI]['SCD_rxcui']);
		$scope.getProposed(drug.entries[nxtI]['SCD_rxcui']);
   	};   	
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
