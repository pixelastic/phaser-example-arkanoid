var Phaser = require('phaser');

var SCALE = 3;

var game = new Phaser.Game(
  // Game width
  224 * SCALE,
  // Game height
  192 * SCALE,
  // Game renderer (WebGL, Canvas, auto)
  Phaser.AUTO,
  // Game id in index.html
  'phaser-example-arkanoid',
  // Phaser states
  {
    preload: _preload,
    create: _create,
    update: _update
  },
  // Transparent canvas background
  false,
  // Antialias
  false
);

var ball = null;
var ballSpeed = 180;
var bar = null;
var barSpeed = 200;

function _preload() {
  // console.log('💤 Preload game');
  game.load.image('ball', 'game/assets/ball.png');
  game.load.image('bar', 'game/assets/bar.png');
  game.load.image('brick', 'game/assets/brick01.png');
}

function _create() {
  // console.log('✨ Create game');

  game.stage.backgroundColor = '#363343';

  ball = _createBall(400, 420);
  bar = _createBar(100, 400);
  bricks = _createBricks();

  cursor = game.input.keyboard.createCursorKeys();
}

function _update() {
  // console.log('🔄 Update game');
  bar.body.velocity.x = 0;
  if (cursor.left.isDown) {
    bar.body.velocity.x = - barSpeed * SCALE;
  } else if (cursor.right.isDown) {
    bar.body.velocity.x = barSpeed * SCALE;
  }

  game.physics.arcade.collide(bar, ball, null, _reflect, this);
  game.physics.arcade.collide(ball, bricks, null, null, this);
}

function _createBall(x, y) {
  var ball = game.add.sprite(x, y, 'ball');
  ball.scale.set(SCALE);
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);
  var angle = - 0.5 * Math.PI;
  ball.body.velocity.setTo(
    Math.cos(angle) * ballSpeed,
    Math.sin(angle) * ballSpeed
  );
  return ball;
}

function _createBar(x, y) {
  var bar = game.add.sprite(x, y, 'bar');
  bar.scale.set(SCALE);
  game.physics.enable(bar, Phaser.Physics.ARCADE);
  bar.body.collideWorldBounds = true;
  bar.body.immovable = true;
  return bar;
}

function _createBricks() {
  var bricks = game.add.group();
  var brickImage = 'brick';
  var widthBrick = game.cache.getImage(brickImage).width;
  var heightBrick = game.cache.getImage(brickImage).height;
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 6; j++) {
      var brick = _createOneBrick(
        widthBrick * SCALE * i,
        heightBrick * SCALE * j,
        brickImage);
      bricks.add(brick);
    }
  }
  return bricks;
}

function _createOneBrick(x, y, image) {
  var brick = game.add.sprite(x, y, image);
  brick.scale.set(SCALE);
  game.physics.enable(brick, Phaser.Physics.ARCADE);
  brick.body.immovable = true;
  return brick;
}

function _reflect(bar, ball) {
  if (ball.y > (bar.y + 5)) {
    return true;
  } else {
    var rate = (1 - (ball.x + ball.width * 0.5 - bar.x ) / bar.width);
    if(rate < 0.1) rate = 0.1;
    if(rate > 0.9) rate = 0.9;
    var angle = - Math.PI*rate;
    ball.body.velocity.setTo(
      Math.cos(angle) * ballSpeed,
      Math.sin(angle) * ballSpeed
    );
    return false;
  }
}
