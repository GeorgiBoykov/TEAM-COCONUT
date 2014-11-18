// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 679;
canvas.height = 480;
canvas.style.border = "2px solid black";
var textColor = "#000033";
document.body.appendChild(canvas);

canvas.style.margin = "7% 0 0 4%";

var remainingTime = 30;
var rakiyaTimeOut;

// Background image
var bgReady = false;
var bgImage = new Image();
var gameOverImg = new Image();
gameOverImg.src = "images/gameover.jpg";

bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/Wood-Background.jpg";

//drunk-meter
var drunkReady = false;
var drunkImage = new Image();
drunkImage.src = "images/drunk-o-meter.png";

drunkImage.onload = function(){
	drunkReady = true;
}

// nakov image
var nakovReady = false;
var nakovImage = new Image();

nakovImage.onload = function () {
	nakovReady = true;
};
nakovImage.src = "images/nakov4.png";

// beer image
var beerReady = false;
var beerImage = new Image();
beerImage.onload = function () {
	beerReady = true;
};
beerImage.src = "images/beer.png";

//rakiya image
var rakiyaReady = false;
var throwRakiya = false;
var rakiyaImage = new Image();
rakiyaImage.onload = function () {
	rakiyaReady = true;
};
rakiyaImage.src = "images/rakiya.png";

// Game objects
var nakov = {
	speed: 256 // movement in pixels per second
};

var rakiya = {};
var beer = {};
var beersDrunk = 0;
var beersToRakia = 4;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a beer
var reset = function () {
	nakov.x = canvas.width / 2;
	nakov.y = canvas.height / 2;

	// Throw the beer somewhere on the screen randomly
	beer.x = 32 + (Math.random() * (canvas.width - 80));
	beer.y = 32 + (Math.random() * (canvas.height - 80));

	// Throw rakiya somewhere on the screen randomly
	rakiya.x = 32 + (Math.random() * (canvas.width - 90));
	rakiya.y = 32 + (Math.random() * (canvas.height - 90));
};

var resetBeerPosition = function () {
	// Throw the beer somewhere on the screen randomly
	beer.x = 32 + (Math.random() * (canvas.width - 80));
	beer.y = 32 + (Math.random() * (canvas.height - 80));

	if (beersToRakia == 0){
		rakiyaTimeOut = 3;
		resetRakiyaPosition();
	}
	if (beersToRakia < 0){
		beersToRakia = 4;
	}

};

var resetRakiyaPosition = function () {
	rakiya.x = 32 + (Math.random() * (canvas.width - 90));
	rakiya.y = 32 + (Math.random() * (canvas.height - 90));
}


// Update game objects
var update = function (modifier) {
	if (beersDrunk < 30) {							// Reverse controls after 30 beers drunk

		if (38 in keysDown) { // Player holding up
			if (nakov.y > 0) {
				nakov.y -= nakov.speed * modifier;
			}
		}
		if (40 in keysDown) { // Player holding down
			if (nakov.y < canvas.height - 77) {
				nakov.y += nakov.speed * modifier;
			}
		}
		if (37 in keysDown) { // Player holding left
			if (nakov.x > 0) {
				nakov.x -= nakov.speed * modifier;
			}
		}
		if (39 in keysDown) { // Player holding right
			if (nakov.x < canvas.width - 50) {
				nakov.x += nakov.speed * modifier;
			}
		}
	}
	else{
		if (38 in keysDown) { // Player holding up
			if (nakov.y > 0){
				nakov.y -= nakov.speed * modifier;
			}
		}
		if (40 in keysDown) { // Player holding down
			if (nakov.y < canvas.height - 77){
				nakov.y += nakov.speed * modifier;
			}
		}
		if (39 in keysDown) { // Player holding left
			if (nakov.x > 0){
				nakov.x -= nakov.speed * modifier;
			}
		}
		if (37 in keysDown) { // Player holding right
			if (nakov.x < canvas.width - 50){
				nakov.x += nakov.speed * modifier;
			}
		}
	}

	// Throw new rakiya

	if (beersToRakia == 0){
		throwRakiya = true;
	}

	// Are they touching?
	if (
		nakov.x <= (beer.x + 52)
		&& beer.x <= (nakov.x + 46)
		&& nakov.y <= (beer.y + 58)
		&& beer.y <= (nakov.y + 65)
	) {
		++beersDrunk;
		beersToRakia--;
		nakov.speed -= 10;
		resetBeerPosition();
	}  if (
		nakov.x <= (rakiya.x + 10)
		&& rakiya.x <= (nakov.x + 46)
		&& nakov.y <= (rakiya.y + 58)
		&& rakiya.y <= (nakov.y + 65)
		&& throwRakiya == true
		&& rakiyaTimeOut > 0
	) {
		beersToRakia = 4;
		nakov.speed = 256;
		throwRakiya = false;
		remainingTime += 5;
		textColor = "red";
		resetRakiyaPosition();
	}


};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (nakovReady) {
		ctx.drawImage(nakovImage, nakov.x, nakov.y);
	}

	if (beerReady) {
		ctx.drawImage(beerImage, beer.x, beer.y);
	}

	if (throwRakiya && rakiyaReady && rakiyaTimeOut > 0){
		ctx.drawImage(rakiyaImage, rakiya.x, rakiya.y);
	}

	if (drunkReady){
	    ctx.drawImage(drunkImage, 10, 390);
	}

	ctx.beginPath();
	ctx.strokeStyle = "#006bb2";
	ctx.lineWidth = 4;
	ctx.moveTo(35, 445);
	ctx.lineTo(70, 445);
	ctx.stroke();
	ctx.fill();

	ctx.fillStyle = textColor;		//"#000033";
	ctx.font = "bold 30px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Beers drunk: " + beersDrunk , 12, 12);
	//ctx.fillText("Beers to rakiq: " + beersToRakia , 12, 32);
	//ctx.fillText("Rakia timeout " + rakiyaTimeOut , 12, 70);
	ctx.fillText("Time Left: " + remainingTime, 460,12);

	// Death Check
	if (remainingTime == 0){
		ctx.drawImage(gameOverImg, 0, 0);
		cancelRequestAnimationFrame(1);
	}
};

function countDown() {
	if (remainingTime > 0) {
		remainingTime--;
		rakiyaTimeOut--;
		textColor = "#000033";
	}
}
setInterval(countDown,1000);

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	//Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
