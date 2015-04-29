angular.module('RxNormReport')
.controller('RxNormReview', function ($scope, allDrugs, allDrugsExceptThese, existingAndProposedValues, Comment, Terms, ReviewStatus, $location) {
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
							[9,'Delivery Device: Release Pattern'],
							[10,'General Comments']];

	$scope.commentList = [[0,''],
							[1,''],
							[2,''],
							[3,''],
							[4,''],
							[5,''],
							[6,''],
							[7,''],
							[8,''],
							[9,''],
							[10,'']];

	$scope.allComments = [];

		/// $waitUntil
		///      waits until a certain function returns true and then executes a code. checks the function periodically
		/// parameters
		///      check - a function that should return false or true
		///      onComplete - a function to execute when the check function returns true
		///      delay - time in milliseconds, specifies the time period between each check. default value is 100
		///      timeout - time in milliseconds, specifies how long to wait and check the check function before giving up
		function $waitUntil(check,onComplete,delay,timeout) {
		  // if the check returns true, execute onComplete immediately
			if (check()) {
		    	onComplete();
		      	return;
		  	}

		  	if (!delay) delay=100;

		  	var timeoutPointer;
		  	var intervalPointer=setInterval(function () {
		      	if (!check()) return; // if check didn't return true, means we need another check in the next interval

		      	// if the check returned true, means we're done here. clear the interval and the timeout and execute onComplete
		      	clearInterval(intervalPointer);
		      	if (timeoutPointer) clearTimeout(timeoutPointer);
		      	onComplete();
		  	},delay);
		  	
		  	// if after timeout milliseconds function doesn't return true, abort
		  	if (timeout) timeoutPointer=setTimeout(function () {
		      	clearInterval(intervalPointer);
		  	},timeout);
		}


	$scope.reviewButtonText = "REVIEW DONE!";
	$scope.reviewButtonColor = "color:black";

	$scope.skippedComments = [];

	$scope.terms = Terms.query();

	$scope.committed = 0;

	$scope.getPendingSCDs = function()
	{
		var scdcount = 0;
		for (var i=0; i < $scope.cuis.entries.length; i++)
		{
			var currentTotal = parseInt($scope.cuis.entries[i]['total']);
			if (scdcount == 0)
				scdcount = currentTotal;

			if (currentTotal < scdcount)
				scdcount = currentTotal;

			
		}

		//console.log("  total=  " + scdcount + " committed = " + $scope.committed);
		scdcount = parseInt(scdcount) - parseInt($scope.committed);

		return scdcount;
	};

	$scope.getBreadcrumbs = function(ind, termname)
	{
		var parentId = 0;
		var term = '';

		for (var i=0; i < $scope.terms.length; i++)
		{
			if (parseInt(ind) == -1)
			{
				if ($scope.terms[i]['name'] == termname)
				{
					parentId = $scope.terms[i]['parent_id'];
					term = $scope.terms[i]['name'];
				}
			}
			else
			{
				if ($scope.terms[i]['id'] == ind)
				{
					parentId = $scope.terms[i]['parent_id'];
					term = $scope.terms[i]['name'];
				}
			}
		}
	
		if (parseInt(parentId) == 0)
			return term;
		else
			return $scope.getBreadcrumbs(parentId, term) + ' > ' + term;

	};

	$scope.getColor = function (ind) 
	{
		if ($scope.commentList[ind][1].trim() != '')
			return "orange";

		return "blue";
	};

	$scope.initComments = function (cui) 
	{
		for (var u=0; u < $scope.commentList.length; u++)
			$scope.commentList[u][1] = '';

		for (var i=0; i < $scope.allComments.length; i++)
    	{
    		var jsonO = JSON.parse($scope.allComments[i]);
    		if (jsonO.scd == cui)
    			$scope.commentList[jsonO.ind][1] = jsonO.comment;
    	}
	};

	$scope.storeComment = function (event, selectedCUI) 
	{
   		var index = event.target.getAttribute('id').split('NEW')[1];
   		var comment = event.target.getAttribute('value');
    	var found = false;
    	//console.log("length=" + $scope.allComments.length);
    	for (var i=0; i < $scope.allComments.length; i++)
    	{
    		var jsonO = JSON.parse($scope.allComments[i]);
    		//console.log("scd1=" + jsonO.scd);
    		//console.log("ind=" + jsonO.ind);
    		
    		if ((jsonO.scd == selectedCUI)&&
    			(index == jsonO.ind))
    		{
    			found = true;
    			jsonO.comment = comment;
    			$scope.allComments[i] = JSON.stringify(jsonO);
    		}
    	}

    	if (!found)
    	{
    		$scope.allComments.push('{"scd":"' + selectedCUI + '","ind":"' + index + '","comment":"' + comment + '"}'); 
    	}

    	$scope.commentList[index][1] = comment;
    	//console.log("Result:" + $scope.allComments);
    };

	$scope.existing = [];
	$scope.proposed = [];

	var drugs2Review = null;
	var drug = null;

	if (!$scope.cuis)
	{
		drugs2Review = allDrugs.query();

   		drug = 
   		{
   			entries: drugs2Review,
   			ind : 0
   		};

   		$scope.cuis = drug;
	}

	$scope.currentReviewStatus = " ";

	$scope.initializeValues = function(ci)
	{
		$scope.getExistingAndProposedValues($scope.cuis.entries[ci]['SCD_rxcui']);

		if (($scope.cuis) && ($scope.cuis.entries.length > 0))
			$scope.currentReviewStatus = ReviewStatus.query({cui3: $scope.cuis.entries[ci]['SCD_rxcui']});
		else
			$scope.currentReviewStatus = "No Record Found for Review";
	};

	$scope.getExistingAndProposedValues = function(cuiValue1) 
	{
		//console.log("This was called for existing values");
		$scope.existing = existingAndProposedValues.query({cui1:cuiValue1});
	};
   	
   	var moreDrugsToReview;

   	$scope.getNext = function(event, ccui, currStat) 
   	{
   		
		// Reached at the end and now wants to go 
		// beyond what is in the array
		// time to see if more to fetch from DB
		if ($scope.cuis.ind == ($scope.cuis.entries.length - 2))
		{

			//console.log("going call the function");
			moreDrugsToReview = [];
			var toIgore = '"' + $scope.cuis.entries[0]['SCD_rxcui'] + '"';

			for (var y = 1; y < $scope.cuis.entries.length; y++)
				toIgore =  toIgore + ',"' + $scope.cuis.entries[y]['SCD_rxcui'] + '"';

			moreDrugsToReview = allDrugsExceptThese.query({cuis: toIgore});

			$waitUntil(
					function(){
						if ((moreDrugsToReview)&&(moreDrugsToReview.length > 0))
						{
							//console.log("found=" + moreDrugsToReview.length);
							return true;
						}

						return false;
					},

					function() {
						if ((moreDrugsToReview)&&(moreDrugsToReview.length > 0))
						{
							for (var e =0; e < moreDrugsToReview.length; e++)
								$scope.cuis.entries.push(moreDrugsToReview[e]);
						}
						$scope.committed = 0;
					}
				);
		}

   		var currentTitle = event.target.innerHTML;

   		if (currStat != "Complete")
   		{
	   		var cuistatus = "Incomplete";

	   		if ((currentTitle)&&(currentTitle.indexOf('SAVE') !== -1))
	   		{
	   			for (var i=0; i < $scope.allComments.length; i++)
    			{
    				var jsonO = JSON.parse($scope.allComments[i]);
    				if (jsonO.scd == ccui)
    				{
    					$scope.comment = new Comment(
		    			{
		    				reviewer: [$scope.selection.reviewer, 'text'],
		    				cmtText : [jsonO.comment, 'text'],
		    				property : [$scope.propertyList[jsonO.ind][1], 'text'],
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
    				}
    			}

		  		$scope.committed = parseInt($scope.committed)+ 1;
		   		cuistatus = "Complete";
	   		}
	   		
	   		$scope.reviewComplete = new ReviewStatus(
	   		{
	   			cui3 : ccui,
	   			status : cuistatus
	   		});

	   		if ($scope.reviewComplete.$invalid) 
			{
	        	$scope.$broadcast('record:invalid');
	    	} 
	   		else 
	    	{
	        	$scope.reviewComplete.$save();
	    	}
	    }

		var nxtI = parseInt($scope.cuis.ind) + 1;

		if (nxtI >= $scope.cuis.entries.length)
		{
			nxtI = $scope.cuis.entries.length - 1;
		}

		$scope.cuis.ind = nxtI;
		$scope.getExistingAndProposedValues($scope.cuis.entries[nxtI]['SCD_rxcui']);
		event.target.innerHTML = "SKIP & Next";
		$scope.currentReviewStatus = ReviewStatus.query({cui3: $scope.cuis.entries[nxtI]['SCD_rxcui']});

		if ($scope.currentReviewStatus == "Complete")
		{
			$scope.reviewButtonText = "REVIEW AGAIN!";
			//scope.reviewButtonColor = "color:red";
		}
		else
		{
			$scope.reviewButtonText = "REVIEW DONE!";
			//$scope.reviewButtonColor = "color:black";
		}

		$scope.initComments($scope.cuis.entries[nxtI]['SCD_rxcui']);
   	};

   	$scope.getPrev = function(currStat) {

   		//console.log("Controller");
   		if (currStat != "Complete")
   		{
	   		var cuistatus = "Incomplete";
	   		
	   		$scope.reviewComplete = new ReviewStatus(
	   		{
	   			cui3 : $scope.cuis.entries[$scope.cuis.ind]['SCD_rxcui'],
	   			status : cuistatus
	   		});

	   		if ($scope.reviewComplete.$invalid) 
			{
	        	$scope.$broadcast('record:invalid');
	    	} 
	   		else 
	    	{
	        	$scope.reviewComplete.$save();
	    	}
		}

		var nxtI = parseInt($scope.cuis.ind) - 1;

		if (nxtI < 1)
		{
			nxtI = 0;
		}

		$scope.cuis.ind = nxtI;
		$scope.getExistingAndProposedValues($scope.cuis.entries[nxtI]['SCD_rxcui']);
		$scope.currentReviewStatus = ReviewStatus.query({cui3: $scope.cuis.entries[nxtI]['SCD_rxcui']});

		if ($scope.currentReviewStatus == "Complete")
		{
			$scope.reviewButtonText = "REVIEW AGAIN!";
			//$scope.reviewButtonColor = "color:red";
		}
		else
		{
			$scope.reviewButtonText = "REVIEW DONE!";
			//$scope.reviewButtonColor = "color:black";
		}

		$scope.initComments($scope.cuis.entries[nxtI]['SCD_rxcui']);
   	}; 

   	$scope.showConflict = function (bval)
   	{
   		return (bval == true);
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
