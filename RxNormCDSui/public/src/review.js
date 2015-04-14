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

    if (buttn.innerHTML == "Review Again")
    	return;

	document.getElementById("selectedProperty").value = clickedProperty;
	document.getElementById("currentComment").disabled = false;
	document.getElementById("addCommentButton").disabled = false;

	var newValueHolder = document.getElementById("NEW" + commentIndex);

	if (newValueHolder)
		document.getElementById("currentComment").value = newValueHolder.value;
}

function setOK()
{
	for (i=0; i < 9; i++)
	{
		var elem = document.getElementById("OK"+i);
		var buttn = document.getElementById('okButton');
		var nxtbuttn = document.getElementById('nextButton');

		if (elem.style.visibility == "visible")
		{
			buttn.classList.add('btn-success');
			buttn.classList.remove('btn-warning');
			buttn.innerHTML = "Review Done!";
			elem.style.visibility = "hidden";
			nxtbuttn.innerHTML = "SKIP & Next >>";
			document.getElementById("currentComment").disabled = false;
			document.getElementById("selectedProperty").disabled = false;
			document.getElementById("addCommentButton").disabled = false;
		}
		else
		{
			buttn.classList.remove('btn-success');
			buttn.classList.add('btn-warning');
			buttn.innerHTML = "Review Again";
			elem.style.visibility = 'visible';
			nxtbuttn.innerHTML = "Save & Next >>";
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

				if (textareaelem.value.trim() == '')
					elemIndicator.style.color = 'blue';
				else
					elemIndicator.style.color = 'orange';

				var newValueHolder = document.getElementById("NEW" + i);
				newValueHolder.value = textareaelem.value.trim();
			}
	    }
	}

	textareaelem.value = '';
}