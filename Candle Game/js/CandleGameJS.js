 //Known Bugs - Sometimes a player can only move one piece once for some reason. 'You can't select opp's piece,' on init, still there are issues with snuffing not working properly sometimes.
//Quality of Life Things To Do - Add draggable pieces, cursor change during candleInit

//Next thing To do: make snuff recursive? actual game ending, adjust colors of starting areas (and by extension turnIndicator text) to be more clear and contrasty

//clean up rules text, logo/title

//Cleaning up the code: I've marked certain lines with comments beginning in '--------' (8 dashes) if they need to be cleaned up or changed

//Common Keycodes
var LEFTARROW = 37;
var UPARROW = 38;
var RIGHTARROW = 39;
var DOWNARROW = 40;

//Constant declarations
var WIDTH, HEIGHT, COLUMNS = 9, ROWS = 8, ACTIONSPERTURN = 3;
//Color hexcode declarations
var LIGHT = "#d6c275", DARK = "#ab9b5d", WATERCOLOR = "#6d77a0", STARTAREACOLOR = "#5b523e";
//Canvas Declarations
var canvas, ctx;
//Sidebar text declarations
var turnIndicator, rulesText;
//Array Declarations
var tileGrid = new Array(); //holds all tiles
var candleArray = new Array(); //holds all candles
var instructionsArray = ["<b>(1) - Object of the Game:</b> There are two ways to win. One: get one of your four candles off your opponent's side of the board while it is still lit. Two: extinguish all four of your opponent's candles.",
"<b>(2) - Placing and Lighting Candles:</b> You may place your four candles in your starting area tiles, marked by gray for the Dark Player, and light blue for the Light Player. Initially, they will be unlit.<br><br>Once both players have placed their four candles, they must each light one of their candles as part of their first turn. The candle that will be lit is whichever candle the player clicks on first.<br><br>Lit candles are marked by an orange flame. Note that candles on water tiles (the blue squares) cannot be lit.",
"<b>(3) - Spreading Fire:</b> Whenever a lit candle is adjacent to an unlit candle, the fire from the lit candle spreads to the unlit candle, continuing to spread from that candle in a chain reaction.<br><br>Note that because candles on water tiles cannot be lit, they can stop the spread of fire.<br><br>This process affects all candles, regardless of whether they are an opponent's candles or your candles. So you can light your own candles by moving next to an opponent's lit candle and vice versa.",
"<b>(4) - Moving and Selecting Candles:</b> Before you can move a candle, you must select it. To select a candle, click on it. Selected candles will be marked by a red border. Once you have selected a candle, click on an adjacent tile to move it there. Note that if you move a lit candle onto a water tile, it will be extinguished.<br><br>To move off your opponent's side of the board with your selected candle, just click anywhere outside the edges of the board.",
"<b>(5) - Turns: </b> Each turn, you may do one of two things: Move a single candle twice, or move three different candles once each. To help you keep track of what you can and can't move, candles that you CAN still move on your current turn will be marked by red flames at their bases.<br><br>To end your turn, press the spacebar.",
"<b>(6) - Snuffing:</b> Once per turn, if you wish, you may Snuff a candle. To snuff a candle, select it and press 'S'. Snuffing a candle works like the reverse of spreading fire. Snuffing will extinguish the selected candle and spread through all candles adjacent to it, (just as fire spreads) extinguishing them as well.<br><br>Thus, if all of your opponent's candles were touching each other, you would be able to move just one of your lit candles adjacent to one of your opponent's candles and snuff it, setting off a chain reaction that would snuff ALL of your opponent's candles.<br><br>However, you may only snuff one of your candles if it was LIT at the BEGINNING of your current turn."]; //contains the instructions for the game, divided up into different sections or 'pages'
var tempSnuffArray = new Array(); //--------used in the code that snuffs candles. I should move this
//Image declarations
var candleIconDarkTeamSnuffed = new Image();
var candleIconDarkTeamLit = new Image();
var candleIconLightTeamSnuffed = new Image();
var candleIconLightTeamLit = new Image();
var candleSelectedBorder = new Image();
var candleCanMoveSymbol = new Image();
//Gameplay variables declarations
var selectedCandle; //candle object that refers to the currently selected candle
var darkPlayer; //player object representing player 1
var lightPlayer; //player object representing player 2
var currentPlayer; //player object that refers to the player whose turn it currently is
var candleInitPhase = true; //tracks whether or not the game is in the phase where players place their candles
var gameEnded = false; //tracks whether or not the game is still continuing
var moreCandlesToLight = false; //--------used in candle-lighting code that controls the spread of fire from one candle to another. I should move this probably
var moreCandlesToSnuff = false; //--------same as above ^^^ but for snuffing. I should probably move this
var candleCounter = 0; //--------I should probably move this

//alert("start");

var Tile = function Tile(xCo, yCo, tempColor) {
	//VARIABLE SETUP
	this.x = (xCo * WIDTH/COLUMNS);
	this.y = (yCo * WIDTH/COLUMNS);
	this.xCoordinate = xCo;
	this.yCoordinate = yCo;
	this.width = WIDTH/COLUMNS;
	this.height = HEIGHT/ROWS;
	this.color = tempColor;
	this.waterTile = false;
	this.startAreaOwner;
	this.occupied = false;
	
	//UPDATE FUNCTION
	this.update = function(mouseX, mouseY) {
		if (this.wasClicked(mouseX, mouseY) &&(candleInitPhase) && (this.occupied == false)) {
			//if this tile is within the allowed starting area of the player and we are in candleInit phase
			if (this.yCoordinate == currentPlayer.startAreaRow && (this.xCoordinate >= 2 && this.xCoordinate <= 6)) {
				if (currentPlayer.candleCount < 4 && candleInitPhase) {
					createCandle(this.xCoordinate, this.yCoordinate, currentPlayer)
					currentPlayer.candleCount += 1;
				}
				if (darkPlayer.candleCount == 4 && lightPlayer.candleCount == 4) {
					candleInitPhase = false;
				}
				if (currentPlayer.candleCount == 4) {
					if (currentPlayer == darkPlayer) {
						beginTurn(lightPlayer,darkPlayer);
					}else{
						beginTurn(darkPlayer,lightPlayer);
					}
				}
			}else{
				alert("You must place candles within the designated starting area.");
			}
		}
		//The if clause below evaluates to true if the mouse cooridinates are within this tile and the tile is unoccupied
		if (this.wasClicked(mouseX, mouseY) && (this.occupied == false)) {
			//check that selectedCandle is not undefined
			if (typeof selectedCandle != "undefined") {
				if (this.isAdjacentTo(selectedCandle)) {
					//check that selectedCandle's owner has enough actions to do this
					if (selectedCandle.owner.actionsLeft >= selectedCandle.costToMove) {
						selectedCandle.currentTile.occupied = false;
						selectedCandle.currentTile = this;
						selectedCandle.movedThisTurn = true;
						selectedCandle.owner.actionsLeft -= selectedCandle.costToMove;
						this.occupied = true;
						//if this tile is a water tile, snuff the candle that just moved onto it
						if (this.waterTile) {
							selectedCandle.lit = false;
						}
					}
					else {
						alert("Remember, you may move either ONE candle TWO squares, or THREE separate candles one square each.");
					}
				}
			}
		}
	}
	//DRAW FUNCTION
	this.draw = function() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x,this.y,this.width,this.height);
		//alert(this.startAreaOwner);
		if (this.startAreaOwner != undefined && candleInitPhase) {
			ctx.fillStyle = this.startAreaOwner.textColor;//Set the border color marking that this is a starting area to a different color depending on which player's starting area it is.
			ctx.fillRect(this.x,this.y,this.width,this.height);
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x+(this.width/10),this.y+(this.height/10),this.width-(this.width/5),this.height-(this.height/5));
		}
	}
	//returns true if this object is adjacent to target on the tile grid
	this.isAdjacentTo = function(target) {
		if (this.xCoordinate == target.xCoordinate || this.yCoordinate == target.yCoordinate) {
			if (Math.abs((this.xCoordinate + this.yCoordinate)-(target.xCoordinate + target.yCoordinate)) == 1) {
				return true;
			}
		}else{
			return false;
		}
	}
	//returns true if the given mouse coordinates place the mouse on top of this object
	this.wasClicked = function(mouseX, mouseY){
		if (((mouseX > this.x && mouseX < (this.x + this.width)) && (mouseY > this.y && mouseY < (this.y + this.height)))) {
			return true;
		}else{
			return false;
		}
	}
}

var Candle = function Candle(startTile,owner) {
	//VARIABLE SETUP
	this.width = (WIDTH/COLUMNS)*(9/10);
	this.height = (HEIGHT/ROWS)*(9/10);
	this.currentTile = startTile;
	this.owner = owner;
	this.x = this.currentTile.x + ((this.currentTile.width - this.width)/2);
	this.y = this.currentTile.y + ((this.currentTile.height - this.height)/2);
	this.xCoordinate = this.currentTile.xCoordinate;
	this.yCoordinate = this.currentTile.yCoordinate;
	this.costToMove = 1;
	this.movedThisTurn = false;
	this.canSnuff = false;
	this.lit = false;
	this.selected = false;
	this.currentImage = new Image();
	this.litImage = new Image();
	this.currentTile.occupied = true;
	if (this.owner.team == "dark") {
		this.currentImage = candleIconDarkTeamSnuffed;
		this.litImage = candleIconDarkTeamLit;
	}
	else if (this.owner.team == "light") {
		this.currentImage = candleIconLightTeamSnuffed;
		this.litImage = candleIconLightTeamLit;
	}

	/*this.currentImage.width = (WIDTH/COLUMNS)*(9/10);
	this.currentImage.height = (HEIGHT/ROWS)*(9/10);

	alert(this.currentImage.width);
	alert(this.currentImage.height)*/

	//UPDATE FUNCTION
	this.update = function(mouseX, mouseY) {
		//update the position and coordinates of this candle
		this.x = this.currentTile.x + ((this.currentTile.width - this.width)/2);
		this.y = this.currentTile.y + ((this.currentTile.height - this.height)/2);
		this.xCoordinate = this.currentTile.xCoordinate;
		this.yCoordinate = this.currentTile.yCoordinate;

		//this.currentImage.width = (WIDTH/COLUMNS)*(9/10);
		//this.currentImage.height = (HEIGHT/ROWS)*(9/10);

		if (this.owner.myTurn == false) {
			this.movedThisTurn = false;
		}
		
		//update cost-to-move based on whether or not this has moved this turn
		if (this.movedThisTurn) {
			this.costToMove = 2;
		}
		else {
			this.costToMove = 1;
		}
		
		//if this candle was clicked and it wasn't already selected, select it
		if (this.wasClicked(mouseX, mouseY) && (this.selected == false) && !candleInitPhase) {
			if (this.owner.myTurn) {
				this.select();
				//if it is the first turn of this candle's owner, this candle is the one they choose to initially light.
				if (this.owner.initiallyLighted == false) {
					//if this is not on a water tile
					if (this.currentTile.waterTile == false) {
						this.owner.initiallyLighted = true;
						this.lit = true;
					}
					else {
						alert("You cannot light a candle on a water tile.");
					}
				}
			}
			else if (!darkPlayer.firstTurn){
				alert("You cannot select an opponent's piece.");
			}
		}
	}
	//effectively the spreadfire method spreads the fire from this candle to each adjacent candle
	this.spreadFire = function() {
		if (this.lit) {
			//check every candle in candleArray and see if it is adjacent to this candle
			for (j = 0; j < candleArray.length; j++) {
				//if clause to check if the candle is adjacent to this candle
				if (this.xCoordinate == candleArray[j].xCoordinate || this.yCoordinate == candleArray[j].yCoordinate) {
					if (Math.abs((this.xCoordinate + this.yCoordinate)-(candleArray[j].xCoordinate + candleArray[j].yCoordinate)) == 1) {
						//checks that the candle is not lit and that the tile it's on is not a water tile
						if (candleArray[j].lit == false && candleArray[j].currentTile.waterTile == false) {
							candleArray[j].lit = true;
							moreCandlesToLight = true;
						}
					}
				}
			}
		}
	}
	//the snuff method snuffs this candle and all candles adjacent to this candle -------- redo snuff with recursion is what I should do
	this.snuff = function() {
		this.lit = false;
		tempSnuffArray = [];
		//check every candle in candleArray and see if it is adjacent to this candle
		for (j = 0; j < candleArray.length; j++) {
			//if clause to check if the candle is adjacent to this candle
			if (this.isAdjacentTo(candleArray[j])) {
				//checks that the candle is not lit and that the tile it's on is not a water tile
				if (candleArray[j].lit == true) {
					candleArray[j].lit = false;
					moreCandlesToSnuff = true;
					tempSnuffArray.push(candleArray[j]);
				}
			}
		}
	}
	//DRAW FUNCTION
	this.draw = function() {
		if (this.lit) {
			ctx.drawImage(this.litImage, this.x, this.y, this.width, this.height);
		}
		else {
			ctx.drawImage(this.currentImage, this.x, this.y, this.width, this.height);
		}
		if (this.selected == true) {
			ctx.drawImage(candleSelectedBorder, this.x, this.y, this.width, this.height);
		}
		if (this.costToMove <= this.owner.actionsLeft) {
			ctx.drawImage(candleCanMoveSymbol, this.x, this.y, this.width, this.height);
		}
	}
	
	//HELPER METHODS
	
	//Selects this candle
	this.select = function() {
		this.selected = true;
		selectedCandle = this;
		//deselect all other candles. This is to avoid having multiple candles selected
		for (var i = 0; i < candleArray.length; i++) {
			if (candleArray[i] != this) {
				candleArray[i].selected = false;
			}
		}
	}
	
	//returns true if this object is adjacent to target on the tile grid
	this.isAdjacentTo = function(target) {
		if (this.xCoordinate == target.xCoordinate || this.yCoordinate == target.yCoordinate) {
			if (Math.abs((this.xCoordinate + this.yCoordinate)-(target.xCoordinate + target.yCoordinate)) == 1) {
				return true;
			}
		}else{
			return false;
		}
	}
	
	//returns true if the given mouse coordinates place the mouse on top of this object
	this.wasClicked = function(mouseX, mouseY){
		if (((mouseX > this.x && mouseX < (this.x + this.width)) && (mouseY > this.y && mouseY < (this.y + this.height)))) {
			return true;
		}else{
			return false;
		}
	}
}

var Player = function Player(team) {
	this.team = team;
	this.winner = false;
	this.myTurn = false;
	this.actionsLeft = ACTIONSPERTURN;
	this.candleCount = 0;
	this.snuffedThisTurn = false;
	this.initiallyLighted = false;
	this.hasLitCandle = true;
	this.firstTurn = true;
	this.startAreaRow = 0;
	if (this.team == "light") {
		this.textColor = "#77a1ce";
		this.startAreaRow = 7;
	}
	else {
		this.textColor = "#8c8c8c";
	}
}

function main() {
	//WIDTH and HEIGHT constant initializations
	var body = document.body, html = document.documentElement;
	HEIGHT = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) - 20;
	WIDTH = HEIGHT*900/800;

	//sidebar setup
	document.getElementById("sideBar").style.left = HEIGHT*(915/800)+"px";
	document.getElementById("sideBar").style.width = document.body.clientWidth-(WIDTH+25)+"px";
	turnIndicator = document.getElementById("turnIndicator");
	rulesText = document.getElementById("rulesText");
	rulesText.innerHTML = instructionsArray[0];

	//canvas setup
	canvas = document.createElement("canvas");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
	
	//Setting up images
	candleIconDarkTeamSnuffed.src = "res/images/CandleIconDarkTeamSnuffed90x90.jpg";
	alert(candleIconDarkTeamSnuffed.src);
	candleIconDarkTeamLit.src = "res/images/CandleIconDarkTeamLit90x90.jpg";
	candleIconLightTeamSnuffed.src = "res/images/CandleIconLightTeamSnuffed90x90.jpg";
	candleIconLightTeamLit.src = "res/images/CandleIconLightTeamLit90x90.jpg";
	candleSelectedBorder.src = "res/images/CandleSelectedBorder90x90.png";
	candleCanMoveSymbol.src = "res/images/CandleCanMoveSymbol90x90.png";
	
	//Event listener declarations
	document.addEventListener("click",mouseClickHandler,false);
	document.addEventListener("keydown",keyPressHandler,false);
	document.addEventListener("keyup",keyReleaseHandler,false);
	
	//alert("main");
	
	init();

	//main loop
	var loop = function() {
		draw();
		window.requestAnimationFrame(loop, canvas);
	}
	window.requestAnimationFrame(loop, canvas);
}

function init() {
	//set starting values
	//Create 9x8 grid of Tile objects
	var tempColor = DARK;
	for (i = 0; i < COLUMNS; i++) {
		tileGrid[i] = new Array();
		if (tempColor == LIGHT) {
			tempColor = DARK;
		}
		else if (tempColor == DARK) {
			tempColor = LIGHT;
		}
		for (j = 0; j < ROWS; j++) {
			tileGrid[i][j] = new Tile(i,j,tempColor);
			if (tempColor == LIGHT) {
				tempColor = DARK;
			}
			else if (tempColor == DARK) {
				tempColor = LIGHT;
			}
		}
	}

	//Creates player objects
	lightPlayer = new Player("light");
	darkPlayer = new Player("dark");

	//Sets certain tiles to water tiles
	setWater(1,0);
	setWater(4,0);
	setWater(7,0);
	setWater(2,3);
	setWater(3,3);
	setWater(5,4);
	setWater(6,4);
	setWater(1,7);
	setWater(4,7);
	setWater(7,7);
	
	//sets certain tiles to starting area tiles
	tileGrid[2][0].startAreaOwner = darkPlayer;
	tileGrid[3][0].startAreaOwner = darkPlayer;
	tileGrid[4][0].startAreaOwner = darkPlayer;
	tileGrid[5][0].startAreaOwner = darkPlayer;
	tileGrid[6][0].startAreaOwner = darkPlayer;
	tileGrid[2][7].startAreaOwner = lightPlayer;
	tileGrid[3][7].startAreaOwner = lightPlayer;
	tileGrid[4][7].startAreaOwner = lightPlayer;
	tileGrid[5][7].startAreaOwner = lightPlayer;
	tileGrid[6][7].startAreaOwner = lightPlayer;
	
	//Creates player objects
	//lightPlayer = new Player("light");
	//darkPlayer = new Player("dark");
	//darkPlayer.myTurn = true;
	beginTurn(darkPlayer,lightPlayer);
}

function update(x,y) {
	if (gameEnded == false) {
		//call update functions for all candles and tiles
		for (i = 0; i < COLUMNS; i++) {
			for (j = 0; j < ROWS; j++) {
				tileGrid[i][j].update(x,y);
			}
		}
		for (i = 0; i < candleArray.length; i++) {
			candleArray[i].update(x,y);
		}
		//Call the spread fire functions of all candles
		for (i = 0; i < candleArray.length; i++) {
			candleArray[i].spreadFire();
		}
		while (moreCandlesToLight) {
			moreCandlesToLight = false;
			for (i = 0; i < candleArray.length; i++) {
				candleArray[i].spreadFire();
			}
		}
		if (darkPlayer.initiallyLighted && lightPlayer.initiallyLighted) {
			checkForWinner();
		}
		//if the mouseX and mouseY are outside of the canvas
		if (x > WIDTH || y > HEIGHT || x < 0 || y < 0) {
			//if selected candle is lit
			if (selectedCandle.lit) {
				//if selected candle is in one of the end tiles, (rows 1 and 8)
				if (selectedCandle.yCoordinate == 0) {
					if (selectedCandle.owner.team == "light") {
						selectedCandle.owner.winner = true;
					}
				}
				if (selectedCandle.currentTile.yCoordinate == 7) {
					if (selectedCandle.owner.team == "dark") {
						selectedCandle.owner.winner = true;
					}
				}
				if (darkPlayer.initiallyLighted && lightPlayer.initiallyLighted) {
					checkForWinner();
				}
			}
		}
	}
}

function draw() {
	//call the draw() function for every Tile in tileGrid
	ctx.clearRect(0,0,WIDTH,HEIGHT);
	ctx.save();
	for (i = 0; i < COLUMNS; i++) {
		for (j = 0; j < ROWS; j++) {
			tileGrid[i][j].draw();
		}
	}
	//call draw() functions of candles
	for (k = 0; k < candleArray.length; k++) {
		candleArray[k].draw();
	}
	ctx.restore();
}

function keyPressHandler(evt) {
	//Turns the rules text pages forward or backward with arrow keys
	if (evt.keyCode == LEFTARROW) {
		prevPage();
	}
	if (evt.keyCode == RIGHTARROW) {
		nextPage();
	}
	if (candleInitPhase == false) {//this is here because you cannot snuff during candle placement phase (candleInitPhase
		//if key pressed was 's' or 'l' - snuff target candle
		if (evt.keyCode == 83) {
			//make sure selected candle actually refers to something
			if (selectedCandle != null) {
				//if the owner of the selected candle has not used his snuff this turn
				if (selectedCandle.owner.snuffedThisTurn == false) {
					//if selected candle is lit and has been so since the beginning of its owner's turn
					if (selectedCandle.lit) {
						if (selectedCandle.canSnuff) {
							selectedCandle.snuff();
							while (moreCandlesToSnuff) {
								moreCandlesToSnuff = false;
								for (i = 0; i < tempSnuffArray.length; i++) {
									tempSnuffArray[i].snuff();
								}
							}
							selectedCandle.owner.snuffedThisTurn = true;
							if (gameEnded == false) {
								checkForWinner();
							}
						}
						else {
							alert("A candle must have been lit at the start of your turn for you to snuff with it.");
						}
					}
					else {
						alert("You cannot snuff an unlit candle.");
					}
				}
				else {
					alert("You may only snuff once per turn.");
				}
			}
			else {
				alert("You need to select a candle before you can snuff.");
			}
			//If a player has spent all their actions and snuffed, end their turn and begin their opponent's -------- should i move this to the keyup handler so it can happen when candle init phase isnt happening?
			if (darkPlayer.actionsLeft <= 0 && darkPlayer.myTurn && darkPlayer.snuffedThisTurn) {
				beginTurn(lightPlayer,darkPlayer);
			}
			else if (lightPlayer.actionsLeft <= 0 && lightPlayer.myTurn && lightPlayer.snuffedThisTurn) {
				beginTurn(darkPlayer,lightPlayer);
			}
		}
	}
}

function keyReleaseHandler(evt) {
	//The reason the key to change the player's turn is on a keyup event is because I use prompt()
	//to have the player confirm they want to end their turn if they end their turn with actions
	//remaining. The problem is that the dialogue box that pops up for prompt() triggers its 'ok'
	//button on spacebar keyup, so the prompt would end up appearing quickly when the spacebar was
	//pressed, and then closing, thinking the player said 'ok' as soon as the spacebar was released.
	//Having the end turn code trigger on keyup of spacebar avoids this problem.
	
	//-------- find a way to consolidate the separate if statements for light and dark players into one efficient one
	
	//if key pressed was spacebar - end the current player's turn
	if (evt.keyCode == 32 && !candleInitPhase) {
		if (darkPlayer.myTurn) {
			if (darkPlayer.actionsLeft <= 0) {
				beginTurn(lightPlayer,darkPlayer);
				darkPlayer.firstTurn = false; //-------- Could be streamlined
			}else if (!candleInitPhase){//--------redundant now because of initial if condition
				//ask player if they really want to end turn:
				if (confirm("Are you sure you want to end your turn without using all of your moves?")){
					beginTurn(lightPlayer,darkPlayer);
				}
			}else{
				beginTurn(lightPlayer,darkPlayer);
			}
		}
		else if (lightPlayer.myTurn) {
			if (lightPlayer.actionsLeft <= 0) {
				beginTurn(darkPlayer,lightPlayer);
				lightPlayer.firstTurn = false; //-------- Could be streamlined
			}else if (!candleInitPhase){//--------reduntant now because of initial if condition
				//ask player if they really want to end turn:
				if (confirm("Are you sure you want to end your turn without using all of your moves?")){
					beginTurn(darkPlayer,lightPlayer);
				}
			}else{
				beginTurn(darkPlayer,lightPlayer);
			}
		}
	}
}

function mouseClickHandler(evt) {
	var realX = evt.pageX - canvas.offsetLeft;
	var realY = evt.pageY - canvas.offsetTop;
	update(realX,realY);
}

function setWater(x,y) {
	//sets the tile of the given coordinates to a water tile
	tileGrid[x][y].color = WATERCOLOR;
	tileGrid[x][y].waterTile = true;
}

function createCandle(x,y,owner){
	candleArray.push(new Candle(tileGrid[x][y], owner));
}

function beginTurn(beginner, ender) {
	ender.myTurn = false;
	beginner.myTurn = true;
	beginner.actionsLeft = ACTIONSPERTURN;
	beginner.snuffedThisTurn = false;
	turnIndicator.style.color = beginner.textColor;
	if (candleInitPhase) {
		turnIndicator.innerHTML = (beginner.team.charAt(0).toUpperCase() + beginner.team.slice(1)) + " player's turn to place candles";
	}else if (beginner.firstTurn) {
		turnIndicator.innerHTML = "First candle " + (beginner.team.charAt(0).toUpperCase() + beginner.team.slice(1)) + " player clicks will be lit.";
	}else{
		turnIndicator.innerHTML = (beginner.team.charAt(0).toUpperCase() + beginner.team.slice(1)) + " player's turn";
	}
	currentPlayer = beginner;
	for (i = 0; i < candleArray.length; i++) {
		if (candleArray[i].owner == beginner) {
			if (candleArray[i].lit == true) {
				candleArray[i].canSnuff = true;
			}
			else {
				candleArray[i].canSnuff = false;
			}
		}
	}
	//deselect every candle
	for (i = 0; i < candleArray.length; i++) {
		candleArray[i].selected = false;
	}
	selectedCandle = null;
}

function checkForWinner() {
	//check that each player has at least one lit candle left
	darkPlayer.hasLitCandle = false;
	lightPlayer.hasLitCandle = false;
	for (i = 0; i < candleArray.length; i++) {
		if (candleArray[i].lit) {
			candleArray[i].owner.hasLitCandle = true;
		}
	}
	//if a player has no lit candles left, set their opponent to the winner
	if (darkPlayer.hasLitCandle == false && lightPlayer.hasLitCandle == true) {
		lightPlayer.winner = true;
	}
	if (lightPlayer.hasLitCandle == false && darkPlayer.hasLitCandle == true) {
		darkPlayer.winner = true;
	}
	//if neither player has any lit candles left, the game is a draw
	if (lightPlayer.hasLitCandle == false && darkPlayer.hasLitCandle == false && !gameEnded) {
		alert("The game is a draw because neither player has any lit candles left.");
		gameEnded = true;
	}
	//Declare one player the winner
	if (!gameEnded) {
		if (lightPlayer.winner) {
			alert("The light player has won.");
			gameEnded = true;
		}
		if (darkPlayer.winner) {
			alert("The dark player has won.");
			gameEnded = true;
		}
	}
}

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
