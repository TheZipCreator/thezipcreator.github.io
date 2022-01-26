let numString = "";
let prevNum = 0;
let prevNum2;
let fc = 0; //frameCount modified
let op; //0=+, 1=-, 2=*, 3=/, 4=^
let opText = ["+","-","*","/","^"];
let validDigits = ["0","1","2","3","4","5","."]
let possibleDigits = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
let baseNames = ["nullary","unary","binary","trinary","quaternary","quinary","seximal","septimal","octal","nonary","decimal","elevenary","dozenal","baker's dozenal","biseptimal","triquinary","hex","suboptimal","triseximal","untriseximal","vigesimal","triseptimal","bielevenary","unbielevenary","tetraseximal","pentaquinary","biker's dozenal","trinonary","tetraseptimal","untetraseptimal","pentaseximal","unpentaseximal","tetroctal","trielevenary","bisuboptimal","pentaseptimal","niftimal"]; //misalian base naming system
let base = 6;
let changingBase = false;
let justCalced = false;
let ts = 75; //textSize

function setup() {
  let cnv = createCanvas(700, 300);
  cnv.parent("canvasContainer");
}
function draw() {
  background(255);
  textSize(ts);
  fc++;
  if(!changingBase) {
    textAlign(LEFT);
    if(!justCalced) {
      if(fc%60 > 30) text(numString, 0, 175);
      else text(numString+"_", 0, 175);
    } else {
      text(numString, 0, 175);
    }
    if(op != undefined) {
      textSize(50);
      if(prevNum2 != undefined) {
        text(prevNum+" "+opText[op]+" "+prevNum2+" = ", 9, 100);
      } else {
        text(prevNum+" "+opText[op], 9, 100);
      }
    }
  } else {
    textAlign(CENTER);
    textSize(32);
    let yoff = 32-(base*32)+((height/2)-(height/8));
    for(let i = 0; i < baseNames.length; i++) {
      if(i != base) text(baseNames[i], width/2, 32*(i+1)+yoff);
      else text("[-"+baseNames[i]+"-]", width/2, 32*(i+1)+yoff);
    }
  }
}
function keyPressed() {
  if(!changingBase) {
    if(keyCode == TAB) {
      changingBase = !changingBase;
      return;
    }
    if(validDigits.includes(key.toUpperCase())) { //check that key is a number
      if(justCalced) { 
        numString = ""; 
        justCalced = false;
        op = undefined;
        prevNum = undefined;
        prevNum2 = undefined;
      }
      numString += key.toUpperCase(); //add number
      fc = 0; //reset blinking cursor
      num = Number(numString);
    }
    if(keyCode == BACKSPACE) { //test if key is backspace
      if(!justCalced) {
        if(numString.length > 0)  { //if possible to delete character
          numString = numString.substr(0, numString.length-1); //delete a character at the end
          fc = 0; //reset blinking cursor
        } else {
			justCalced = false;
			numString = "";
			op = undefined;
			prevNum = undefined;
			prevNum2 = undefined;
		}
      } else {
        justCalced = false;
        numString = "";
        op = undefined;
        prevNum = undefined;
        prevNum2 = undefined;
      }
    }
    if(key == "+") {
      startOp(0);
    }
    if(key == "-") {
      if(numString.length > 0) startOp(1);
      else numString += "-";
    }
    if(key == "*") {
      startOp(2);
    }
    if(key == "/") {
      startOp(3);
    }
    if(keyCode == ENTER || key == '=') {
      prevNum2 = numString;
      let num1 = parseFloat(baseConvert(prevNum, base, 10));
      let num2 = parseFloat(baseConvert(numString, base, 10));
      let result;
      switch(op) {
        case 0:
          result = num1+num2;
          break;
        case 1:
          result = num1-num2;
          break;
        case 2:
          result = num1*num2;
          break;
        case 3:
          result = num1/num2;
          break;
        case 4:
          result = Math.pow(num1, num2);
          break;
      }
      numString = String(baseConvert(result, 10, base));
      //printc(result);
      justCalced = true;
    }
  } else {
    if(keyCode == TAB || keyCode == ENTER || key == 's') {
      changingBase = !changingBase;
      validDigits = [];
      stringNum = "";
      prevNum = "";
	  justCalced = false;
	  op = undefined;
      if(base > 1) {
        for(let i = 0; i < base; i++) {
          validDigits.push(possibleDigits[i]);
        }
      } else {
        if(base == 1) validDigits = ["1"];
      }
      validDigits.push(".");
      document.getElementById("page_title").innerHTML = capitalizeWord(baseNames[base])+" Calculator";
      document.getElementById("base").innerHTML = baseNames[base];
      return;
    }
    if(keyCode == UP_ARROW) {
      base--;
    }
    if(keyCode == DOWN_ARROW) {
      base++;
    }
    if(base > baseNames.length-1) base = baseNames.length-1;
    if(base < 0) base = 0;
  }
  ts = findTextSize(numString);
}

function startOp(operation) {
  if(numString == "") return;
  justCalced = false;
  op = operation;
  prevNum = numString;
  prevNum2 = undefined;
  fc = 0;
  numString = "";
}

let baseConvert = function(number, initialBase, finalBase) {
  let digitsTo={"0": 0,"1": 1,"2": 2,"3": 3,"4": 4,"5": 5,"6": 6,"7": 7,"8": 8,"9": 9,"A": 10,"B": 11,"C": 12,"D": 13,"E": 14,"F": 15,"G": 16,"H": 17,"I": 18,"J": 19,"K": 20,"L": 21,"M": 22,"N": 23,"O": 24,"P": 25,"Q": 26,"R": 27,"S": 28,"T": 29,"U": 30,"V": 31,"W": 32,"X": 33,"Y": 34,"Z": 35}
  let digitsFrom=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
  number = String(number);
  let negative = false;
  if(number.charAt(0) == "-") {
    negative = true;
    number = number.substring(1, number.length);
  }
  //first convert from initialBase to decimal
  let decimal = 0; //number in decimal
  let temp = number.split(".");
  let numBeforeDot = temp[0];
  if(initialBase != 1) {
	  for(let i = 0; i < numBeforeDot.length; i++) { //convert whole part to decimal
		let pow = Math.pow(initialBase, numBeforeDot.length-(i+1));
		decimal += pow*digitsTo[numBeforeDot.charAt(i)];
	  }
  } else { //unary needs it's own special thing
	  decimal = numBeforeDot.length;
	  //console.log(numBeforeDot.length);
  }
  let numAfterDot;
  if(temp.length > 1) {
    numAfterDot = temp[1];
    for(let i = 0; i < numAfterDot.length; i++) { //convert fractional part to decimal
      let pow = Math.pow(initialBase, -(i+1));
      decimal += pow*digitsTo[numAfterDot.charAt(i)];
    }
  }
  //then convert from decimal to finalBase
  numBeforeDot = "";
  numAfterDot = "";
  let a = Math.floor(decimal);
  if(finalBase != 1) {
	  while(a > 0) { //calculate whole part
		numBeforeDot = digitsFrom[a%finalBase]+numBeforeDot;
		a = Math.floor(a/finalBase);
	  }
  } else { //unary needs it's own special thing
	  for(let i = 0; i < a; i++) {
		  numBeforeDot += "1";
	  }
  }
  a = decimal-Math.floor(decimal);
  for(let i = 0; i < 20; i++) {
    a *= finalBase;
    let b = Math.floor(a);
    a -= b;
    numAfterDot += digitsFrom[b];
  }
  for(let i = numAfterDot.length-1; i >= 0; i--) { //remove trailing 0s
    if(numAfterDot.charAt(i) == "0") numAfterDot = numAfterDot.substring(0, numAfterDot.length-1);
    else break;
  }
  if(numBeforeDot.length == 0 && numAfterDot.length == 0 && finalBase > 1) numBeforeDot = "0";
  if(negative) numBeforeDot = "-"+numBeforeDot;
  if(numAfterDot.length > 0) return numBeforeDot+"."+numAfterDot;
  else return numBeforeDot;
}

function printc(message) {
  document.getElementById("center").append(String(message));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function capitalizeWord(word) {
  return word.charAt(0).toUpperCase()+word.substring(1, word.length);
}

document.onkeydown = function(evt){
	if(evt.keyCode == TAB || evt.keyCode == 191) {
		evt.preventDefault();
	}
}
function findTextSize(t) {
	let size = 75;
	textSize(size);
	while(textWidth(t) > width) {
		textSize(size);
		size--;
		if(size == 1) break;
	}
	return size;
}