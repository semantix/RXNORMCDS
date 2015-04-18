angular.module('RxNormReport')
.controller('RxNormReview', function ($scope, allDrugs, existingAndProposedValues, Comment, Terms, ReviewStatus, $location) {
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

	$scope.reviewButtonText = "REVIEW DONE!";
	$scope.reviewButtonColor = "color:black";

	$scope.skippedComments = [];

	$scope.terms = Terms.query();

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

	}

	function skippedComment(pcui, pprop, pcmt){
		this.skpcui = pcui;
		this.skproperty = pprop;
		this.skpcomment = pcmt;
	};

	$scope.initSkippedComments = function ()
	{
		for (var i=0; i < $scope.cuis.entries.length; i++)
			for (var j=0; j < $scope.propertyList.length; j++)
				$scope.skippedComments.push (
					new skippedComment($scope.cuis.entries[i]['SCD_rxcui'], j, ""));
	};

	$scope.removeSkippedComments = function (cui)
	{
		for (var i=0; i < $scope.skippedComments.length; i++)
			if ($scope.skippedComments[i])
				if ($scope.skippedComments[i].skpcui == cui)
					$scope.skippedComments[i].skpcomment = '';
	};

	$scope.updateSkippedComment = function (cui)
	{
		for (var i=0; i < $scope.skippedComments.length; i++)
			if ($scope.skippedComments[i])
				if (($scope.skippedComments[i].skpcui == cui)&&
					($scope.commentList[$scope.skippedComments[i].skproperty][1] != ''))
						$scope.skippedComments[i].skpcomment = $scope.commentList[$scope.skippedComments[i].skproperty][1];
	};

	$scope.populateFromSkippedComment = function (cui)
	{
		for (var i=0; i < $scope.skippedComments.length; i++)
			if ($scope.skippedComments[i])
				if (($scope.skippedComments[i].skpcui == cui)&&
					($scope.skippedComments[i].skpcomment != ''))
					 	$scope.commentList[$scope.skippedComments[i].skproperty][1] = $scope.skippedComments[i].skpcomment;
	};

	$scope.initComments = function () 
	{
		/* This code to retrieve the comments from scd_comments table for the
		commented upon rxcuis, Uncomment if there is a need to dynamically 
		compare existing comemnts with the new comments. right now there is no
		need to compare them. User either skips commenting or saves them. Once
		it is skipped or saved, that rxcui is saved (Incomplete or Complete) accordingly */
		/*
		var ccui = $scope.cuis.entries[$scope.cuis.ind]['SCD_rxcui'];
		var existingComments = null;
		if (ccui)
			existingComments = Comment.query({cui:ccui});
		*/

		for (var i = 0; i < $scope.commentList.length; i++) 
		{
			$scope.commentList[i][1] = '';
		};

		if ($scope.skippedComments.length == 0)
			$scope.initSkippedComments();
		else
			$scope.populateFromSkippedComment($scope.cuis.entries[$scope.cuis.ind]['SCD_rxcui']);
	};

	$scope.storeComment = function (event) 
	{
   		var index = event.target.getAttribute('id').split('NEW')[1];
    	$scope.commentList[index][1] = event.target.getAttribute('value');
    };

	$scope.updateComment = function (event, ccui) 
	{
		console.log("Reviwer:" + $scope.selection.reviewer);
    	console.log("Comemnt:" + event.target.getAttribute('value'));
    	console.log("id:" + event.target.getAttribute('id'));
    	var index = event.target.getAttribute('id').split('NEW')[1];
    	console.log("index=" + index);
    	console.log("Property=" + $scope.propertyList[index][1]);
    	
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
   	
   	$scope.getNext = function(event, ccui, currStat) 
   	{
   		var currentTitle = event.target.innerHTML;

   		if (currStat != "Complete")
   		{
	   		var cuistatus = "Incomplete";

	   		if ((currentTitle)&&(currentTitle.indexOf('SAVE') !== -1))
	   		{
	   			for (var i = 0; i < $scope.commentList.length; i++) 
				{
					$scope.comment = null;

					// If general comments are emtpy then put something in it.
					var ctext = $scope.commentList[i][1];

					if ((i == 10)&&(ctext.trim() == ''))
					{
						ctext = 'REVIEW DONE!';
					}

		   			$scope.comment = new Comment(
		    		{
		    			reviewer: [$scope.selection.reviewer, 'text'],
		    			cmtText : [ctext, 'text'],
		    			property : [$scope.propertyList[i][1], 'text'],
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

   		$scope.updateSkippedComment(ccui);

		var nxtI = parseInt($scope.cuis.ind) + 1;

		if (!(nxtI < $scope.cuis.entries.length - 1))
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

		$scope.initComments();
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

	   		$scope.updateSkippedComment($scope.cuis.entries[$scope.cuis.ind]['SCD_rxcui']);
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

		$scope.initComments();
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
