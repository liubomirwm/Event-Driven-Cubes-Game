//empty = 0; wall = 1; cube = 2; finish = 3;
var sampleGameModel = [
	[2, 0, 0, 1],
	[1, 1, 0, 0],
	[3, 0, 1, 0],
	[1, 0, 0, 0]
];
var container = document.getElementById('services');
function renderGame(gameModel){
	for(var i = 0; i < gameModel.length; i++){
		for(var j = 0; j < gameModel[i].length; j++){
			var newElement = document.createElement('div');
			var breakElement = document.createElement('br');
			newElement.classList.add('box');
			newElement.innerHTML = '&nbsp;';
			switch(gameModel[i][j]){
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
			}
			console.log(newElement);
			container.appendChild(newElement);
		}
		container.appendChild(breakElement);
	}
}
debugger;
renderGame(sampleGameModel);