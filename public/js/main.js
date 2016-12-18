// mods by Patrick OReilly
// Twitter: @pato_reilly Web: http://patricko.byethost9.com

var game = new Phaser.Game(1000, 625, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('player', 'images/Blue\ player.png')
    game.load.image('ball', 'images/ball.png')
		game.load.image('field', 'images/1600x1000_field.png')
		game.load.image('logo', 'images/logo.png')
		game.load.image('enemyPlayer', 'images/Red\ player.png')
}

var currentSpeed = 0

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    //  and assign it to a variable
		field = game.add.sprite(0, 0, 'field');
		field.scale.setTo(0.625)

    ball = game.add.sprite(400, 200, 'ball');
		ball.scale.setTo(0.3)
		ball.anchor.set(0.5)

    player = game.add.sprite(200, 200, 'player');
		player.scale.setTo(0.5)
		player.anchor.set(0.5)

		enemyPlayer = game.add.sprite(100, 100, 'enemyPlayer')
		enemyPlayer.scale.setTo(0.5)
		enemyPlayer.anchor.set(0.5)

    game.physics.enable([enemyPlayer, player, ball], Phaser.Physics.ARCADE);

    //  This gets it moving
    ball.body.velocity.setTo(200, 200);

    //  This makes the game world bounce-able
    ball.body.collideWorldBounds = true;
		player.body.collideWorldBounds = true;
		enemyPlayer.body.collideWorldBounds = true;

    //  This sets the image bounce energy for the horizontal
    //  and vertical vectors (as an x,y point). "1" is 100% energy return
    ball.body.bounce.setTo(1, 1);


		logo = game.add.sprite(0, 200, 'logo');
    logo.fixedToCamera = true;

    game.input.onDown.add(removeLogo, this);

    cursors = game.input.keyboard.createCursorKeys();

		setTimeout(removeLogo, 1000);

}

//  Move the knocker with the arrow keys
function update () {

    //  Enable physics between the player and the ball
    game.physics.arcade.collide([player, enemyPlayer, ball], [player, enemyPlayer, ball]);

    if (cursors.left.isDown)
    {
        player.angle -= 3;
    }
    else if (cursors.right.isDown)
    {
        player.angle += 3;
    }
    else
    {
        player.body.velocity.setTo(0, 0);
    }

		if (cursors.up.isDown){
				//  The speed we'll travel at
				currentSpeed = 300;
		}
		else
		{
				if (currentSpeed > 0)
				{
						currentSpeed -= 4;
				}
		}
		if (currentSpeed > 0)
		{
				game.physics.arcade.velocityFromRotation(player.rotation, currentSpeed, player.body.velocity);
		}
	else
	{
		game.physics.arcade.velocityFromRotation(player.rotation, 0, player.body.velocity);
	}

}

function removeLogo () {
    game.input.onDown.remove(removeLogo, this);
    logo.kill();
}

function render () {

}
