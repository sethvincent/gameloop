var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var ticker = require('../ticker/index');

module.exports = Game;
inherits(Game, EventEmitter);

function Game(options){
  if (!(this instanceof Game)) return new Game(options);

  var options = options || {};
  EventEmitter.call(this);


  /*
  * Pause the game by default
  */

  this.paused = options.paused || true;


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
  * Ticker
  */

  this.ticker = ticker(this.fps, 5);


  /*
  * Avoid the max listeners error
  */
  
  this.setMaxListeners(options.maxListeners || 0);
}

Game.prototype.start = function(){
  var self = this;
  this.paused = false;
  this.emit('start');

  this.ticker.on('tick', function(interval){
    if (!self.paused){
      self.update(interval);
    }
  });

  this.ticker.on('draw', function(interval){
    if (!self.paused){
      self.draw(interval);
    }
  })
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
    this.paused = false;
    this.emit('resume');
  }
};

Game.prototype.update = function(interval){
  this.emit('update', interval);
};

Game.prototype.draw = function(interval){
  this.emit('draw', this.renderer, interval)
};