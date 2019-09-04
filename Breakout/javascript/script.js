var game = new Phaser.Game(480, 320, Phaser.AUTO, null,{
    preload: preload,
    create: create,
    update: update
});

var bubble, paddle, bricks, newBricks, brickInfo, scoreText, score = 0;
var lives = 3, livesText, lifeLostText, playing = false, startButton;

function preload(){
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = "#eee";
    game.load.image("bubble", "images/new/bubble.png");
    game.load.image("paddle", "images/paddle.png");
    game.load.image("brick", "images/brick.png");
    game.load.spritesheet("bubble", "images/new/wobble.png", 20, 20);
    game.load.spritesheet("button", "images/button.png", 120, 40);
}
function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.down = false;
    bubble = game.add.sprite(game.world.width*0.5, game.world.height-25, "bubble");
    bubble.animations.add("wobble", [0,1,0,2,0,1,0,2,0], 24);
    bubble.anchor.set(0.5);
    game.physics.enable(bubble, Phaser.Physics.ARCADE);
    bubble.body.collideWorldBounds = true;
    bubble.body.bounce.set(1);
    bubble.checkWorldBounds = true;
    bubble.events.onOutOfBounds.add(bubbleLeaveScreen, this);

    paddle = game.add.sprite(game.world.width*0.5, game.world.height-8, "paddle");
    paddle.anchor.set(0.5, 1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;

    initBricks();

    textStyle = {font: "18px Arial", fill: "#0095DD"};
    scoreText = game.add.text(5, 5, "Points: 0", textStyle);
    livesText = game.add.text(game.world.width-5, 5, "Lives: " + lives, textStyle);
    livesText.anchor.set(1,0);
    lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.5, "Life lost, click to continue.", textStyle);
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;

    startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, "button", startGame, this, 1, 0, 2);
    startButton.anchor.set(0.5);
}
function update(){
    game.physics.arcade.collide(bubble, paddle, bubbleHitPaddle);
    game.physics.arcade.collide(bubble, bricks, bubbleHitBrick);
    if(playing){
        paddle.x = game.input.x || game.world.width * 0.5;
    }
}

function initBricks(){
    brickInfo = {
        width: 50,
        height: 20,
        count: {
            row: 7,
            col: 3
        },
        offset:{
            top: 50,
            left: 60
        },
        padding: 10
    }
    bricks = game.add.group();
    for(c=0; c<brickInfo.count.col; c++){
        for(r=0; r<brickInfo.count.row; r++){
            var brickX = (r*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
            var brickY = (c*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
            newBrick = game.add.sprite(brickX, brickY, "brick");
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            newBrick.anchor.set(0.5);
            bricks.add(newBrick);
        }
    }
}

function bubbleHitBrick(bubble, brick){
    var killTween = game.add.tween(brick.scale);
    killTween.to({x:0, y:0}, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function(){
        brick.kill();
    }, this);
    killTween.start();
    score += 10;
    scoreText.setText("Points: "+ score);
    if(score === brickInfo.count.row * brickInfo.count.col * 10){
        alert("You won the game, congratulations!");
        location.reload();
    }
}


function bubbleLeaveScreen(){
    lives--;
    if(lives){
        livesText.setText("Lives: " + lives);
        lifeLostText.visible = true;
        bubble.reset(game.world.width*0.5, game.world.height-25);
        paddle.reset(game.world.width*0.5, game.world.height-5);
        game.input.onDown.addOnce(function(){
            lifeLostText.visible = false;
            bubble.body.velocity.set(150, - 150);
        }, this);
    }else{
        alert("You lost, game over!");
        location.reload();    
    }
}

function bubbleHitPaddle(bubble, paddle) {
    bubble.animations.play("wobble");
}

function startGame(){
    startButton.destroy();
    bubble.body.velocity.set(150, -150);
    playing = true;
}