angular.module('RxNormReport')
.controller('RxNormReview', function ($scope, allDrugs, existingValues, proposedValues, Comment, $location) {
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
							[8,'Delivery Device: ER Time'],
							[9,'General Comments']];

	$scope.updateComment = function (event, ccui) 
	{
		console.log("Reviwer:" + $scope.selection.reviewer);
    	console.log("Comemnt:" + event.target.getAttribute('value'));
    	console.log("id:" + event.target.getAttribute('id'));
    	var index = event.target.getAttribute('id').split('NEW')[1];
    	console.log("index=" + index);
    	console.log("Property=" + $scope.propertyList[index][1]);

    	$scope.comment = new Comment(
    	{
    		reviewer: [$scope.selection.reviewer, 'text'],
    		cmtText : [event.target.getAttribute('value'), 'text'],
    		property : [$scope.propertyList[index][1], 'text'],
    		cui : [ccui, 'text']
    	});

    	if ($scope.comment.$invalid) 
    	{
            $scope.$broadcast('record:invalid');
        } 
        else 
        {
            $scope.comment.$save();
        }
	};

	var allDrugs = allDrugs.query();

   	var drug = 
   	{
   			entries: allDrugs,
   			ind : 0
   	};

	$scope.cuis = drug;

	$scope.initializeValues = function(ci)
	{
		$scope.getExisting(drug.entries[ci]['SCD_rxcui']);
		$scope.getProposed(drug.entries[ci]['SCD_rxcui']);

		console.log("Reviewer:" + $scope.selection.reviewer);
	};

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
		$scope.nextButtonTitle = "SKIP & Next";
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
		$scope.nextButtonTitle = "SKIP & Next";
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
