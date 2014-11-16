// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 679;
canvas.height = 480;
canvas.style.border = "2px solid black";
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/Wood-Background.jpg";

// nakov image
var nakovReady = false;
var nakovImage = new Image();
nakovImage.onload = function () {
	nakovReady = true;
};
nakovImage.src = "images/nakov.png";

// beer image
var beerReady = false;
var beerImage = new Image();
beerImage.onload = function () {
	beerReady = true;
};
beerImage.src = "images/beer.png";

// Game objects
var nakov = {
	speed: 256 // movement in pixels per second
};
var beer = {};
var beersCaught = 0;

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
};

var resetBeerPosition = function () {
	// Throw the beer somewhere on the screen randomly
	beer.x = 32 + (Math.random() * (canvas.width - 80));
	beer.y = 32 + (Math.random() * (canvas.height - 80));
};



// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		nakov.y -= nakov.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		nakov.y += nakov.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		nakov.x -= nakov.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		nakov.x += nakov.speed * modifier;
	}

	// Are they touching?
	if (
		nakov.x <= (beer.x + 52)
		&& beer.x <= (nakov.x + 46)
		&& nakov.y <= (beer.y + 58)
		&& beer.y <= (nakov.y + 65)
	) {
		++beersCaught;
		resetBeerPosition();
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

	// Score
	ctx.fillStyle = "black";
	ctx.font = "bold 30px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Beers drunk: " + beersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
