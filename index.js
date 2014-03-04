var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

global || (global = window);

if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = global.webkitRequestAnimationFrame || 
                                 global.mozRequestAnimationFrame    || 
                                 global.oRequestAnimationFrame      || 
                                 global.msRequestAnimationFrame     || 
                                 function(callback) {
                                   setTimeout(callback, 1000 / 60);
                                 }
}

module.exports = Game;
inherits(Game, EventEmitter);

function Game(options){
  if (!(this instanceof Game)) return new Game(options);

  var options = options || {};
  EventEmitter.call(this);


  /*
  * Pause the game by default
  */

  this.paused = true;


  /*
  * Renderer
  *
  * Expects an object that represents a drawing context.
  */

  this.renderer = options.renderer || {};


  /*
  * FPS
  */

  this.fps = options.fps || 60;


  /*
  * Avoid the max listeners error
  */
  
  this.setMaxListeners(options.maxListeners || 0);
}

Game.prototype.start = function(restart){
  var self = this;
  this.paused = false;
  this.counter = 0;
  this.dt = 0;
  this.now = null;
  this.last = this.timestamp();
  
  function frame() {
    if (!self.paused){
      self.now = self.timestamp();
      self.dt = self.dt + Math.min(1, (self.now - self.last) / 1000);
      while(self.dt > 1/self.fps) {
        self.dt = self.dt - 1/self.fps;
        self.update(1/self.fps);
      }
      self.draw(self.counter, self.dt);
      self.last = self.now;
      self.counter++;
      global.requestAnimationFrame(frame);
    }
  }

  frame();
};

Game.prototype.end = function(){
  this.emit('end');
}

Game.prototype.pause = function(){
  if (!this.paused){
    this.paused = true;
    this.emit('pause');
  }
};

Game.prototype.resume = function(){
  if (this.paused){
    this.start(true);
    this.emit('resume');
  }
};

Game.prototype.update = function(dt){
  this.emit('update', dt);
};

Game.prototype.draw = function(counter, dt){
  this.emit('draw', this.renderer, dt, counter)
};

Game.prototype.timestamp = function() {
  return global.performance && global.performance.now ? global.performance.now() : new Date().getTime();
}