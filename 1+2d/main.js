class Shape {
	constructor(col, points) {
		this.col = col;
		this.points = points;
	}
	
	draw(matrix) {
		stroke(this.col);
		fill(this.col);
		beginShape(TRIANGLE_STRIP);
		for(let point of this.points) {
			let pos = point;
			pos = mult2(matrix, [pos[0]-x, pos[1]-y]);
			vertex(pos[0]+width/2, pos[1]+height/2);
		}
		endShape(CLOSE);
	}
}

/*

Matrix:

[ 0 1
  2 3 ]

*/

function mult2(mat, vec) {
	const i = [mat[0]*vec[0], mat[2]*vec[0]];
	const j = [mat[1]*vec[1], mat[3]*vec[1]];
	return [i[0]+j[0], i[1]+j[1]];
}

// js modulo is broken
function mod(n, m) {
  return ((n % m) + m) % m;
}

function tsin(x) {
	return abs(mod(x-1, 4)-2)-1;
}

function tcos(x) {
	return tsin(x+1);
}

function vlength(vec) {
	return sqrt(vec[0]**2+vec[1]**2);
}

function vnormalize(vec) {
	const l = vlength(vec);
	return [vec[0]/l, vec[1]/l];
}

function vnormal(vec) {
	return mult2([0, -1, 1, 0], vec);
}

const TPI = 4;

class Point {
	constructor(col, pos) {
		this.col = col;
		this.pos = pos;
	}
}

let shapes = [];

function setup() {
	const cnv = createCanvas(1200, 600);
	cnv.parent("container");
	let size = 50;
	let square = [
		[-size, -size], [-size, size], [size, -size], [size, size]
	];
	shapes.push(new Shape(color(255, 0, 0), square));
	shapes.push(new Shape(color(255, 0, 0), square.map(arr => [arr[0]+800, arr[1]])));
	{
		const rot = PI/2;
		const s = sf(rot), c = cf(rot);
		const matrix = [
			c, s,
			s, c
		];
		shapes.push(new Shape(color(255, 0, 0), square.map(arr => mult2(matrix, arr)).map(arr => [arr[0]+400, arr[1]])));
	}
	{
		let size = 200;
		let points = [];
		for(let i = 0; i < 40; i++) {
			points.push([Math.sinh(TAU*i/100)*size, Math.cosh(TAU*i/100)*size]);
			points.push([Math.sinh(TAU*-i/100)*size, Math.cosh(TAU*-i/100)*size]);
		}
		shapes.push(new Shape(color(255, 0, 255), points));
		shapes.push(new Shape(color(255, 0, 255), points.map(p => [p[0], -p[1]])));
		shapes.push(new Shape(color(0, 0, 255), points.map(p => [p[0]+800, p[1]])));
		shapes.push(new Shape(color(0, 0, 255), points.map(p => [p[0]+800, -p[1]])));
	}
	/*
	for(let i = 0; i < 20; i++) {
		points.push(new Point(color(0, 0, 255), [i*10+200, i*10+100]));
		points.push(new Point(color(0, 255, 0), [i*10+200, 300]));
		points.push(new Point(color(255, 0, 0), [200, i*10+100]));
	}
	*/
}

let rot = 0, vrot = 0;
let x = 1, y = 1, vx = 0, vy = 0;

//const sf = tsin, cf = tcos;
//const sf = Math.sin, cf = Math.cos;
const sf = Math.sinh, cf = Math.cosh;

const PLAYER_SIZE = 10;

function draw() {
	background(0);
	// let sf = sin, cf = cos;
	const s = sf(rot), c = cf(rot);
	const matrix = [
		c, s,
		s, c
	];
	for(let shape of shapes)
		shape.draw(matrix);
	const s2 = sf(-rot), c2 = cf(-rot);
	const matrix2 = [
		c2, s2,
		s2, c2
	];
	rot += vrot;
	const vel = mult2(matrix2, [vx, vy]);
	x += vel[0];
	y += vel[1];
	fill(128);
	noStroke();
	rect(width/2-PLAYER_SIZE/2, height/2-PLAYER_SIZE/2, PLAYER_SIZE, PLAYER_SIZE);
}

const SPEED = 5;
const ROT_SPEED = TPI/128;

function keyPressed() {
	switch(key) {
		case 'w':
			vy = -SPEED;
			break;
		case 'a':
			vx = -SPEED;
			break;
		case 'A':
			vrot = ROT_SPEED/3;
			break;
		case 's':
			vy = SPEED;
			break;
		case 'd':
			vx = SPEED;
			break;
		case 'q':
			vrot = ROT_SPEED;
			break
		case 'e':
			vrot = -ROT_SPEED;
			break;
	}
}

function keyReleased() {
	switch(key) {
		case 'w':
		case 's':
			vy = 0;
			break;
		case 'a':
		case 'd':
		case 'A':
		case 'D':
			vx = 0;
			break;
		case 'q':
		case 'e':
			vrot = 0;
			break;
	}
}
