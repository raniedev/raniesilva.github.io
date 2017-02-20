(function(){
  var game = new Phaser.Game(800, 600, Phaser.AUTO, null, {
    preload: preload,
    create: create,
    update: update
  });
  var platforms, player, keys, stars, score = 0;
  var keyA, keyW, keyD;
  
  function preload(){
    game.load.image('sky', 'images/sky.png');
    game.load.image('platform', 'images/platform.png');
    game.load.spritesheet('dude','images/dude.png',32,48);
    game.load.image('star', 'images/star.png');
  }

  function create(){
    keys = game.input.keyboard.createCursorKeys();
    keyA = game.input.keyboard.addKey(Phaser.keyboard.A);
    keyA = game.input.keyboard.addKey(Phaser.keyboard.W);
    keyA = game.input.keyboard.addKey(Phaser.keyboard.D);
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //background
    game.add.sprite(0,0,'sky');

    //platforms
    platforms = game.add.group();
    platforms.enableBody = true;

    var platform = platforms.create(0,game.world.height - 64,'platform');
    platform.scale.setTo(2,2);
    platform.body.immovable = true;

    platform = platforms.create(400,400,'platform');
    platform.body.immovable = true;

    platform = platforms.create(-150,250,'platform');
    platform.body.immovable = true;

    //stars
    stars = game.add.group();
    stars.enableBody = true;

    for(var i = 0; i < 12; i++){
      var star = stars.create(i * 70, 0, 'star');
      star.body.gravity.y = 300;
      star.body.bounce.y = 0.7 + (Math.random() * 0.2);
    }

    //player
    player = game.add.sprite(50,game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.gravity.y = 300;
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.animations.add('left',[0,1,2,3], 10, true);
    player.animations.add('right',[5,6,7,8], 10, true);

    txtScore = game.add.text(16,16,'SCORE: 0', {fontSize: '32px', fill: '#fff'});
}


  function update(){
    game.physics.arcade.collide(player,platforms);
    game.physics.arcade.collide(stars,platforms);
    game.physics.arcade.overlap(player,stars,collectStar);

    player.body.velocity.x = 0;
    if(keys.left.isDown || keyA.isDown){
      player.body.velocity.x = -150;
      player.animations.play('left');
    }else if(keys.right.isDown || keyD.isDown){
      player.body.velocity.x = 150;
      player.animations.play('right');
    }else{
      player.animations.stop();
      player.frame = 4;
    }

    if((keys.up.isDown && player.body.touching.down) || keyW.isDown){
      player.body.velocity.y = -350;
    }
  }

  function collectStar(player,star){
    star.kill();
    score += 10;
    txtScore.text = 'SCORE: ' + score;
  }
}());
