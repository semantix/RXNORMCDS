var currentReviewer = "";
var selectedProperty ="";

function changeReviewer()
{
	var currentReviewers = document.getElementById("reviewers");
	
	var currentRevs = '';

	for (i=0; i < currentReviewers.options.length; i++) 
	{
	    if (currentReviewers.options[i].selected) 
	    {
	    	if (currentRevs == '')
	    		currentRevs = currentReviewers.options[i].value;
	    	else
	    		currentRevs = currentRevs + ", " + currentReviewers.options[i].value;
		}
	}

	document.getElementById("currentReviewer").innerHTML = currentRevs;
}

function changeSelectedProperty()
{
	selectedProperty = document.getElementById("selectedProperty").value;

	if (selectedProperty == "")
	{
		document.getElementById("currentComment").disabled = true;
		return;
	}

	document.getElementById("currentComment").disabled = false;

	var selectedProperties = document.getElementById("selectedProperty");
	var currComment = document.getElementById("currentComment");
	var cmts = '';
	var allSame = true;

	for (i=0; i < selectedProperties.options.length; i++) 
	{
	    if (selectedProperties.options[i].selected) 
	    {
	      	var newValueHolder = document.getElementById("NEW" + i);
			if (newValueHolder)
			{
				if (newValueHolder.value.trim() != "")
				{
					if (cmts == '')
						cmts = newValueHolder.value;
					
					if (cmts != newValueHolder.value)
						allSame = false;
				}
				else
					allSame = false;
	    	}
	    	else
	    		allSame = false;
		}
	}

	if (allSame == true)
		currComment.value = cmts;
	else
		currComment.value = "";
}

function setSelectedProperty(clickedProperty, commentIndex)
{
	if (!document.getElementById("reviewers").value)
		return;

    var buttn = document.getElementById('okButton');

    if (buttn.innerHTML == "REVIEW AGAIN?")
    	return;

	document.getElementById("selectedProperty").value = clickedProperty;
	document.getElementById("currentComment").disabled = false;
	document.getElementById("addCommentButton").disabled = false;

	var newValueHolder = document.getElementById("NEW" + commentIndex);

	if (newValueHolder)
		document.getElementById("currentComment").value = newValueHolder.value;
}

function resetOK()
{
	//console.log("Javascript");
	var selectedProperties = document.getElementById("selectedProperty");

	for (i=0; i < selectedProperties.options.length - 1; i++)
	{
		var elem = document.getElementById("OK"+i);
		var buttn = document.getElementById('okButton');
		var nxtbuttn = document.getElementById('nextButton');

		if (elem.style.visibility == "visible")
		{
			elem.style.visibility = "hidden";
		}
			
		//buttn.classList.add('btn-success');
		//buttn.classList.remove('btn-warning');
		buttn.innerHTML = document.getElementById("okButtonTitle").value;
			
		document.getElementById("currentComment").disabled = false;
		document.getElementById("selectedProperty").disabled = false;
		document.getElementById("addCommentButton").disabled = false;
	}

	resetComments();
	changeSelectedProperty();
}

function setOK()
{
	var selectedProperties = document.getElementById("selectedProperty");

	for (i=0; i < selectedProperties.options.length - 1; i++)
	{
		var elem = document.getElementById("OK"+i);
		var buttn = document.getElementById('okButton');
		var nxtbuttn = document.getElementById('nextButton');

		if (elem.style.visibility == "visible")
		{
			//buttn.classList.add('btn-success');
			//buttn.classList.remove('btn-warning');
			buttn.innerHTML = document.getElementById("okButtonTitle").value;
			elem.style.visibility = "hidden";
			nxtbuttn.innerHTML = "SKIP & Next";
			document.getElementById("currentComment").disabled = false;
			document.getElementById("selectedProperty").disabled = false;
			document.getElementById("addCommentButton").disabled = false;
		}
		else
		{
			//buttn.classList.remove('btn-success');
			//buttn.classList.add('btn-warning');
			buttn.innerHTML = document.getElementById("okButtonTitle").value;
			elem.style.visibility = 'visible';
			nxtbuttn.innerHTML = "Submit & Next";
			document.getElementById("currentComment").value = '';
			document.getElementById("currentComment").disabled = true;
			document.getElementById("selectedProperty").disabled = true;
			document.getElementById("addCommentButton").disabled = true;
		}
	}
}

function addComment()
{
	var selectedProperties = document.getElementById("selectedProperty");
	var textareaelem = document.getElementById("currentComment");

	for (i=0; i < selectedProperties.options.length; i++) 
	{
	    if (selectedProperties.options[i].selected) 
	    {
	      	currentPropertyIndex = selectedProperties.options[i].value;

	      	if (currentPropertyIndex != "")
			{
				var elemIndicator = document.getElementById(currentPropertyIndex);

				if (elemIndicator)
				{
					if (textareaelem.value.trim() == '')
						elemIndicator.style.color = 'blue';
					else
						elemIndicator.style.color = 'orange';
				}

				var newValueHolder = document.getElementById("NEW" + i);
				newValueHolder.value = textareaelem.value.trim();
				newValueHolder.click();
			}
	    }
	}

	textareaelem.value = '';
}

function resetComments()
{
	var selectedProperties = document.getElementById("selectedProperty");
	for (i=0; i < selectedProperties.options.length; i++) 
	{
		currentPropertyIndex = selectedProperties.options[i].value;

      	if (currentPropertyIndex != "")
		{
			var elemIndicator = document.getElementById(currentPropertyIndex);

			if (elemIndicator)
				elemIndicator.style.color = 'blue';
		}

	    var newValueHolder = document.getElementById("NEW" + i);
	    if (newValueHolder)
	    	newValueHolder.value = '';
	}
}

function saveOrSkip(selectedDrug)
{

	// put the save methd here
	var cuis = JSON.parse(document.getElementById("scds2Review").value);

	if ((!cuis)||(cuis.entries.length < 1))
		return;

	var prevButtn = document.getElementById("prevButton");
	var nextButtn = document.getElementById("nextButton");

	var nxtI = parseInt(cuis.ind) + 1;

	if (nxtI < 1)
		prevButtn.disabled = true;
	else
		prevButtn.disabled = false;

	if (!(nxtI < cuis.entries.length - 1))
	{
		nextButtn.disabled = true;
		nxtI = cuis.entries.length - 1;
	}
	else
		nextButtn.disabled = false;

	cuis.ind = nxtI;

	var existingValues = angular.element(document.getElementById('RxNormReview')).scope();

	document.getElementById("scd_df").innerHTML = cuis.entries[cuis.ind]['DF_str'];
	document.getElementById("scd_rxcui").innerHTML = cuis.entries[cuis.ind]['SCD_rxcui'];
	document.getElementById("scds2Review").value = JSON.stringify(cuis);
	document.getElementById("counterDisp").innerHTML = '(' + (cuis.ind + 1) + ' of ' + cuis.entries.length + ')';
	resetComments();
}

function getPrevious()
{
	// put the save methd here
	var cuis = JSON.parse(document.getElementById("scds2Review").value);

	if ((!cuis)||(cuis.entries.length < 1))
		return;

	var prevButtn = document.getElementById("prevButton");
	var nextButtn = document.getElementById("nextButton");

	var nxtI = parseInt(cuis.ind) - 1;

	if (nxtI < 1)
	{
		prevButtn.disabled = true;
		nxtI = 0;
	}
	else
		prevButtn.disabled = false;

	if (!(nxtI < cuis.entries.length - 1))
		nextButtn.disabled = true;
	else
		nextButtn.disabled = false;

	cuis.ind = nxtI;

	document.getElementById("scd_df").innerHTML = cuis.entries[cuis.ind]['DF_str'];
	document.getElementById("scd_rxcui").innerHTML = cuis.entries[cuis.ind]['SCD_rxcui'];
	document.getElementById("scds2Review").value = JSON.stringify(cuis);
	document.getElementById("counterDisp").innerHTML = '(' + (cuis.ind + 1) + ' of ' + cuis.entries.length + ')';
	resetComments();
}