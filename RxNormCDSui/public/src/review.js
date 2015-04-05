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
	console.log("Property selected to comment:" + selectedProperty);
}

function setSelectedProperty(clickedProperty)
{
	document.getElementById("selectedProperty").value = clickedProperty;
}

function setOK()
{
	var elems = document.getElementsByTagName("span");

	for (var i = 0; i<elems.length; i++) {

		if (elems[i].class.name == ' glyphicon glyphicon-thumbs-up')
		{
        	if (elems[i].style.visibility == 'visible') {
            	elems[i].style.visibility = 'hidden';    
        	}
        	else {
            	elems[i].style.visibility = 'visible';
        	}
        }

        //if (elems[i].style.color == 'blue')
        //	elems[i].style.color = 'green';
    }
}