// set grid rows and columns, the size of each square and hit counters
let rows = cols = 10;
let squareSize = 50;
let hitCount = 1;
let hitCountBattleship = 0;

// get the container element
let gameBoardContainer = document.getElementById("gameboard");

// make the grid columns and rows
for (i = 0; i < cols; i++) {
	for (j = 0; j < rows; j++) {

		// create a new div HTML element for each grid square and make it the right size
		let square = document.createElement("div");
		gameBoardContainer.appendChild(square);

    	// give each div element a unique id based on its row and column, like "s00"
		square.id = 's' + j + i;

		// set each grid square's coordinates: multiples of the current row or column number
		let topPosition = j * squareSize;
		let leftPosition = i * squareSize;

		// use CSS absolute positioning to place each grid square on the page
		square.style.top = topPosition + 'px';
		square.style.left = leftPosition + 'px';
	}
}

/* create the 2d array that will contain the status of each square on the board
   and place ships on the board
   0 = empty, 1 = part of a ship, 2 = a sunken part of a ship, 3 = a missed shot
*/
let gameBoard = [
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0]
				];

//Call the function which generate battleships and enjoy
generateBattleships();

//Get the Cheet button and attach event listener
let showButton = document.getElementById('button');
showButton.addEventListener("click", showHide, false);


function showHide(e) {
			//start iterating the grid
			for (i = 0; i < cols; i++) {
				for (j = 0; j < rows; j++) {
					//if you find a ship, change it's color to red
					if (gameBoard[i][j] == 1 && document.getElementById('s' + i + j).style.background != 'red' ){
						//if you click on the grid, you can not cheat!
						if (hitCount > 1 ) {
							alert("Please don't shoot on battleships if you cheat...");
							return;
						}
							document.getElementById('s' + i + j).style.background = 'red';
					}
					//change back color if grid is NOT clicked
					else {
						//after defeating all battleships, there is no need to cheat, you WON
						if(hitCountBattleship == 13){
							alert("Please stop cheating you already won...");
							return;
						}
						//hide battleships if not clicked in cheat mode
						if (document.getElementById('s' + i + j).style.background == 'red') {
							document.getElementById('s' + i + j).style.background = '#f6f8f9';
						}
						//leave battleships(parts) which are clicked on cheat mode
						if (gameBoard[i][j] == 2){
							document.getElementById('s' + i + j).style.background = 'red';
						}
					}
				}
			}
}



// set event listener for all elements in gameboard, run fireTorpedo function when square is clicked
gameBoardContainer.addEventListener("click", fireTorpedo, false);

function fireTorpedo(e) {
  //Make sure that the event handler doesn't react to events fired from the parent element that we don't care about
	if (e.target !== e.currentTarget) {
    // extract row and column # from the HTML element's id
		let row = e.target.id.substring(1,2);
		let col = e.target.id.substring(2,3);

		// if player clicks a square with no ship, change the color and change square's value
		if (gameBoard[row][col] == 0) {
			e.target.style.background = '#bbb';
			// set this square's value to 3 to indicate that they fired and missed
			gameBoard[row][col] = 3;

		// if player clicks a square with a ship, change the color and change square's value
		} else if (gameBoard[row][col] == 1) {
			e.target.style.background = 'red';
			// set this square's value to 2 to indicate the ship has been hit
			gameBoard[row][col] = 2;

			// increment hitCount each time a ship is hit
			hitCountBattleship++;

			// this definitely shouldn't be hard-coded, but here it is anyway
			if (hitCountBattleship == 13) {
				alert("All enemy battleships have been defeated! You win!");
			}

		// if player clicks a square that's been previously hit, let them know
		} else if (gameBoard[row][col] > 1) {
			alert("Stop wasting your torpedos! You already fired at this location.");
		}
		//follow hit counts
		let hits = document.getElementById("hits");
		hits.innerHTML = hitCount++ + ' shots';
    }
    e.stopPropagation();
}

//Some crazy function for generating random battleships
function generateBattleships(){
		//create iniial coordinates and dirrections of battleships
		let battleshipRow = battleshipCol = Math.floor(Math.random() * 5) + 1;
		let destroyerRow = destroyerCol = Math.floor(Math.random() * 6) + 1;
		let secondDestroyerRow = secondDestroyerCol = Math.floor(Math.random() * 6) + 1;
		let direction = Math.random();
		let direction2 = Math.random();
		let direction3 = Math.random();

		//expand the battleship
		if(direction < 0.5){
			for(i = 0; i < 5; i++){
				gameBoard[battleshipRow][battleshipCol + i] = 1;
			}
		}
		else {
			for(i = 0; i < 5; i++){
				gameBoard[battleshipRow + i][battleshipCol] = 1;
			}
		}

		//expand first destroyer
		if(direction2 < 0.5){
			//check if destroyer overlaps battleship and generate new initial coordinates
				for(let i = 0; i < 4; i++){
					if(gameBoard[destroyerRow][destroyerCol + i] == 1 ){
						destroyerRow = Math.floor(Math.random() * 6) + 1;
						destroyerCol = Math.floor(Math.random() * 6) + 1;
						if(i == 0){
							i = -1;
						}
						else {
							i = 0;
						}
					}
				}
				//if destroyer don't overlaps battleship, than expand destroyer
				for(let j = 0; j < 4; j++){
					gameBoard[destroyerRow][destroyerCol + j] = 1;
				}

			}
			//same thing, different direction
			else{
				for(let i = 0; i < 4; i++){
					if(gameBoard[destroyerRow + i][destroyerCol] == 1){
						destroyerRow = Math.floor(Math.random() * 6) + 1;
						destroyerCol = Math.floor(Math.random() * 6) + 1;
						if(i == 0){
							i = -1;
						}
						else {
							i = 0;
						}
					}
				}
				for(let j = 0; j < 4; j++){
					gameBoard[destroyerRow + j][destroyerCol] = 1;
				}
		}

		//expand second destroyer
		if(direction3 < 0.5){
			//check if second destroyer overlaps any of others, generate new initial coordinates
				for(let i = 0; i < 4; i++){
					if(gameBoard[secondDestroyerRow][secondDestroyerCol + i] == 1){
								secondDestroyerRow = Math.floor(Math.random() * 6) + 1;
								secondDestroyerCol = Math.floor(Math.random() * 6) + 1;
								if(i == 0){
									i = -1;
								}
								else {
									i = 0;
								}
							}
				}
				//if the don't overlaps expand freely
				for(let j = 0; j < 4; j++){
					gameBoard[secondDestroyerRow][secondDestroyerCol + j] = 1;
					}
			}
			//same thing, different direction
			else{
				for(let i = 0; i < 4; i++){
					if(gameBoard[secondDestroyerRow + i][secondDestroyerCol] == 1){
							secondDestroyerRow = Math.floor(Math.random() * 6) + 1;
							secondDestroyerCol = Math.floor(Math.random() * 6) + 1;
							if(i == 0){
								i = -1;
							}
							else {
								i = 0;
							}
						}
				}
				for(let j = 0; j < 4; j++){
					gameBoard[secondDestroyerRow + j][secondDestroyerCol] = 1;
				}
		}
}
