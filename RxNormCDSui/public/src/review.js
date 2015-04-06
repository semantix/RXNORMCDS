var currentReviewer = "";
var selectedProperty ="";

function changeReviewer()
{
	currentReviewer = document.getElementById("reviewers").value;
	console.log("Current Reviewer:" + currentReviewer);
	document.getElementById("currentReviewer").innerHTML = currentReviewer;
}

function changeSelectedProperty()
{
	selectedProperty = document.getElementById("selectedProperty").value;

	if (selectedProperty == "")
		document.getElementById("currentComment").disabled = true;
	else
		document.getElementById("currentComment").disabled = false;
	
	console.log("Property selected to comment:" + selectedProperty);
}

function setSelectedProperty(clickedProperty)
{
	document.getElementById("selectedProperty").value = clickedProperty;
	document.getElementById("currentComment").disabled = false;
}

function setOK()
{
	for (i=0; i < 9; i++)
	{
		var elem = document.getElementById("TUP"+i);
		var buttn = document.getElementById('okButton');

		if (elem.style.visibility == "visible")
		{
			buttn.classList.add('btn-success');
			buttn.classList.remove('btn-warning');
			buttn.innerHTML = "Review Done!";
			elem.style.visibility = "hidden";
		}
		else
		{
			buttn.classList.remove('btn-success');
			buttn.classList.add('btn-warning');
			buttn.innerHTML = "Review Again";
			elem.style.visibility = 'visible';
		}
	}
}

function addComment()
{
	var currentPropertyIndex = document.getElementById("selectedProperty").value;

	if (currentPropertyIndex != "")
	{
		var elemIndicator = document.getElementById(currentPropertyIndex);

		var textareaelem = document.getElementById("currentComment");

		if (textareaelem.value.trim() == '')
			elemIndicator.style.color = 'blue';
		else
			elemIndicator.style.color = 'orange';
	}
}