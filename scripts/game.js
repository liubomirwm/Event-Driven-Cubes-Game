//empty = 0; wall = 1; cube = 2; finish = 3; 4 = fail
const empty = "empty";
const wall = "wall";
const cube = "cube";
const finish = "finish";
const fail = "fail";

var sampleGameModel = [
	[cube, empty, empty, wall],
	[wall, wall, empty, empty],
	[finish, empty, wall, empty],
	[wall, empty, empty, empty]
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
				case empty:
					newElement.style.backgroundColor = '#ffffff';
					break;
				case wall:
					newElement.style.backgroundColor = '#000000';
					break;
				case cube:
					newElement.style.backgroundColor = '#ffff00';
					break;
				case finish:
					newElement.style.backgroundColor = '#33cc00';
					break;
				case fail:
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
	var shouldBreak = false;
	for(var i = 0; i < sampleGameModel.length; i++){
		for(var j = 0; j < sampleGameModel[i].length; j++){
			if(sampleGameModel[i][j] === cube){
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

		if (nextMoveValue === wall) {
			nextMoveStatus = "wall";
		} else if (nextMoveValue === finish) {
			nextMoveStatus = "win";
		}
	}
	return nextMoveStatus;
}

function updatePosition() {//updates and increments program counter and calls rendergame
		sampleGameModel[currPos.row][currPos.col] = empty;
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
		if (sampleGameModel[currPos.row][currPos.col] === wall) {
			sampleGameModel[currPos.row][currPos.col] = fail;
		} else if (sampleGameModel[currPos.row][currPos.col] === empty) {
			sampleGameModel[currPos.row][currPos.col] = cube;
		}
		programCounter++;
	}

function playTurn(){
	var nextMoveStatus = checkNextMove(program[programCounter]);
	if (nextMoveStatus === "validMove") {
		updatePosition();
		setTimeout(playTurn, 1000);
		renderGame();
		var event = new CustomEvent("validMove", {detail: programCounter});
		document.dispatchEvent(event);
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

function checkPressedKey(event){
	switch(event.code){
		case "ArrowDown":
			addProgramStep("Down");
			event.preventDefault();
			break;
		case "ArrowUp":
			addProgramStep("Up");
			event.preventDefault();
			break;
		case "ArrowLeft":
			addProgramStep("Left");
			event.preventDefault();
			break;
		case "ArrowRight":
			addProgramStep("Right");
			event.preventDefault();
			break;
		case "Enter":
			startGame();
			event.preventDefault();
	}
}

var playButton = document.getElementById("playButton");
playButton.addEventListener("click", startGame);
document.addEventListener("validMove", updateScore);
document.addEventListener("keydown", checkPressedKey);

function updateScore(event)
{
	var points = event.detail;
	var pointsSection = document.getElementById("points");
	pointsSection.innerHTML = points;
	if (points === 5){
		pointsSection.style.color = "#52cc00";
	}
	if (points === 10){
		document.removeEventListener("validMove", updateScore);
	}
}