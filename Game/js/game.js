// Create the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 679;
canvas.height = 480;
canvas.style.border = "2px solid black";
var textColor = "#000033";
var plus5 = false;

var remainingTime = 30;
var rakiyaTimeOut;

var isAlive = true;
var running = true;
var btnPause = document.getElementById("btnPause");
var btnRestart = document.getElementById("btnRestart");

var bgMusic = document.getElementById("backgroundMusic");
var burpEasy = document.getElementById("burpEasy");
var burpHard = document.getElementById("burpHard");
var soundPic = document.getElementById("sound");
var btnMusic = document.getElementById("btnMusic");
var music = true;
var getBeer = document.getElementById("getBeer");       //collect Beer sound
var getRakiya = document.getElementById("getRakiya");   //collect Rakiya sound
var gameoverSound = document.getElementById("gameover");   //Gameover sound

var storage;
var currentBest;


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

drunkImage.onload = function () {
    drunkReady = true;
};

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

// pause image
var pauseReady = false;
var pauseImage = new Image();
pauseImage.onload = function () {
    pauseReady = true;
};
pauseImage.src = "images/pause.png";

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

    if (beersToRakia == 0) {
        rakiyaTimeOut = 3;
        resetRakiyaPosition();
    }
    if (beersToRakia < 0) {
        beersToRakia = 4;
    }

};

var resetRakiyaPosition = function () {
    rakiya.x = 32 + (Math.random() * (canvas.width - 90));
    rakiya.y = 32 + (Math.random() * (canvas.height - 90));
};


// Update game objects
var update = function (modifier) {

    if (running) {

        if (beersDrunk < 20) {							// Reverse controls after 30 beers drunk
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
        else if (beersDrunk >= 20 && beersDrunk < 30) {
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
            if (39 in keysDown) { // Player holding left
                if (nakov.x > 0) {
                    nakov.x -= nakov.speed * modifier;
                }
            }
            if (37 in keysDown) { // Player holding right
                if (nakov.x < canvas.width - 50) {
                    nakov.x += nakov.speed * modifier;
                }
            }
        } else {
            if (40 in keysDown) { // Player holding up
                if (nakov.y > 0) {
                    nakov.y -= nakov.speed * modifier;
                }
            }
            if (38 in keysDown) { // Player holding down
                if (nakov.y < canvas.height - 77) {
                    nakov.y += nakov.speed * modifier;
                }
            }
            if (39 in keysDown) { // Player holding left
                if (nakov.x > 0) {
                    nakov.x -= nakov.speed * modifier;
                }
            }
            if (37 in keysDown) { // Player holding right
                if (nakov.x < canvas.width - 50) {
                    nakov.x += nakov.speed * modifier;
                }
            }
        }

        // Throw new rakiya

        if (beersToRakia == 0) {
            throwRakiya = true;
        }

        // Are they touching?
        if (
            nakov.x <= (beer.x + 52)
            && beer.x <= (nakov.x + 46)
            && nakov.y <= (beer.y + 58)
            && beer.y <= (nakov.y + 65)
        ) {
            if (music) {
                var collectBeer = getBeer.cloneNode();
                collectBeer.play();
            }
            ++beersDrunk;
            beersToRakia--;
            nakov.speed -= 10;
            resetBeerPosition();

            if (beersDrunk == 20) {      // play burp
                if (music) {
                    burpEasy.play();
                }

            }
            if (beersDrunk == 30) {
                if (music) {
                    burpHard.play();
                }
            }
        }
        if (
            nakov.x <= (rakiya.x + 10)
            && rakiya.x <= (nakov.x + 46)
            && nakov.y <= (rakiya.y + 58)
            && rakiya.y <= (nakov.y + 65)
            && throwRakiya == true
            && rakiyaTimeOut > 0
        ) {
            if (music) {
                var collectRakiya = getRakiya.cloneNode();
            collectRakiya.play();
        }
            beersToRakia = 4;
            nakov.speed = 256;
            throwRakiya = false;
            remainingTime += 5;
            textColor = '#f30000';
            plus5 = true;
            resetRakiyaPosition();
        }
    }
};

//draw arrow
var arrow = function () {
    ctx.beginPath();
    ctx.strokeStyle = "#006bb2";
    ctx.lineWidth = 4;

    if (beersDrunk < 3) {
        ctx.moveTo(35, 445);
    } else if (beersDrunk >= 3 && beersDrunk < 6) {
        ctx.moveTo(37, 435);
    } else if (beersDrunk >= 6 && beersDrunk < 8) {
        ctx.moveTo(43, 427);
    } else if (beersDrunk >= 8 && beersDrunk < 10) {
        ctx.moveTo(48, 420);
    } else if (beersDrunk >= 10 && beersDrunk < 12) {
        ctx.moveTo(53, 417);
    } else if (beersDrunk >= 12 && beersDrunk < 14) {
        ctx.moveTo(63, 414);
    } else if (beersDrunk >= 14 && beersDrunk < 17) {
        ctx.moveTo(69, 411);
    } else if (beersDrunk >= 17 && beersDrunk < 20) {
        ctx.moveTo(77, 414);
    } else if (beersDrunk >= 20 && beersDrunk < 23) {
        ctx.moveTo(87, 417);
    } else if (beersDrunk >= 23 && beersDrunk < 25) {
        ctx.moveTo(94, 421);
    } else if (beersDrunk >= 25 && beersDrunk < 28) {
        ctx.moveTo(99, 427);
    } else if (beersDrunk >= 28 && beersDrunk < 30) {
        ctx.moveTo(105, 435);
    } else {
        ctx.moveTo(107, 445);
    }

    ctx.lineTo(70, 445);
    ctx.stroke();
    ctx.fill();
};

// Draw everything
var render = function () {

    if (isAlive) {      //if nakov is alive

        if (running) {      // if pause is not clicked

            if (bgReady) {
                ctx.drawImage(bgImage, 0, 0);
            }

            if (nakovReady) {
                ctx.drawImage(nakovImage, nakov.x, nakov.y);
            }

            if (beerReady) {
                ctx.drawImage(beerImage, beer.x, beer.y);

            }

            if (throwRakiya && rakiyaReady && rakiyaTimeOut > 0) {
                ctx.drawImage(rakiyaImage, rakiya.x, rakiya.y);
            }

            if (drunkReady) {
                ctx.globalAlpha = 0.6;
                ctx.drawImage(drunkImage, 10, 390);
                ctx.globalAlpha = 1;
            }


            arrow();

            ctx.fillStyle = textColor;		//"#000033";
            ctx.font = "bold 30px Helvetica";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText("Beers drunk: " + beersDrunk, 12, 12);
            //ctx.fillText("Beers to rakiq: " + beersToRakia , 12, 32);
            //ctx.fillText("Rakia timeout " + rakiyaTimeOut , 12, 70);
            ctx.fillText("Time Left: " + remainingTime, 460, 12);

            if (plus5 == true) {
                ctx.fillText("+ 5 sec", 460, 45);

            }
        }

        else {
            if (pauseReady) {                           // if pause is clicked
                ctx.drawImage(pauseImage, 290, 180);
            }
        }


        // Death Check
        if (remainingTime == 0) {
            if (music) {
                gameoverSound.play();
            }
            ctx.drawImage(gameOverImg, 0, 0);
            ctx.fillStyle = '#f30000';
            ctx.fillText("TOTAL BEERS DRUNK: " + beersDrunk, 155, 420);

            isAlive = false;

            highScore();

        }

        playMusic();
    }
};

function countDown() {
    if (running) {
        if (remainingTime > 0) {
            remainingTime--;
            rakiyaTimeOut--;
            textColor = "#000033";
            plus5 = false;
        }
    }
}
setInterval(countDown, 1000);

//High Score
var highScore = function () {
    var playerName;
    var result = {};

    if (localStorage.length == 0) {
        playerName = prompt("Enter your playerName: ");
        result = {name: playerName, score: beersDrunk};
        localStorage.setItem('result', JSON.stringify(result));
    } else {
        storage = JSON.parse(localStorage.getItem('result'));
        currentBest = storage.score;

        if (currentBest < beersDrunk) {
            playerName = prompt("Enter your playerName: ");
            result = {name: playerName, score: beersDrunk};
            localStorage.setItem('result', JSON.stringify(result));
        }
    }
};


//Pause
btnPause.addEventListener("click", function () {
    if (running) {
        running = false;
    } else {
        running = true;
    }
});

//Restart
btnRestart.addEventListener("click", function () {
    remainingTime = 30;
    beersDrunk = 0;
    running = true;
    isAlive = true;
    nakov.speed = 256;
    beersToRakia = 4;
    bgMusic.pause();
    bgMusic.currentTime = 0;
    reset();
});

//music
function playMusic() {
    if (music && running && isAlive) {
        //bgMusic.play();
    } else {
        bgMusic.pause();
    }
}

//sound image
btnMusic.addEventListener("click", function () {
    if (music) {
        soundPic.src = "images/mute.png";
        music = false;
    } else {
        soundPic.src = "images/music-n.png";
        music = true;
    }
});

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

// Play the game
var then = Date.now();
reset();
main();
