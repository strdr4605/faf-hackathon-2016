var myId=0;

var field;

var tank;
var ball;
var player;
var tanksList;

var logo;
var cursors;

Ball = function(game) {
	var x = 100
	var y = 100

	this.game = game;
	this.currentSpeed =0;
	this.alive = true;

	this.ball = game.add.sprite(x, y, 'ball');
	this.ball.scale.setTo(0.2)

	this.ball.anchor.set(0.5);

	game.physics.enable(this.ball, Phaser.Physics.ARCADE);
	this.ball.body.immovable = false;
	this.ball.body.collideWorldBounds = true;
	this.ball.body.bounce.setTo(1, 1);
	this.ball.body.velocity.setTo(0, 0)

	this.ball.angle = 0;
}

Tank = function (index, game, player) {
	this.cursor = {
		left:false,
		right:false,
		up:false
	}

	this.input = {
		left:false,
		right:false,
		up:false
	}

    var x = 0;
    var y = 0;

    this.game = game;
    this.player = player;


	this.currentSpeed =0;
    this.alive = true;

    this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
		this.tank.scale.setTo(0.5)

    this.tank.anchor.set(0.5);


    this.tank.id = index;
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = false;
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(1, 1);

    this.tank.angle = 0;

    game.physics.arcade.velocityFromRotation(this.tank.rotation, 0, this.tank.body.velocity);

};

Tank.prototype.update = function() {

	for (var i in this.input) this.cursor[i] = this.input[i];



    if (this.cursor.left)
    {
        this.tank.angle -= 3;
				this.ball.x -= 50;
    }
    else if (this.cursor.right)
    {
        this.tank.angle += 3;
    }
    if (this.cursor.up)
    {
        //  The speed we'll travel at
        this.currentSpeed = 300;
    }
    else
    {
        if (this.currentSpeed > 0)
        {
            this.currentSpeed -= 4;
        }
    }
    if (this.currentSpeed > 0)
    {
        game.physics.arcade.velocityFromRotation(this.tank.rotation, this.currentSpeed, this.tank.body.velocity);
    }
	else
	{
		game.physics.arcade.velocityFromRotation(this.tank.rotation, 0, this.tank.body.velocity);
	}
};



var game = new Phaser.Game(1000, 625, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.image('tank', 'images/Blue\ player.png');
    game.load.image('enemy', 'images/Blue\ player.png');
    game.load.image('logo', 'images/logo.png');
    game.load.image('bullet', 'images/bullet.png');
    game.load.image('field', 'images/1600x1000_field.png');
		game.load.image('ball', 'images/minge\ cu\ fundal\ curat.png')

}



function create () {

    //  Resize our game world to be a 1000 x 625 square
    game.world.setBounds(0, 0, 1000, 625);
	game.stage.disableVisibilityChange  = true;

    //  Our tiled scrolling background
    field = game.add.sprite(0, 0, 'field');
    field.fixedToCamera = true;
		field.scale.setTo(0.625)

    tanksList = {};

	player = new Tank(myId, game, tank);

	//  This will force it to decelerate and limit its speed
	game.physics.enable(player, Phaser.Physics.ARCADE);
	player.tank.body.drag.set(0.2);
	player.tank.body.maxVelocity.setTo(400, 400);
	player.tank.body.collideWorldBounds = true;

	tanksList[myId] = player;
	tank = player.tank;
	tank.body.collideWorldBounds =  true
	tank.x=0;
	tank.y=0;

	ball = new Ball(game)

    tank.bringToTop();

    logo = game.add.sprite(0, 200, 'logo');
    logo.fixedToCamera = true;

    game.input.onDown.add(removeLogo, this);

    game.camera.follow(tank);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

	setTimeout(removeLogo, 1000);

}

function removeLogo () {
    game.input.onDown.remove(removeLogo, this);
    logo.kill();
}

function update () {

	player.input.left = cursors.left.isDown;
	player.input.right = cursors.right.isDown;
	player.input.up = cursors.up.isDown;
	player.input.tx = game.input.x+ game.camera.x;
	player.input.ty = game.input.y+ game.camera.y;

    for (var i in tanksList)
    {
		if (!tanksList[i]) continue;
		var curTank = tanksList[i].tank;
		for (var j in tanksList)
		{
			if (tanksList[j].alive)
			{
				tanksList[j].update();
			}
		}
    }
		if(tank.x == ball.x && tank.y == ball.y){
			console.log('colision');
		}
		else{
			console.log('no colision')
		}
}

function render () {}
