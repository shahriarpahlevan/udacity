// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    
    // This resets enemies back to starting position, when off canvas!
    if (this.x >= 505) {
        this.x = 0;
    }
    this.collisionCheck();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Checks for collisions between the "enemy" and "player"
Enemy.prototype.collisionCheck = function() {
    if (player.y + 135 >= this.y + 90 &&
        player.y + 75 <= this.y + 135 &&
        player.x + 25 <= this.x + 90 &&
        player.x + 75 >= this.x + 10) {
        resetGame();
    }
};
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/char-horn-girl.png';
};

// Updates the method for Player
Player.prototype.update = function() {};

// Renders the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This handles the input for the player
Player.prototype.handleInput = function(key) {
    if (key == 'left') { // left key assignment
        this.x = (this.x - this.speed + 500) % 500;
    } else if (key == 'right') { // right key assignment
        this.x = (this.x + this.speed) % 500;
    } else if (key == 'up') { // up key assignment
        this.y = (this.y - this.speed + 600) % 600;
        // Into the water (incorporating approx player height)
        if (this.y <= (85 - 50)) {
            finished();
            return;
        }
    } else {
        // This covers the bottom limit!
        this.y = (this.y + this.speed) % 600; //down key assignment
        if (this.y > 400) {
            this.y = 400;
        }
    }
};

// Restarts the player into the original position
Player.prototype.restart = function() {
    this.x = 200;
    this.y = 380;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player(0, 0, 50);
var textScore = document.createElement('div');

// Restart the Game
resetGame();

var numScore = document.getElementsByTagName('canvas')[0];
document.body.insertBefore(textScore, numScore);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// When collision occurs, restart the game!
function resetGame() {
    player.restart();
    score = 0;
    dispUpdate();
    allEnemies = [];
    allEnemies.push(
        new Enemy(0, Math.random() * 150 + 50, Math.random() * 100 + 30), // math works
        new Enemy(0, Math.random() * 150 + 80, Math.random() * 100 + 70) // math works
    );
}

// When water is reached, Restart the game!
function finished() {
    player.restart();
    score += 1;
    dispUpdate();
    if (score % 2 == 0 && allEnemies.length < 5) {
        allEnemies.push(new Enemy(0, Math.random() * 150 + 50, Math.random() * 80 + 70)); // math works
    }
}

// Score is displayed and updated onto the screen!
function dispUpdate() {
    textScore.innerHTML = 'Points ' + score + '!'; // text on top of the page
    textScore.style.fontWeight = 'bold'; // bolding the text
    textScore.style.fontSize = '30px'; // changing size of text
    textScore.style.fontFamily = 'Arial, Helvetica, sans-serif'; // setting text font
}
