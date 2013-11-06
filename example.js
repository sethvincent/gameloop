var Game = require('./index');

var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
var context = canvas.getContext('2d');

var gameOne = new Game({
  fps: 24,
  renderer: context
});

var box = {
  x: 0,
  y: 0,
  w: 10,
  h: 10,
  color: '#000'
}

gameOne.on('update', function(interval){
  box.x += Math.floor(Math.random() * (2 - -2 + 1) + -2);
  box.y += Math.floor(Math.random() * (2 - -2 + 1) + -2);

  if (box.x < 0) box.x = 0;
  if (box.y < 0) box.y = 0;
  if (box.x >= canvas.width) box.x = canvas.width;
  if (box.y >= canvas.height) box.y = canvas.height;
});

gameOne.on('draw', function(context){
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = box.color;
  context.fillRect(box.x, box.y, box.w, box.h);
});

gameOne.start();
