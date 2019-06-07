let voters;
let off;
let size = 20;
let canvas;

function setup() {
	//Initialize the voter and offset arrays
	voters = new Array(100);
	off = new Array(voters.length);
	for(let i = 0; i < voters.length; i++) {
		voters[i] = floor(random(3));
		off[i] = i/4;
	}
	//Create the canvas
	canvas = createCanvas(size*10, size*10);
	canvas.parent("container");
	
}
function draw() {
	//Set the background
	background(255);
	//Draw all the voters
	let x = 0;
	let y = 0;
	for(let i = 0; i < voters.length; i++) {
		x += size;
		if(x == width-size) {
			x = 0;
			y += size;
		}
		voter(x, y, off[i], voters[i]);
	}
}
function voter(x, y, o, v) { //x,y is the position, o is the offset and v is the vote
	//Legs
	stroke(0);
	line(x+(size/2), y, x, y);
	line(x, y, x, y-(size/2));
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
	rect(x, y+(sin((frameCount/10)+o)*(size/4)), x+size, (y+(sin((frameCount/10)+o)*(size/4)))+size);
}