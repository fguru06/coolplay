var myGamePiece;
var myObstacles = [];
var myImage = new Image();
var myGamePiece;
var myObstacles = [];
var myImage = new Image();
myImage.src = "images/Mario_Jump.png";
var myObstacleImage = new Image();
myObstacleImage.src = "images/Obstacle.png";
var coins = [];
var coinsImage = new Image();
coinsImage.src = "images/Coin.png";
var score = 0;
var gameOver = false;
var isLuigi = false;
var isPeach = false;

document.getElementById("mario-button").addEventListener("click", function () {
	startGame("images/Mario_Jump.png");
	isLuigi = false;
	isPeach = false;
});

document.getElementById("luigi-button").addEventListener("click", function () {
	startGame("images/Luigi_Jump.png");
	isLuigi = true;
	isPeach = false;
});

document.getElementById("peach-button").addEventListener("click", function () {
	startGame("images/Peach_Jump.png");
	isLuigi = false;
	isPeach = true;
});

function startGame(imageSrc) {
	document.getElementById("image-selection").style.display = "none";
	myGameArea.start();
	myImage.src = imageSrc;
	if (isPeach) {
		myGamePiece = new component(40, 100, myImage, 10, 720);
	} else {
		myGamePiece = new component(70, 100, myImage, 10, 720);
	}
	myObstacles.push(new component(10, 100, null, -100, 1, true));
	myObstacles.push(new component(10, 100, myObstacleImage, 100, 1));
	myObstacles.push(new component(10, 100, myObstacleImage, 300, 1));
	myObstacles.push(new component(10, 100, myObstacleImage, 500, 1));
	myObstacles.push(new component(10, 100, myObstacleImage, 700, 1));
	myObstacles.push(new component(10, 100, myObstacleImage, 900, 1));
	myObstacles.push(new component(10, 100, myObstacleImage, 1100, 1));
	myObstacles.push(new component(10, 100, myObstacleImage, 1300, 1));
	myObstacles.push(new component(10, 100, myObstacleImage, 1500, 1));
	myObstacles.push(new component(10, 100, myObstacleImage, 1700, 1));
	myObstacles.push(new component(10, 100, myObstacleImage, 1900, 1));
	myObstacles.push(new component(10, 100, myObstacleImage, 2100, 1));
	myObstacles.push(new component(10, 100, myObstacleImage, 2300, 1));
	score = 0;
	gameOver = false;

	setInterval(addCoins, 500);
}

function addCoins() {
	coins.push(
		new component(
			60,
			70,
			coinsImage,
			Math.random() * (myGameArea.canvas.width - 60),
			Math.random() * (myGameArea.canvas.height - 70)
		)
	);
}

function respawnCoin(x, y) {
	coins.push(new component(60, 70, coinsImage, x, y));
}
var myGameArea = {
	canvas: document.createElement("canvas"),
	start: function () {
		this.canvas.width = 1500;
		this.canvas.height = 825;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);
		window.addEventListener("keydown", function (e) {
			myGameArea.keys = myGameArea.keys || [];
			myGameArea.keys[e.keyCode] = e.type == "keydown";
		});
		window.addEventListener("keyup", function (e) {
			myGameArea.keys[e.keyCode] = e.type == "keydown";
		});
	},
	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop: function () {
		clearInterval(this.interval);
	},
};

function component(width, height, image, x, y, isFollower = false) {
	this.width = width;
	this.height = height;
	this.image = image;
	this.x = x;
	this.y = y;
	this.isFollower = isFollower;
	this.speedY = 1;
	this.speedX = 1;
	this.update = function () {
		ctx = myGameArea.context;
		if (this.isFollower) {
			ctx.fillStyle = "red";
			ctx.fillRect(this.x, this.y, this.width, this.height);
		} else {
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		}
	};
	this.newPos = function () {
		if (myGameArea.keys && myGameArea.keys[37]) {
			this.x -= 2;
		}
		if (myGameArea.keys && myGameArea.keys[39]) {
			this.x += 2; // Lower speed for right movement
		}
		if (myGameArea.keys && myGameArea.keys[38]) {
			this.y -= 2; // Lower speed for up movement
		}
		if (myGameArea.keys && myGameArea.keys[40]) {
			this.y += 2; // Lower speed for down movement
		}
	};
	this.crashWith = function (otherobj) {
		var myleft = this.x;
		var myright = this.x + this.width;
		var mytop = this.y;
		var mybottom = this.y + this.height;
		var otherleft = otherobj.x;
		var otherright = otherobj.x + otherobj.width;
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + otherobj.height;
		var crash = true;
		if (
			mybottom < othertop ||
			mytop > otherbottom ||
			myright < otherleft ||
			myleft > otherright
		) {
			crash = false;
		}
		return crash;
	};
	this.moveVertically = function () {
		this.y += this.speedY;
		if (
			this.y <= -100 ||
			this.y >= myGameArea.canvas.height - this.height + 100
		) {
			this.speedY = -this.speedY; // Reverse direction when hitting the extended top or bottom
		}
	};
	this.moveHorizontally = function () {
		this.x += this.speedX;
		if (
			this.x <= -100 ||
			this.x >= myGameArea.canvas.width - this.width + 100
		) {
			this.speedX = -this.speedX; // Reverse direction when hitting the extended left or right
		}
	};
	this.follow = function (target) {
		const speed = 1; // Lower the speed of the follower obstacle
		if (this.x < target.x) {
			this.x += speed;
		} else if (this.x > target.x) {
			this.x -= speed;
		}
		if (this.y < target.y) {
			this.y += speed;
		} else if (this.y > target.y) {
			this.y -= speed;
		}
	};
}

function updateGameArea() {
	if (gameOver) return; // Prevent further updates if the game is over
	myGameArea.clear();
	myGamePiece.newPos();
	myGamePiece.update();

	// Wrap around canvas borders
	if (myGamePiece.x < 0) {
		myGamePiece.x = myGameArea.canvas.width - myGamePiece.width;
	} else if (myGamePiece.x + myGamePiece.width > myGameArea.canvas.width) {
		myGamePiece.x = 0;
	}
	if (myGamePiece.y < 0) {
		myGamePiece.y = myGameArea.canvas.height - myGamePiece.height;
	} else if (myGamePiece.y + myGamePiece.height > myGameArea.canvas.height) {
		myGamePiece.y = 0;
	}

	for (var i = 0; i < myObstacles.length; i++) {
		if (myObstacles[i].isFollower) {
			myObstacles[i].follow(myGamePiece); // Make the follower obstacle follow myGamePiece
		} else {
			myObstacles[i].moveVertically(); // Move obstacles up and down
			myObstacles[i].moveHorizontally(); // Move obstacles sideways
		}
		if (myGamePiece.crashWith(myObstacles[i])) {
			if (score < 15) {
				// Check if score condition for congrats is not met
				myGameArea.stop();
				gameOver = true; // Set game over flag
				setTimeout(function () {
					var gameOverImage = new Image();
					gameOverImage.src = isPeach
						? "images/Game_Over_Peach.png"
						: isLuigi
						? "images/Game_Over_Luigi.png"
						: "images/Game_Over.png";
					gameOverImage.onload = function () {
						myGameArea.context.drawImage(
							gameOverImage,
							0,
							0,
							myGameArea.canvas.width,
							myGameArea.canvas.height
						);
						if (!document.getElementById("restart-button")) {
							new RestartButton(650, 400, 200, 50, "Restart Game"); // Show RestartButton on collision
						}
					};
				}, 100); // Delay to ensure the game loop has stopped
			}
			return;
		}
		myObstacles[i].update();
	}
	for (var i = 0; i < coins.length; i++) {
		if (myGamePiece.crashWith(coins[i])) {
			coins.splice(i, 1); // Remove the coin from the array
			i--; // Adjust the index after removal
			score++; // Increase the score
		} else {
			coins[i].update();
		}
	}
	updateScore(); // Update the score display
	// Check if score reaches __
	if (score >= 15) {
		Congrats();
	}
}

function updateScore() {
	myGameArea.context.font = "30px Arial";
	myGameArea.context.fillStyle = "black";
	myGameArea.context.fillText("Score: " + score, 20, 40);
}

class RestartButton {
	constructor(x, y, width, height, text) {
		this.width = width;
		this.height = height;
		this.text = text;
		this.element = document.createElement("button");
		this.element.id = "restart-button";
		this.element.style.width = this.width + "px";
		this.element.style.height = this.height + "px";
		this.element.innerHTML = this.text;
		document
			.getElementById("restart-button-container")
			.appendChild(this.element);
		this.element.addEventListener("click", () => {
			location.reload();
		});
	}
}

function Congrats() {
	gameOver = true; // Set game over flag
	myGameArea.stop();
	myGameArea.context.clearRect(
		0,
		0,
		myGameArea.canvas.width,
		myGameArea.canvas.height
	);

	myGameArea.canvas.style.backgroundImage = "url('images/Congrats.png')";
	if (!document.getElementById("restart-button")) {
		new RestartButton(0, 0, 200, 50, "Restart Game");
	}
}

function checkCollision() {
	if (myGamePiece.crashWith(myObstacles)) {
		myGameArea.stop();
	}
}
