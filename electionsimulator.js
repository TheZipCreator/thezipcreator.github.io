let numVoters = 1000;
let parties = [];
let voters = [];
let partyVotes = []; //Counts how many votes each party gets
let dispText = [];
let reactionary = false;

function setup() {
	let canvas = createCanvas(400, 800);
	canvas.parent("center");
	background(0);
	fill(255);
	simulateElection();
}

function draw() {
	background(0);
	for(let i = 0; i < dispText.length; i++) {
		text(dispText[i], 0, 16+(i*16));
	}
}

function keyPressed() {
	if(key == 'r') {
		simulateElection();
	}
}
//Functions

function simulateElection() {
	dispText = [];
	numVoters = 1000;
	parties = [];
	voters = [];
	partyVotes = []; //Counts how many votes each party gets
	textPos = 16;
	reactionary = false;
	parties.push(new Party("Labor", -1, -1));
	parties.push(new Party("Liberal", 1, 1));
	parties.push(new Party("Social", -2, -2));
	parties.push(new Party("Conservative", 2, 2));
	parties.push(new Party("Libertarian", 2, -2));
	parties.push(new Party("Green", -4, -4));
	parties.push(new Party("Reactionary", 4, 4));
	parties.push(new Party("Communist", -1, -3));
	//console.log(parties.length);
	for(let i = 0; i < parties.length; i++) {
		partyVotes[i] = 0;
	}
	if(random(1,20) < 1) {
		reactionary = true;
	}
	for(let i = 0; i < numVoters; i++) {
		if(i < numVoters*0.8) {
			let rand = map(randomGaussian(), -2.5, 2.5, -4, 4);
			voters[i] = new Voter(rand, rand+random(-1,1));
		} else {
			voters[i] = new Voter(random(-4, 4), random(-4,4));
		}
		if(voters[i].x >= 4) voters[i].x = 4;
		if(voters[i].x <= -4) voters[i].x = -4;
		if(voters[i].y >= 4) voters[i].y = 4;
		if(voters[i].y <= -4) voters[i].y = -4;
	}
	while(!majority(partyVotes)) {
		partyVotes = [];
		for(let i = 0; i < parties.length; i++) {
			partyVotes[i] = 0;
		}
		for(let i = 0; i < numVoters; i++) { //Calculate voters' votes
			if(reactionary) {
				voters[i].x++;
				voters[i].y++;
				if(voters[i].x >= 4) voters[i].x = 4;
				if(voters[i].x <= -4) voters[i].x = -4;
				if(voters[i].y >= 4) voters[i].y = 4;
				if(voters[i].y <= -4) voters[i].y = -4;
			}
			let bestParty = -1;
			let distance = 999;
			for(let j = 0; j < parties.length; j++) { //Calculate 
				let distToParty = dist(voters[i].x, voters[i].y, parties[j].x, parties[j].y);
				if(distToParty < distance) {
					bestParty = j;
					distance = distToParty;
				}
			}
			partyVotes[bestParty]++;
		}
		for(let i = 0; i < parties.length; i++) { //Print how many votes each party got
			printText(parties[i].name+" got "+((partyVotes[i]/numVoters)*100)+"% of the vote");
		}
		printText("---");
		if(parties.length > 1) {
			let smallest = findSmallest(partyVotes);
			parties.splice(smallest, 1);
		}
	}
	console.log("Finished Simulation!");
}

function majority(votes) { //Returns true if any value within votes is >= 50%
  for(let i = 0; i < votes.length; i++) {
    if(votes[i] >= numVoters/2) {
      return true;
    }
  }
  return false;
}

function findSmallest(votes) { //Returns the index of the smallest value in the array
  let currSmallest = 0;
  let smallestValue = votes[0];
  for(let i = 1; i < votes.length; i++) {
    if(votes[i] < smallestValue) {
      smallestValue = votes[i];
      currSmallest = i;
    }
  }
  return currSmallest;
}
function printText(text_) {
  dispText[dispText.length] = text_;
}

//Classes

class Party {
	constructor(n, x, y) {
		this.name = n;
		this.x = x;
		this.y = y;
	}
}

class Voter {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}