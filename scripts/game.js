//empty = 0; wall = 1; cube = 2; finish = 3; 4 = fail
var sampleGameModel = [
	[2, 0, 0, 1],
	[1, 1, 0, 0],
	[3, 0, 1, 0],
	[1, 0, 0, 0]
];
var program = [];
var programCounter = 0;
var currPos = {row:0, col:0};

function renderGame(){
	var gameBoxContainer = document.getElementById('services');
	while(gameBoxContainer.firstChild){
		gameBoxContainer.removeChild(gameBoxContainer.firstChild);
	}
	


	for(var i = 0; i < sampleGameModel.length; i++){
		for(var j = 0; j < sampleGameModel[i].length; j++){
			var newElement = document.createElement('div');
			var breakElement = document.createElement('br');
			newElement.classList.add('gameBox');
			newElement.innerHTML = '&nbsp;';
			switch(sampleGameModel[i][j]){
				case 0:
					newElement.style.backgroundColor = '#ffffff';
					break;
				case 1:
					newElement.style.backgroundColor = '#000000';
					break;
				case 2:
					newElement.style.backgroundColor = '#ffff00';
					break;
				case 3:
					newElement.style.backgroundColor = '#33cc00';
					break;
				case 4:
					newElement.style.backgroundColor = '#ff0000';
			}
			gameBoxContainer.appendChild(newElement);
		}
		gameBoxContainer.appendChild(breakElement);
	}
}
renderGame(sampleGameModel);

function addProgramStep(direction){
	var programStepsContainer = document.getElementById("program-steps");
	var newElement = document.createElement("div");
	var breakElement = document.createElement("br");
	newElement.classList.add("stepBox");
	switch(direction){
		case "Up":
		newElement.innerHTML = "^";
			program.push("Up");
			break;
		case "Down":
			program.push("Down");
			newElement.innerHTML = "v";
			break;
		case "Left":
			program.push("Left");
			newElement.innerHTML = "<";
			break;
		case "Right":
			program.push("Right");
			newElement.innerHTML = ">";
			break;
	}
	programStepsContainer.appendChild(newElement);
}

var upButton = document.getElementById("stepButtonUp");
upButton.addEventListener("click", function() { addProgramStep("Up"); });
var downButton = document.getElementById("stepButtonDown");
downButton.addEventListener("click", function() { addProgramStep("Down"); });
var leftButton = document.getElementById("stepButtonLeft");
leftButton.addEventListener("click", function() { addProgramStep("Left"); });
var rightButton = document.getElementById("stepButtonRight");
rightButton.addEventListener("click" , function() { addProgramStep("Right"); });

function startGame(){
	debugger;
	var shouldBreak = false;
	for(var i = 0; i < sampleGameModel.length; i++){
		for(var j = 0; j < sampleGameModel[i].length; j++){
			if(sampleGameModel[i][j] === 2){
				currPos.row = i;
				currPos.col = j;
				shouldBreak = true;
				break;
			}
		}
		playTurn();
		if(shouldBreak) {break;}
	}
}

function checkNextMove(nextMove) {
	var nextMoveStatus = "validMove";
	var nextMoveValue;
	if (program.length === programCounter) {
		nextMoveStatus = "noMoreProgramSteps";
	} else {
		switch(nextMove){
			case "Up":
				if ((currPos.row - 1) < 0) {
					nextMoveStatus = "outOfArray";
				} else {
					nextMoveValue = sampleGameModel[currPos.row - 1][currPos.col];
				}
				break;
			case "Down":
				if ((currPos.row + 1) >= sampleGameModel.length){
					nextMoveStatus = "outOfArray";
				} else {
					nextMoveValue = sampleGameModel[currPos.row + 1][currPos.col];
				}
				break;
			case "Left":
				if ((currPos.col - 1) < 0) {
					nextMoveStatus = "outOfArray";
				} else {
					nextMoveValue = sampleGameModel[currPos.row][currPos.col - 1];
				}
				break;
			case "Right":
				if ((currPos.col + 1) >= sampleGameModel[currPos.row].length) {
					nextMoveStatus = "outOfArray";
				} else {
					nextMoveValue = sampleGameModel[currPos.row][currPos.col + 1];
				}
				break;
		}

		if (nextMoveValue === 1) {
			nextMoveStatus = "wall";
		} else if (nextMoveValue === 3) {
			nextMoveStatus = "win";
		}
	}
	return nextMoveStatus;
}

function updatePosition() {//updates and increments program counter and calls rendergame
		sampleGameModel[currPos.row][currPos.col] = 0;
		switch(program[programCounter]){
			case "Up":
				currPos.row--;
				break;
			case "Down":
				currPos.row++;
				break;
			case "Left":
				currPos.col--;
				break;
			case "Right":
				currPos.col++;
				break;
		//if programCounter == program.length don't call again
		}
		if (sampleGameModel[currPos.row][currPos.col] === 1) {
			sampleGameModel[currPos.row][currPos.col] = 4;
		} else if (sampleGameModel[currPos.row][currPos.col] === 0) {
			sampleGameModel[currPos.row][currPos.col] = 2;
		}
		programCounter++;
	}

function playTurn(){
	if ((programCounter + 1) === program.length) {
		debugger;
	}
	console.log(programCounter);
	var nextMoveStatus = checkNextMove(program[programCounter]);
	if (nextMoveStatus === "validMove") {
		updatePosition();
		setTimeout(playTurn, 1000);
		renderGame();
	} else if (nextMoveStatus === "wall") {
		updatePosition();
		renderGame();
		alert("You crashed into a wall. :(");
	}
	else if (nextMoveStatus === "win") {
		updatePosition();
		renderGame();
		alert("Congratulations! You win. :) ");
	} else if (nextMoveStatus === "outOfArray") {
		alert("You stepped out of the map. Try again! ;)");
	} else if (nextMoveStatus === "noMoreProgramSteps") {
		alert("You have not entered enough steps to reach the final and win. Try again! ;)");
	}
}

var playButton = document.getElementById("playButton");
playButton.addEventListener("click", startGame);