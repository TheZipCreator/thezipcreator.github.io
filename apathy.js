let voters;
let off;

function setup() {
	//Initialize the voter and offset arrays
	voters = new Array(100);
	off = new Array(voters.length);
	for(let i = 0; i < voters.length; i++) {
		voters[i] = floor(random(3));
		off[i] = i/4;
	}
	//Create the canvas
	createCanvas(200, 200);
	
}
function draw() {
	//Set the background
	background(255);
	//Draw all the voters
}
function voter(x, y, o, v) { //x,y is the position, o is the offset and v is the vote
	//Legs
	stroke(0);
	line(x+10, y, x, y);
	line(x, y, x, y-10);
	//Color
	switch(v) {
		case 0:
			fill(0, 0, 255);
			break;
		case 1:
			fill(255, 0, 0);
			break;
		case 2:
			fill(255, 255, 0);
			break;
	}
	//Head
	rect(x, y+(sin((frameCount/10)+o)*5), x+20, (y+(sin((frameCount/10)+o)*5))+20);
}