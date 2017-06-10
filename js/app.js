//Object used to define constant values used among the project
var constants = {
    "PLAYER_START_X": 202,
    "PLAYER_START_Y": 5*83-35,
};

//Object used to define random values used among the project
var randoms = {
    "ENEMY_START_X": function(){ return -Math.random()*404-101; },
    "ENEMY_START_Y": function(){ return Math.ceil(Math.random()*3)*83-35; },
    "ENEMY_SPEED": function(){ return 100+Math.random()*500 }
};

//Function used to define inheritance between classes
Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
    if ( parentClassOrObject.constructor == Function ) 
    { 
        //Normal Inheritance 
        this.prototype = new parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject.prototype;
    } 
    else 
    { 
        //Pure Virtual Inheritance 
        this.prototype = parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject;
    } 
    return this;
} 

//Entity superclass for any game object
var Entity = function(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

//Method used to render object
Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Method used to update object position
Entity.prototype.update = function(dt, x, y) {
    this.x += dt*x;
    this.y += dt*y;
}

//Check whether a player has collided or not with any enemy
function checkCollisions(player, allEnemies) {
    allEnemies.forEach(function(enemy){
        var playerCollidedWithEnemy = player.y == enemy.y && player.x >= enemy.x - 70 && player.x <= enemy.x + 78;
        if (playerCollidedWithEnemy) player.reset();
    });
}

// Enemies our player must avoid
var Enemy = function() {
    this.speed = randoms.ENEMY_SPEED();
    Entity.call(this, randoms.ENEMY_START_X(), randoms.ENEMY_START_Y(), 'images/enemy-bug.png');
};

Enemy.inheritsFrom(Entity);

// Reset enemy position and speed
Enemy.prototype.reset = function(dt) {
    this.speed = randoms.ENEMY_SPEED();
    this.x = randoms.ENEMY_START_X();
    this.y = randoms.ENEMY_START_Y();
};

// Update enemy position
Enemy.prototype.update = function(dt) {
    surpassRightBoundary = this.x >= 505;
    if (surpassRightBoundary) this.reset();
    // Call Entity superclass update method
    Object.getPrototypeOf(this.constructor.prototype).update.call(this, dt, this.speed, 0);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.xMov = 0;
    this.yMov = 0;
    Entity.call(this, constants.PLAYER_START_X, constants.PLAYER_START_Y, 'images/char-boy.png');
};

Player.inheritsFrom(Entity);

// Reset player position
Player.prototype.reset = function() {
    this.x = constants.PLAYER_START_X;
    this.y = constants.PLAYER_START_Y;
};

// Update player position
Player.prototype.update = function() {
    var x = this.xMov*101;
    var y = this.yMov*83;
    var surpassLeftBoundary = (this.x == 0 && x < 0);
    var surpassRightBoundary = (this.x == 404 && x > 0);
    var surpassTopBoundary = (this.y == -35 && y < 0);
    var surpassDownBoundary = (this.y == 380 && y > 0);
    var surpassBoundary = surpassLeftBoundary || surpassRightBoundary || surpassTopBoundary || surpassDownBoundary;
    if (!surpassBoundary){
        // Call Entity superclass update method
        Object.getPrototypeOf(this.constructor.prototype).update.call(this, 1, x, y);
    }
    var userWin = this.y == -35;
    if (userWin) this.reset();
    this.xMov = 0;
    this.yMov = 0;
};

// Handle player movement input
Player.prototype.handleInput = function(key) {
    // Define movement orientation
    // When xMov = -1, move left
    // ---- ---- - +1, move right
    // ---- yMov = -1, move up
    // ---- yMov = +1, move down
    switch(key) {
        case 'left':
            this.xMov = -1;
            this.yMov = 0;
            break;
        case 'up':
            this.xMov = 0;
            this.yMov = -1;
            break;
        case 'right':
            this.xMov = 1;
            this.yMov = 0;
            break;
        case 'down':
            this.xMov = 0;
            this.yMov = 1;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = [];
for (var i = 1; i <= 5; i++) {
    allEnemies.push(new Enemy());
}

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
