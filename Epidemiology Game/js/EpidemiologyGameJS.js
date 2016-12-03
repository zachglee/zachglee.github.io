//Known Bugs - 
//Things to do - transparent backgrounds for icons
//Next thing to do - more advanced strats, name the game
//Lines to clean up or tweak are marked by '--------' (8 dashes)

//finish instructions, put failed patient zero cards on bottom of deck, name the game, talk about losing conditions


//Common Keycodes
var LEFTARROW = 37;
var UPARROW = 38;
var RIGHTARROW = 39;
var DOWNARROW = 40;
var SPACEBAR = 32;

var body = document.body, html = document.documentElement;
var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

//constant declarations
var HEIGHT, WIDTH, UITEXTCOLOR = "#ffffff", CARDTEXTCOLOR = "#000000", maxCardsPerRow = 8, initialOffsetX = 20, initialOffsetY = 20;

//canvas declarations
var canvas, ctx, keystate;

//image declarations
var faceDownCard = new Image();
var blankInfectedCard = new Image();
var blankSelectedCard = new Image();
var blankCard = new Image();
var heartIcon = new Image();
var diamondIcon = new Image();
var clubIcon = new Image();
var spadeIcon = new Image();

//html element holders
var rulesText;

//Gameplay Variable Declarations
var roundNumber = 1;
var deathCount = 0;
var selectedCardCount = 0;
var selectedSuitGuessCount = 0;
var selectedValueGuessCount = 0;
var gameOver = false;
var guessPhase = false;
var currentPhase; //-------- may not need this

//array declarations
var instructionsArray = ["<b>(1) - Object of the Game:</b> A dangerous epidemic has started. The disease is unknown, and it is your job to figure out the makeup of the disease so that a cure can be engineered.<br><br>The three face down cards in the top left make up the disease's 'hand'. They were randomly chosen from the deck, and their suits and values define the characteristics of the disease. They determine what kinds of victims the disease can infect. It is your job to deduce what suits and values are present in the disease's hand before time runs out or too many people die.<br><br>As the game plays out, you will expose individuals to the disease and, based on whether or not they are infected, you will try to deduce the composition of the disease's hand. Each card in the deck represents a person with unique characteristics defined by the suit and value of the card representing them.",
"<b>(2) - Infection:</b> There are three rules that determine whether or not a card can be infected.<br><br>The first rule is that if a suit is present in the disease's hand, the disease can infect all cards of that suit. (So if the disease's hand is a 2 of Hearts, 9 of Diamonds, and Jack of Diamonds, it can infect any Hearts cards and any Diamonds cards.)<br><br>The second rule is that if a value is present in the disease's hand, the disease can infect all cards with a value exactly ONE greater than or ONE less than that value. (So if the disease's hand is a 4 of Hearts, 6 of Diamonds, and King of Diamonds, it can infect any 3, 5, 7, Queen, or Ace.)<br><br>The final rule is that the disease CANNOT infect any card with a value that is present in its hand. When this rule is in conflict with either of the previous rules, it overrides them. (So if the disease's hand is a 4 of Diamonds, 5 of Spades, and Ace of Hearts, it CANNOT infect any 4, 5, or Ace, even if they are infectable under the previous two rules.)",
"<b>(3) - Rounds:</b> Every round you will be presented with a set of available cards, (situated to the right of the disease's hand.) and you must choose HALF of them to be exposed to the disease. They will then be infected (or not) according to the rules of infection, and the next round will begin, and you will be presented with a new set of cards to expose to the disease.",
"<b>(4) - Available Cards:</b> To select cards from the available cards that will be exposed to the disease, click on them. (Remember you may only select half of the available cards.) Selected cards will be highlighted by an orange border.",
"<b>(5) - Exposed Cards:</b> The cards that you choose to be exposed will appear on the left side of the screen, below the disease's hand. Infected cards will be marked in green.<br><br>You may notice that there is already one green card in this area. This is patient zero, the first person infected by the disease. Every game begins with a patient zero. The patient is drawn randomly from the deck, with the stipulation that it must be infectable by the disease.",
"<b>(6) - Guessing the Disease's Hand:</b> Once you think you know the makeup of the disease's hand, you may make your guess, however, you only get one chance, so if you are incorrect, then you have lost.<br><br>When you are ready to guess, press the spacebar. Every suit and every value will appear on the screen. Select three suits you think are present in the disease's hand, as well as three values.<br><br>Keep in mind you are only guessing which suits and value are PRESENT, not which suits go with which values. You need not guess that the disease has a 2 of Clubs, 4 of Hearts, and 9 of Spades, only that Clubs, Hearts, and Spades are present in its hand, as are 2, 4, and 9.<br><br>In certain cases, the disease will have duplicates of a value or suit. (Such as two hearts or two aces.) In this case, you must still guess three suits and three values, and as long as the two (or one, in some cases) that the disease has are present in your guess, you will be correct.",
"<b>(7) - Death Count and Losing:</b>In addition to losing by guessing wrong, you will lose once you have drawn all the cards in the deck, or if you cannot find the disease during the seventh (final) round.<br><br>Once you have a grasp of how to figure out the disease's makeup, the next step is to try to do it with as few deaths as possible. Deaths are calculated based on how many rounds you took, and how many cards you infected along the way. So you'll need to try to glean all the information you can from every card, in order to win as fast as possible.",
"<b>(8) - Strategy, Part 1:</b> Though there are many ways to deduce what values and suits are (or aren't) in the disease's hand, there are a few basic ones that I have discovered in making and playing this game. Feel free to skip the strategy sections if you want to try and figure out these methods on your own, but if you want a little help getting started, read on.<br><br>The first and most basic is that if a card is infected, you can deduce that the disease does not have that card's value in its hand, because if it did, (according to the 3rd law of infection) that card would be uninfected. For example, if a 3 of Spades in infected, you know that the disease cannot have a 3 in its hand, because a three in the disease's hand would prevent all threes from being infected.",
"<b>(9) - Strategy, Part 2:</b> Here's a scenario that will allow you to deduce a suit that is present in the disease's hand: You have three infected cards, whose values are adjecent to each other.(e.g. 4,5,6, or 12,13,1) Say you have a 7 of Spades, an 8 of Hearts, and a 9 of Clubs, all infected. Look at the card in the middle, in this case the 8 of Hearts. There are three possible reasons it could be infected. 1) The disease has a hearts card. 2) The disease has a seven. 3) The disease has a 9.<br><br>Of these three reasons, we can eliminate the last two as impossible because we have an infected 7, and an infected 9. (Remember that whenever a card is infected, it tells us that the disease does not have that card's value in its hand.) That leaves only one possible explanation: The disease has Hearts.",
"<b>(10) - Strategy, Part 3:</b> Once you deduce one thing, that new knowledge can often help you deduce even more. For instance, building off the previous scenario, which allowed us to deduce that the disease had Hearts, we can likely discover some of the values the disease has. Say we have an uninfected 3 of Hearts. What are the reasons it could be uninfected? 1) The disease could have no Hearts. 2) The disease could have a 3.<br><br>Since we just established that the disease has Hearts, we can elminate the first possibility, which leaves only the second. Thus we now know that the disease has a three.",
"<b>(11) - Strategy, Part 4:</b> Generally, I've found that trying to expose at least one card of every value to the disease gives you a lot of information to work with, but in some cases it can be advantageous to have two cards of the same value exposed to the disease. Say you have a 2 of Clubs that is infected, and a 2 of Spades that is not. What are the possible explanations for why the 2 of Spades would be uninfected? 1) The disease has a 2. 2) The disease has no Spades.<br><br>Because we already have another 2 that is infected, (the 2 of Clubs) we know that the disease does NOT have a 2, eliminating the first explanation, leaving only the second and establishing that the disease has no Spades.",
"<b>(12) - Strategy, Part 5:</b> Again, building off the previous scenario, once you know that one suit is NOT present in the disease's hand, often you can deduce even more. Say we have a 5 of Spades that is infected, a 4 of Diamonds that is infected, and we just deduced that the disease has no Spades. The 5 could be infected because: 1) The disease has Spades. 2) The disease has a 4. 3) The disease has a 6.<br><br>We can eliminate the first two options, which leaves us to conclude that the disease has a 6.",
"<b>(13) - Strategy, Part 6:</b> There are countless other more complex scenarios you can figure things out from, but I'll leave you to discover them yourself. My general process is to list possible explanations for a certain outcome as I do in the examples. Once I have a list, if I can eliminate enough explanations, then I can figure out what caused the outcome.<br><br>Though in the examples I only list the explanations for the states of individual cards, you can do it for a set of cards as well. (e.g. What are the possible explanations for why these three cards are infected, and this fourth one is not.)<br><br>Good luck saving the world!"];
var subjectPool = new Array();// -------- i dont think this is ever used
var testPool = new Array();// -------- i don't think this is ever used
var allGuessIcons = new Array();
var allCards = new Array();
var previousCards = new Array();
var exposedCards = new Array();
var availableCards = new Array();
var diseaseHand = new Array();
var discard = new Array();
var theDeck;

//alert("start");

var Card = function Card(value,valueName,suit){
	this.value = value;
	this.valueName = valueName;
	this.suit = suit;
	this.infected = false;
	this.faceUp = true;
	this.selected = false;
	this.currentLocation = "deck";
	this.currentArray;
	this.x = 0;
	this.y = 0;
	this.width = WIDTH * 0.068125;//0.0545; //ensures the card's with maintains a constant ratio to the canvas width
	this.height = this.width * 1.532110091743; //ensures the card's height maintains a constant ratio to the width of the card. -------- might just make this scale with the canvas height idk
	this.textSize = this.width * 0.3;
	this.suitImage = new Image();

	if (this.suit == "Clubs") {
		this.suitImage = clubIcon;
	}else if (this.suit == "Spades") {
		this.suitImage = spadeIcon;
	}else if (this.suit == "Hearts") {
		this.suitImage = heartIcon;
	}else if (this.suit == "Diamonds") {
		this.suitImage = diamondIcon;
	}

	allCards.push(this);

	//returns true if this card can be infected by the disease
	this.canBeInfected = function() {
		var infectable = false;
		for (i = 0; i < diseaseHand.length; i++) {
			if (this.valueMatches(diseaseHand[i])) {
				return false;
			}else{
				if (this.suitMatches(diseaseHand[i])) {
					infectable = true;
				}else if (this.isOneOffFrom(diseaseHand[i])) {
					infectable = true;
				}
			}
		}
		return infectable;
	}

	//HELPER METHODS FOR CANBEINFECTED

	//returns true if this card's value is one greater than or one less than the value of the comparedCard
	this.isOneOffFrom = function(comparedCard){
		if (Math.abs(this.value - comparedCard.value) == 1) {
			return true;
		}else if (Math.abs(this.value - comparedCard.value == 12)) { //this if statement is here to account for the fact that an ace and a king should be treated as off by one from each other
			return true;
		}else{
			return false;
		}
	}

	//returns true if this card's suit and the comparedCard's suit match
	this.suitMatches = function(comparedCard){
		if (this.suit == comparedCard.suit) {
			return true;
		}else{
			return false;
		}
	}

	//returns true if the value of this card matches the value of the compared card
	this.valueMatches = function(comparedCard){
		if (this.value == comparedCard.value) {
			return true;
		}else{
			return false;
		}
	}

	//END OF HELPER METHODS FOR CANBEINFECTED

	//moves this card from its current location to the specified destination
	this.moveTo = function(destinationString, destinationArray) {
		destinationArray.push(this);
		this.currentArray.splice(this.currentArray.indexOf(this),this.currentArray.indexOf(this) + 1);
		this.currentLocation = destinationString;
		this.selected = false;
	}

	//converts the information of this card object to string form
	this.toString = function() {
		return (this.valueName + " of " + this.suit);
	}

	//returns true if the given coordinates are in the space this object occupies
	this.wasClicked = function(x, y) {
		if (x > this.x && x < (this.x + this.width) && y > this.y && y < (this.y + this.height)) {
			return true;
		}else{
			return false;
		}
	}

	this.select = function() {
		this.selected = true;
		selectedCardCount++;
	}
	
	this.update = function() {
		if (this.currentLocation == "diseaseHand"){
			this.x = initialOffsetX + (diseaseHand.indexOf(this)*(this.width + (this.width/10)));
			this.y = initialOffsetY;
			this.faceUp = false;
		}else if (this.currentLocation == "availableCards") {
			this.x = initialOffsetX + WIDTH*0.35 + (availableCards.indexOf(this) % maxCardsPerRow)*(this.width + (this.width/10));
			this.y = initialOffsetY + (this.height + (this.height/10))*(Math.floor(availableCards.indexOf(this)/maxCardsPerRow));
		}else if (this.currentLocation == "previousCards") {
			for (j = 0; j < previousCards.length; j++) {
				if (previousCards[j].indexOf(this) > -1) {
					this.x = initialOffsetX + (previousCards[j].indexOf(this)*(this.width + (this.width/10)));
					this.y = initialOffsetY + (this.height + this.height/10)*(j+1);
				}
			}
		}else if (this.currentLocation == "exposedCards") {
			this.x = initialOffsetX + (exposedCards.indexOf(this)*(this.width + (this.width/10)));
			this.y = initialOffsetY + (this.height + (this.height/10))*(roundNumber-1);
		}else if (this.currentLocation == "discard") {
			this.x = initialOffsetX + (discard.indexOf(this))*this.width/24 + WIDTH*0.35;
			this.y = initialOffsetY + (this.height + (this.height/10))*(Math.floor((availableCards.length-1)/maxCardsPerRow)+1);
			this.faceUp = false;
		}
		//if its the guessphase, make sure only the diseaseHand can be seen
		if (guessPhase) {
			for (i = 0; i < allCards.length; i++) {
				if (allCards[i].currentLocation != "diseaseHand") {
					allCards[i].currentLocation = "deck";
				}
			}
		}
	}
	this.draw = function() {
		if (this.currentLocation != "deck") {
			if (this.faceUp) {
				//draw the correct card image
				if (!this.infected) {
					ctx.drawImage(blankCard, this.x, this.y, this.width, this.height);
				}else{
					ctx.drawImage(blankInfectedCard, this.x, this.y, this.width, this.height);
				}
				if (this.selected) {
					ctx.drawImage(blankSelectedCard, this.x, this.y, this.width, this.height);
				}
				//Draw the suit of the card and the card value, keeping all images to the same scale as the card
				ctx.drawImage(this.suitImage, (this.x + (this.width/2)) - (this.width/4), (this.y + (this.height/2)) - (this.width/4), this.width/2, this.width/2);
				ctx.font = this.textSize.toString() + "px Georgia";
				ctx.fillStyle = CARDTEXTCOLOR;
				ctx.fillText(this.value.toString(), this.x + this.width/8, this.y + this.height/5);
			}else{
				ctx.drawImage(faceDownCard, this.x, this.y, this.width, this.height);
			}
		}
	}
}

var Deck = function Deck(contents){
	this.contents = contents;
	for (i = 0; i < this.contents.length; i++) {
		this.contents[i].currentArray = this.contents;
	}

	this.shuffle = function() {
		//shuffling algorithm
		for (i = contents.length - 1; i > 0; i--) {
			var howMany = i + 1;
			var start = 0;
			var randPos = Math.floor((Math.random() * howMany) + start);
			var temp = contents[i];
			contents[i] = contents[randPos];
			contents[randPos] = temp;
		}
	}

	//returns an array of the top n cards of the deck, and removes those cards from the top of the deck. Then sets the currentLocation of every card drawn to destination
	this.drawCards = function(n, destinationString, destinationArray) {
		if (this.contents.length == 0 && !gameOver) {
			alert("You took to long to find the vaccine! The disease has spread beyond all chances of suppression. The entire population of the earth will die in under a year. (You've drawn all the cards in the deck.)");
			endGame();
		}else{
			for (i = 0; i < n; i++) {
				if (this.contents.length > 0) {
					this.contents[0].moveTo(destinationString, destinationArray);
				}else if (!gameOver){
					i = n;
				}
			}
		}
	}

	//returns the top card of the deck
	this.getNextCard = function() {
		return contents[0];
	}
}

var GuessIcon = function GuessIcon(type, value){
	this.x;
	this.y;
	this.width = WIDTH * 0.0545;
	this.height = this.width * 1.532110091743;
	this.type = type;
	this.value  = value;
	this.textSize = this.width * 0.6;
	this.selected = false;
	this.currentImage = new Image();

	if (this.type == "suit") {
		this.y = HEIGHT/2 - (this.height+this.height/10);
		if (this.value == "Hearts") {
			this.currentImage = heartIcon;
			this.x = WIDTH/2 - 2*(1.1*this.width);
		}else if (this.value == "Diamonds") {
			this.currentImage = diamondIcon;
			this.x = WIDTH/2 - (1.1*this.width);
		}else if (this.value == "Clubs") {
			this.currentImage = clubIcon;
			this.x = WIDTH/2;
		}else if (this.value == "Spades") {
			this.currentImage = spadeIcon;
			this.x = WIDTH/2 + (1.1*this.width);
		}
	}else{
		this.y = HEIGHT/2;// + (this.height+this.height/10); -------- revisit
		this.x = (WIDTH/2 - (7.1*this.width)) + ((1.1*this.width) * (parseInt(this.value) - 1)); //-------- replace all this.width + this.width/10 with 1.1*width
	}

	this.wasClicked = function(x, y) {
		if (x > this.x && x < (this.x + this.width) && y > this.y && y < (this.y + this.height)) {
			return true;
		}else{
			return false;
		}
	}

	this.select = function() {
		this.selected = true;
		if (this.type == "suit"){
			if (selectedSuitGuessCount < 3) {
				selectedSuitGuessCount++;
			}else{
				alert("You cannot select more than 3 suits for your guess.");
			}
		}else if (this.type == "value") {
			if (selectedValueGuessCount < 3) {
				selectedValueGuessCount++;
			}else{
				alert("You cannot select more than 3 values for your guess.");
			}
		}
	}

	this.draw = function() {
		if (this.selected) {
			ctx.drawImage(blankSelectedCard, this.x, this.y, this.width, this.height);
		}else{
			ctx.drawImage(blankCard, this.x, this.y, this.width, this.height);
		}
		if (this.type == "suit") {
			ctx.drawImage(this.currentImage, (this.x + (this.width/2)) - (this.width/4), (this.y + (this.height/2)) - (this.width/4), this.width/2, this.width/2)
		}else if (this.type == "value") {
			ctx.font = this.textSize.toString() + "px Georgia";
			ctx.fillStyle = CARDTEXTCOLOR;
			ctx.fillText(this.value, this.x + (this.width/4), this.y + (this.height/2));
		}
	}
}

function main() {
	//alert("main");

	//WIDTH and HEIGHT constant initializations
	var body = document.body, html = document.documentElement;
	HEIGHT = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) - 20;
	WIDTH = HEIGHT*900/850;
	//sidebar setup
	document.getElementById("sideBar").style.left = HEIGHT*(915/850)+"px";
	document.getElementById("sideBar").style.width = document.body.clientWidth-(WIDTH+25)+"px";
	//canvas setup
	canvas = document.createElement("canvas");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	//canvas.style.background = "#c5c4fe";
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);

	//storing html elements in variables
	rulesText = document.getElementById("rulesText");
	rulesText.innerHTML = instructionsArray[0];
	var sideBar = document.getElementById("sideBar");

	document.addEventListener("click",mouseClickHandler,false);
	document.addEventListener("keydown",keyPressHandler,false);

	//image initializations
	blankCard.src = "res/images/blankCard.png";
	faceDownCard.src = "res/images/faceDownCard.png";
	blankInfectedCard.src = "res/images/blankInfectedCard.png";
	blankSelectedCard.src = "res/images/blankSelectedCard.png";
	diamondIcon.src = "res/images/diamondIcon.png";
	clubIcon.src = "res/images/clubIcon.png";
	spadeIcon.src = "res/images/spadeIcon.png";
	heartIcon.src = "res/images/heartIcon.png";
	
	init();

	//main loop
	var loop = function() {
		update();
		draw();
		window.requestAnimationFrame(loop, canvas);
	}
	window.requestAnimationFrame(loop, canvas);
}

//initializes the starting values for the game
function init() {
	//set starting values
	//Deck initialization
	var values = [1,2,3,4,5,6,7,8,9,10,11,12,13];
	var valueNames = ["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Jack","Queen","King"];
	var suits = ["Diamonds","Hearts","Clubs","Spades"];
	theDeck = new Deck(generateDeckCards(values, valueNames, suits));
	theDeck.shuffle();
	theDeck.drawCards(3,"diseaseHand",diseaseHand);
	//GuessIcon initialization
	for (i = 0; i < suits.length; i++) {
		allGuessIcons.push(new GuessIcon("suit",suits[i]));
	}
	for (i = 0; i < values.length; i++) {
		allGuessIcons.push(new GuessIcon("value",values[i].toString()))
	}
	dealPhase();
}

//generates a deck of cards with all possible value and suit combinations
function generateDeckCards(values,valueNames,suits) {
	var deckCards = new Array();
	for (i = 0; i < suits.length; i++) {
		for (j = 0; j < values.length; j++) {
			deckCards.push(new Card(values[j],valueNames[j],suits[i]));
		}
	}
	return deckCards;
}

//calls the update functions of all objects that have update functions
function update() {
	if (!gameOver) {
		for (i = 0; i < allCards.length; i++) {
			allCards[i].update();
		}
	}
}

//calls the draw functions of all objects that have draw functions
function draw() {
	ctx.clearRect(0,0,WIDTH,HEIGHT);
	ctx.save();
	ctx.fillStyle = UITEXTCOLOR;
	ctx.font = diseaseHand[0].textSize.toString() + "px Georgia";
	ctx.fillText(theDeck.contents.length + " Cards Left", 20+3.3*diseaseHand[0].width, 45);
	ctx.fillText("Round " + (roundNumber - 1), 20+3.3*diseaseHand[0].width, 80);
	for (i = 0; i < allCards.length; i++) {
		allCards[i].draw();
	}
	if (guessPhase) {
		for (i = 0; i < allGuessIcons.length; i++) {
			allGuessIcons[i].draw();
		}
	}
	ctx.restore();
}

function mouseClickHandler(evt) {
	var x = evt.pageX - canvas.offsetLeft;
	var y = evt.pageY - canvas.offsetTop;
	if (!guessPhase) { //card selection code
		for (i = 0; i < availableCards.length; i++) {
			if (availableCards[i].wasClicked(x, y) && !availableCards[i].selected) {
				availableCards[i].select();
				if (selectedCardCount >= availableCards.length/2) {
					updatePreviousCards();
					infectPhase();
				}
			}
		}
	}else{ //guess selection code
		for (i = 0; i < allGuessIcons.length; i++) {
			if (allGuessIcons[i].wasClicked(x, y) && !allGuessIcons[i].selected) {
				allGuessIcons[i].select();
				if (selectedSuitGuessCount >= 3 && selectedValueGuessCount >= 3) {
					submitGuess();
				}
			}
		}
	}
}

function keyPressHandler (evt) {
	if (evt.keyCode == LEFTARROW) {
		prevPage();
	}else if (evt.keyCode == RIGHTARROW) {
		nextPage();
	}else if (evt.keyCode == SPACEBAR && !gameOver) {
		guessPhase = true;
	}
}

//Phase functions

//deal cards equal to four times the number of infected cards in exposedCards, if this is the first round, find patient zero
function dealPhase() {
	if (roundNumber == 1) {
		while (!theDeck.getNextCard().canBeInfected()) {
			theDeck.drawCards(1,"discard",discard);
		}
		theDeck.drawCards(1,"exposedCards",exposedCards);
		infectPhase();
	}else{
		var infectedCount = 0;
		for (i = 0; i < exposedCards.length; i++) { //count all the cards in the currently exposed set that are infected
			if (exposedCards[i].infected) {
				infectedCount ++;
			}
		}
		if (infectedCount != 0) {
			theDeck.drawCards(infectedCount*4, "availableCards", availableCards);
		}else{
			theDeck.drawCards(4, "availableCards", availableCards);
		}
	}
}

//Move all selected cards from availableCards to exposedCards, then infect all infectable cards in exposedCards
function infectPhase() {
	selectedCardCount = 0;
	for (j = 0; j < availableCards.length; j++) { //move all selected cards in availableCards to exposedCards
		if (availableCards[j].selected) {
			availableCards[j].moveTo("exposedCards",exposedCards);
		}else{
			availableCards[j].moveTo("discard",discard);
		}
	}
	availableCards = new Array(); //Turns out this is necessary because splice(), which I use in Card's moveTo() method, doesn't seem to actually shorten the array, just removes the element by making that spot in the array empty, meaning that if you don't reset the array like I do here, new card objects added to the array get added on with indices starting from like 3 or something instead of 0, because the array still technically has spots 0 through 3 filled with empty space
	for (j = 0; j < exposedCards.length; j++) { //infect all infectable cards in exposedCards. j is used here instead of i because when I used i it interacted weirdly with the i in the for loop of canBeInfected -------- maybe try this.i?
		if (exposedCards[j].canBeInfected()) {
			exposedCards[j].infected = true;
			deathCount++;
		}
	}
	roundNumber++;
	if (roundNumber == 8) {
		alert("You must find the cure this round. Fail to do so, and the disease will have spread too far to be controllable.");
	}
	if (roundNumber == 9 && !gameOver){
		alert("You took too long to find a vaccine -- the disease has spread beyond all hopes of control. Everyone on the earth will die within a year. (You did not find the vaccine by the 7th round.)");
		endGame();
	}
	dealPhase();
}

//construct an array of the suits present in the disease hand, and the value present in the disease hand, and compare them to another array constructed of the suits and values in the player's guess
function submitGuess() {
	var correct = true;
	//player's guess arrays
	var guessSuitArray = new Array();
	var guessValueArray = new Array();
	for (i = 0; i < allGuessIcons.length; i++) { //populate the players guess suit and value arrays
		if (allGuessIcons[i].selected) {
			if (allGuessIcons[i].type == "suit") {
				guessSuitArray.push(allGuessIcons[i].value);
			}else if (allGuessIcons[i].type == "value") {
				guessValueArray.push(allGuessIcons[i].value);
			}
		}
	}
	//Notes: I initially tried to use indexOf here to check if objects were contained in the arrays, but that didnt work for. Idk why. But anyway, I wrote a contains() function to replace indexOf and it works with that.
	for (i = 0; i < diseaseHand.length; i++) { //check the suit and value attributes of each card in disease hand against the guesser's arrays of suits and values to see if they match.
		if (!contains(guessSuitArray,diseaseHand[i].suit)) {
			correct = false;
		}
		if (!contains(guessValueArray,diseaseHand[i].value)) {
			correct = false;
		}
	}
	//Announce the outcome of guess and end the game
	if (correct) {
		alert("Congratulations! You guessed correctly and have won!");
		alert("You found the vaccine in " + (roundNumber-1) + " months(rounds), during which time " + deathCount*(roundNumber-1) + "% of the earth's population died. (Based on how many cards were infected, and how long it took you.)");
	}else{
		alert("You guessed incorrectly and have lost.");
	}
	endGame();
}

//Gameplay helper methods

function updatePreviousCards() { //-------- idk if these i's will cause problems with other for loops also this code is a little clunky
	previousCards.push(new Array()); //create a new array in previous cards
	for (i = 0; i < exposedCards.length; i++) { //add the contents of exposedCards to the last array in previous cards (AKA the one just created)
		exposedCards[i].moveTo("previousCards",previousCards[roundNumber - 2]);
	}
	exposedCards = new Array();// -------- try removing this, shouldnt need it
}

function endGame(){
	for (i = 0; i < diseaseHand.length; i++) {
		diseaseHand[i].faceUp = true;
	}
	for (i = 0; i < availableCards.length; i++) {
		availableCards[i].moveTo("deck",theDeck.contents);
	}
	gameOver = true;
}

//compares obj to every element in array a. Returns true if obj is in a, false if not. 
function contains(a, obj) {
	for (k = 0; k < a.length; k++) {
		if (obj == a[k]) {
			return true;
		}
	}
	return false;
}

//instruction navigation methods

function nextPage() {
	//displays the next page of rules text
	var nextIndex = instructionsArray.indexOf(rulesText.innerHTML)+1;
	if (nextIndex < instructionsArray.length) {
		rulesText.innerHTML = instructionsArray[nextIndex];
	}
	else {
		rulesText.innerHTML = instructionsArray[0];
	}
}

function prevPage() {
	//displays the previous page of rules text
	var prevIndex = instructionsArray.indexOf(rulesText.innerHTML)-1;
	if (prevIndex >= 0) {
		rulesText.innerHTML = instructionsArray[prevIndex];
	}
	else {
		rulesText.innerHTML = instructionsArray[instructionsArray.length - 1];
	}
}

main();