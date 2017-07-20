var myId=0;

var field;

var shadow;
var tank;
var turret;
var player;
var playersList;
var explosions;
var logo;

var cursors;

var bullets;
var fireRate = 100;
var nextFire = 0;

var ready = false;
var eurecaServer;
//this function will handle client communication with the server
var eurecaClientSetup = function() {
	//create an instance of eureca.io client
	var eurecaClient = new Eureca.Client();

	eurecaClient.ready(function (proxy) {
		eurecaServer = proxy;
	});


	//methods defined under "exports" namespace become available in the server side

	eurecaClient.exports.setId = function(id)
	{
		//create() is moved here to make sure nothing is created before uniq id assignation
		myId = id;
		create();
		eurecaServer.handshake();
		ready = true;
	}

	eurecaClient.exports.kill = function(id)
	{
		if (playersList[id]) {
			playersList[id].kill();
			console.log('killing ', id, playersList[id]);
		}
	}

	eurecaClient.exports.spawnEnemy = function(i, x, y)
	{

		if (i == myId) return; //this is me

		console.log('SPAWN');
		var tnk = new Tank(i, game, tank, false);
		var ball = new Tank(i+1, game, tank, true);
		playersList[i] = tnk;
		playersList[i+1] = ball;
	}

	eurecaClient.exports.updateState = function(id, state)
	{
		if (playersList[id])  {
			playersList[id].cursor = state;
			playersList[id].tank.x = state.x;
			playersList[id].tank.y = state.y;
			playersList[id].tank.angle = state.angle;
			playersList[id].turret.rotation = state.rot;
			playersList[id].update();
		}
	}
}


Tank = function (index, game, player, balls) {
	this.cursor = {
		left:false,
		right:false,
		up:false,
		// fire:false
	}

	this.input = {
		left:false,
		right:false,
		up:false,
		// fire:false
	}

    var x = 0;
    var y = 0;

    this.game = game;
    this.health = 30;
    this.player = player;
    // this.bullets = game.add.group();
    // this.bullets.enableBody = true;
    // this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    // this.bullets.createMultiple(20, 'bullet', 0, false);
		// this.bullets.setAll('anchor.y', 0.5);
    // this.bullets.setAll('anchor.x', 0.5);
    // this.bullets.setAll('outOfBoundsKill', true);
    // this.bullets.setAll('checkWorldBounds', true);


		this.currentSpeed = 0;
    // this.fireRate = 500;
    // this.nextFire = 0;
    this.alive = true;

    // this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    if (balls) {
			this.tank = game.add.sprite(500, 312, 'ball');
		}
		else {
			this.tank = game.add.sprite(x, y, 'player');
		};
		// this.turret = game.add.sprite(x, y, 'enemy', 'turret');

    // this.shadow.anchor.set(0.5);
    this.tank.anchor.setTo(0.5);
    // this.turret.anchor.set(0.3, 0.5);
		this.tank.scale.setTo(0.4);


    this.tank.id = index;
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = false;
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(0, 0);

    this.tank.angle = 0;

    game.physics.arcade.velocityFromRotation(this.tank.rotation, 0, this.tank.body.velocity);

};

Tank.prototype.update = function() {

	var inputChanged = (
		this.cursor.left != this.input.left ||
		this.cursor.right != this.input.right ||
		this.cursor.up != this.input.up
		// this.cursor.fire != this.input.fire
	);


	if (inputChanged)
	{
		//Handle input change here
		//send new values to the server
		if (this.tank.id == myId)
		{
			// send latest valid state to the server
			this.input.x = this.tank.x;
			this.input.y = this.tank.y;
			this.input.angle = this.tank.angle;
			// this.input.rot = this.turret.rotation;


			eurecaServer.handleKeys(this.input);

		}
	}

	//cursor value is now updated by eurecaClient.exports.updateState method


    if (this.cursor.left)
    {
        this.tank.angle -= 2;
    }
    else if (this.cursor.right)
    {
        this.tank.angle += 2;
    }
    if (this.cursor.up)
    {
        //  The speed we'll travel at
        this.currentSpeed = 200;
    }
    else
    {
        if (this.currentSpeed > 0)
        {
            this.currentSpeed -= 4;
        }
    }
    // if (this.cursor.fire)
    // {
		// this.fire({x:this.cursor.tx, y:this.cursor.ty});
    // }



    if (this.currentSpeed > 0)
    {
        game.physics.arcade.velocityFromRotation(this.tank.rotation, this.currentSpeed, this.tank.body.velocity);
    }
	else
	{
		game.physics.arcade.velocityFromRotation(this.tank.rotation, 0, this.tank.body.velocity);
	}




    // this.shadow.x = this.tank.x;
    // this.shadow.y = this.tank.y;
    // this.shadow.rotation = this.tank.rotation;

    // this.turret.x = this.tank.x;
    // this.turret.y = this.tank.y;
};


// Tank.prototype.fire = function(target) {
// 		if (!this.alive) return;
//         if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
//         {
//             this.nextFire = this.game.time.now + this.fireRate;
//             var bullet = this.bullets.getFirstDead();
//             bullet.reset(this.turret.x, this.turret.y);
//
// 			bullet.rotation = this.game.physics.arcade.moveToObject(bullet, target, 500);
//         }
// }


// Tank.prototype.kill = function() {
// 	this.alive = false;
// 	this.tank.kill();
// 	this.turret.kill();
// 	this.shadow.kill();
// }

var game = new Phaser.Game(1000, 625, Phaser.CANVAS, 'phaser-example', { preload: preload, create: eurecaClientSetup, update: update, render: render });

function preload () {

    // game.load.atlas('tank', 'images/tanks.png', 'images/tanks.json');
		game.load.image('player', 'images/Blue\ player.png');
		// game.load.atlas('enemy', 'images/enemy-tanks.png');
    // game.load.image('bullet', 'images/bullet.png');
		game.load.image('ball', 'images/ball.png');
    game.load.image('field', 'images/TEREN2.png');
		// game.load.image('logo', 'images/logo.png');
    // game.load.spritesheet('kaboom', 'images/explosion.png', 64, 64, 23);

}



function create () {

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(0, 0, 1000, 625);
		game.stage.disableVisibilityChange  = true;

    //  Our tiled scrolling background
    field = game.add.sprite(0, 0, 'field');
    field.scale.setTo(0.625);

		// ball = game.add.sprite(500, 312, 'ball');
		// ball.scale.setTo(0.3)
		// ball.anchor.set(0.5)

    playersList = {};

	player = new Tank(myId, game, tank, false);
	playersList[myId] = player;
	tank = player.tank;
	// turret = player.turret;
	tank.x=0;
	tank.y=0;

  tank.bringToTop();

	game.physics.enable(Phaser.Physics.ARCADE);


  logo = game.add.sprite(0, 200, 'logo');
  logo.fixedToCamera = true;

  game.input.onDown.add(removeLogo, this);

  cursors = game.input.keyboard.createCursorKeys();

	setTimeout(removeLogo, 1000);

}

function removeLogo () {
    game.input.onDown.remove(removeLogo, this);
    logo.kill();
}

function update () {
	//do not update if client not ready
	if (!ready) return;

	//  Enable physics between the player and the ball
	var lista = []
	for (var i in playersList){
		lista.push(playersList[i].tank)
		// lista.push(ball)
	}
  game.physics.arcade.collide(lista, lista);

	player.input.left = cursors.left.isDown;
	player.input.right = cursors.right.isDown;
	player.input.up = cursors.up.isDown;
	// player.input.fire = game.input.activePointer.isDown;
	// player.input.tx = game.input.x+ game.camera.x;
	// player.input.ty = game.input.y+ game.camera.y;
  for (var i in playersList) {
		if (!playersList[i]) continue;
		var curTank = playersList[i].tank;
		for (var j in playersList) {
			if (!playersList[j]) continue;
			if (j!=i) {
				var targetTank = playersList[j].tank;
			}
			if (playersList[j].alive)
			{
				playersList[j].update();
			}
		}
  }
}

function render () {}
