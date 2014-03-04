var Game = require('./index');
var Keyboard = require('crtrdg-keyboard');
var tic = require('tic')();

var canvas = document.createElement('canvas');
document.body.appendChild(canvas);

var game = new Game({
  renderer: canvas.getContext('2d')
});

game.width = canvas.width = 800;
game.height = canvas.height = 400;

game.on('pause', function(){
  console.log('paused');
});

game.on('resume', function(){
  console.log('resumed');
});

var keyboard = new Keyboard(game);
var keysDown = keyboard.keysDown;

keyboard.on('keydown', function(key){
  if (key === 'P'){
    if (game.paused) game.resume();
    else game.pause();
  }
});

var box = {
  position: { x: 0, y: 0 },
  size: { x: 10, y: 10 },
  velocity: { x: 0, y: 0 },
  speed: 10,
  friction: 0.7,
  color: '#000'
}

box.update = function(dt){
  this.velocity.x *= this.friction;
  this.velocity.y *= this.friction;
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
}

game.on('start', function(){
  console.log('started', this);
});

game.on('update', function(dt){
  tic.tick(dt);
  box.update(dt)

  if ('A' in keysDown) box.velocity.x -= box.speed;
  if ('D' in keysDown) box.velocity.x += box.speed;
  if ('W' in keysDown) box.velocity.y -= box.speed;
  if ('S' in keysDown) box.velocity.y += box.speed;

  if (box.position.x < 0) box.position.x = 0;
  if (box.position.y < 0) box.position.y = 0;
  if (box.position.x + box.size.x >= game.width) box.position.x = game.width - box.size.x;
  if (box.position.y + box.size.y >= game.height) box.position.y = game.height - box.size.y;
});

game.on('draw', function(context){
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = box.color;
  context.fillRect(box.position.x, box.position.y, box.size.x, box.size.y);
});

tic.interval(function() {
  console.log('happening')
}, 1);

game.start();