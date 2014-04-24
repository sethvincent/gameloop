var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

global || (global = window);

(function () {
  global.performance = (global.performance || {});

  global.performance.now = (function () {
    return (
      global.performance.now ||
      global.performance.webkitNow ||
      global.performance.msNow ||
      global.performance.mozNow ||
      Date.now ||
      function () {
        return new Date().getTime();
      });
  })();

  global.requestAnimationFrame = (function () {
    return (
      global.requestAnimationFrame ||
      global.webkitRequestAnimationFrame ||
      global.msRequestAnimationFrame ||
      global.mozRequestAnimationFrame ||
      function (callback) {
        return setTimeout(function () {
          var time = global.performance.now();
          callback(time);
        }, 16);
      });
   })();

  global.cancelAnimationFrame = (function () {
    return (
      global.cancelAnimationFrame ||
      global.webkitCancelAnimationFrame ||
      global.msCancelAnimationFrame ||
      global.mozCancelAnimationFrame ||
      function (id) {
        clearTimeout(id);
      });
  })();
})();

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
  * step
  */
  this.step = 1/this.fps;

  /*
  * Avoid the max listeners error
  */
  
  this.setMaxListeners(options.maxListeners || 0);
}

Game.prototype.start = function(){
  this.paused = false;
  this.emit('start');
  this.dt = 0;
  this.time = null;
  this.accumulator = 0.0;
  var time = this.timestamp();
  this.frame(time);
};

Game.prototype.frame = function(time){
  if (!this.paused){
    this.dt = Math.min(1, (time - this.time) / 1000);
    this.time = time;
    this.accumulator += this.dt;

    while(this.accumulator >= this.step) {
      this.update(this.step);
      this.accumulator -= this.step;
    }

    this.draw(this.dt);
    global.requestAnimationFrame(this.frame.bind(this));
  }
}

Game.prototype.end = function(){
  this.pause();
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
    this.start();
    this.emit('resume');
  }
};

Game.prototype.update = function(dt){
  this.emit('update', dt);
};

Game.prototype.draw = function(dt){
  this.emit('draw', this.renderer, dt)
};

Game.prototype.timestamp = function() {
  return global.performance && global.performance.now ? global.performance.now() : new Date().getTime();
}
