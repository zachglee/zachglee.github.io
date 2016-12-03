//Things to do:

// - make a gamelike progression system?
// - about text
// - test on different platforms, resolutions, browsers

//Teacher quotes about grading: "I would rather lick the bottom of a New York subway car than grade papers."

//alert("start");

document.addEventListener("keydown",keyPressHandler,false);
var scores = new Array();
var highScore;
var lowScore;
var runningAverage;
var decimalSpaces;
var statsShown = false;

//var audio = new Audio('res/music/nascence.mp3');
//audio.play();

//alert("main");

//ONCLICK METHODS

function calculate() {
	//get initial input data
	maxScore = document.getElementById("maxScore");
	studentScore = document.getElementById("studentScore");
	//make sure the input is valid
	if (isNaN(maxScore.value) || isNaN(studentScore.value) || maxScore.value == "" || studentScore.value == "") {
		alert("You must enter numbers only, and all fields must be filled.");
	}
	else {
		//update decimal spaces
		var selector = document.getElementById("decimalChooser");
		decimalSpaces = selector.options[selector.selectedIndex].value;
		//display the result
		percentScore = roundTo((studentScore.value/maxScore.value)*100,decimalSpaces);
		document.getElementById("results").innerHTML = "Percent Score: " + percentScore + "%";
		document.getElementById("operation").innerHTML = "( " + studentScore.value + " / " + maxScore.value + " )"
		//update score array
		scores.unshift(percentScore);
		//update previous scores
		updatePreviousScores();
		//update the score count display
		document.getElementById("scoreCounter").innerHTML = scores.length.toString();
		//reset the student score
		studentScore.value = null;
		//calculate stats
		calculateStats(scores);
		//display or dont display the stats values based on whether the user has toggled them shown or hidden
		if (statsShown) {
			displayStats();
		}
	}
}

function showStats() {
	if (statsShown) {
		statsShown = false;
		document.getElementById("statsButton").value = "Show Stats";
		//hide all stats values
		document.getElementById("average").innerHTML = "";
		document.getElementById("highLowScore").innerHTML = "";
	}else if (!statsShown) {
		statsShown = true;
		document.getElementById("statsButton").value = "Hide Stats";
		//display all stats values
		displayStats();
	}
}

function reset() {
	//clear all data variables
	scores = [];
	runningAverage = null;
	highScore = null;
	lowScore = null;
	//clear all HTML elements displaying the results
	document.getElementById("maxScore").value = "";
	document.getElementById("studentScore").value = "";
	document.getElementById("average").innerHTML = "";
	document.getElementById("results").innerHTML = "";
	document.getElementById("highLowScore").innerHTML = "";
	document.getElementById("operation").innerHTML = "";
	document.getElementById("previousScores").innerHTML = "";
	document.getElementById("scoreCounter").innerHTML = "0";
	//set focus to the proper field
	setFocus();
}

function undo() {
	if (scores.length > 0) {
		scores = scores.slice(1,scores.length);
		document.getElementById("scoreCounter").innerHTML = scores.length.toString();
		document.getElementById("results").innerHTML = "";
		document.getElementById("operation").innerHTML = "";
		updatePreviousScores();
		calculateStats(scores);
		displayStats();
	}else {
		alert("There are no scores to undo.");
	}
}

//EVENT HANDLERS

function keyPressHandler(evt) {
	if (evt.keyCode == 13) {
		calculate();
	}
}

//HELPER METHODS

function roundTo(num, decimalSpaces) {
	var newnumber = Math.round(num*Math.pow(10,decimalSpaces))/Math.pow(10,decimalSpaces);
	return newnumber;
}

function average(array) {
	var sum = 0;
	for (i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return sum/array.length;
}

Array.max = function( array ){
    return Math.max.apply( Math, array );
};
 
Array.min = function( array ){
    return Math.min.apply( Math, array );
};

function calculateStats(array) {
	//update average
	runningAverage = roundTo(average(array),decimalSpaces);
	//update highest and lowest scores
	highScore = Array.max(array);
	lowScore = Array.min(array);
}

function displayStats() {
	if (scores.length > 0) {
		document.getElementById("average").innerHTML = "Running Average: " + runningAverage + "%";
		document.getElementById("highLowScore").innerHTML = "Highest Score: " + highScore + "% , Lowest Score: " + lowScore + "%";
	}else{
		alert("There are no stats to display because no scores have been entered or because the 'New Group' button was clicked, clearing all previous scores.");
		document.getElementById("average").innerHTML = "";
		document.getElementById("highLowScore").innerHTML = "";
		document.getElementById("statsButton").value = "Show Stats"
		statsShown = false;
	}
}

function updatePreviousScores() {
	document.getElementById("previousScores").innerHTML = constructPreviousScoresString();
}

function constructPreviousScoresString() {
	var tempString = "";
	for (i=1; i<scores.length; i++) {
		tempString += ((scores.length-i).toString() + ": " + scores[i].toString() + "%" + "<br><br><br>")
	}
	return tempString;
}

function setFocus(){
	document.getElementById("maxScore").focus();
}