var Emitter = require('eventemitter2').EventEmitter2
var inherits = require('inherits')
var raf = require('raf')

module.exports = Game
inherits(Game, Emitter)

/**
* Create the game
* @name createGame
* @param {Object} options
* @param {Object} options.renderer
* @param {Number} options.fps
* @example
* var createGame = require('gameloop')
*
* var game = createGame({
*   renderer: document.createElement('canvas').getContext('2d')
* })
*/
function Game (options) {
  if (!(this instanceof Game)) return new Game(options)
  options = options || {}
  Emitter.call(this)
  this.paused = true
  this.renderer = options.renderer || {}
  this.fps = options.fps || 60
  this.step = 1 / this.fps
  this.time = null
}

/**
* Start the game. Emits the `start` event.
* @name game.start
* @fires Game#start
* @example
* game.start()
*/
Game.prototype.start = function gameloop_start () {
  this.paused = false
  this.emit('start')
  this.dt = 0
  this.accumulator = 0.0
  raf(this.frame.bind(this))
}

/**
* Execute a frame
* @name game.start
* @private
*/
Game.prototype.frame = function gameloop_frame (time) {
  if (!this.paused) {
    this.dt = Math.min(1, (time - this.time) / 1000)
    this.time = time
    this.accumulator += this.dt

    while (this.accumulator >= this.step) {
      this.update(this.step)
      this.accumulator -= this.step
    }

    this.draw(this.renderer, this.step)
    raf(this.frame.bind(this))
  }
}

/**
* Update the game state. Emits the `update` event. You'll likely never call this method, but you may need to override it. Make sure to always emit the update event with the `delta` time.
* @name game.update
* @param {Number} delta – time elapsed since last update
* @fires Game#update
*/
Game.prototype.update = function gameloop_update (dt) {
  this.emit('update', dt)
}

/**
* Draw the game. Emits the `draw` event. You'll likely never call this method, but you may need to override it. Make sure to always emit the update event with the renderer and `delta` time.
* @name game.draw
* @param {Object} renderer
* @param {Number} delta – time elapsed since last update
* @fires Game#draw
*/
Game.prototype.draw = function gameloop_draw (renderer, dt) {
  this.emit('draw', renderer, dt)
}

/**
* End the game. Emits the `end` event/
* @name game.end
* @fires Game#end
* @example
* game.end()
*/
Game.prototype.end = function gameloop_end () {
  this.emit('end')
}

/**
* Pause the game. Emits the `pause` event.
* @name game.pause
* @fires Game#pause
* @example
* game.pause()
*/
Game.prototype.pause = function gameloop_pause () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

/**
* Resume the game. Emits the `resume` event.
* @name game.resume
* @fires Game#resume
* @example
* game.resume()
*/
Game.prototype.resume = function gameloop_resume () {
  if (this.paused) {
    this.start()
    this.emit('resume')
  }
}

/**
* Pause or start game depending on game state. Emits either the `pause` or `resume` event.
* @name game.toggle
* @example
* game.toggle()
*/
Game.prototype.toggle = function gameloop_toggle () {
  if (this.paused) this.resume()
  else this.pause()
}

/* Event documentation */

/**
* Start event. Fired when `game.start()` is called.
*
* @event Game#start
* @example
* game.on('start', function () {})
*/

/**
* End event. Fired when `game.end()` is called.
*
* @event Game#end
* @example
* game.on('end', function () {})
*/

/**
* Update event.
*
* @event Game#update
* @param {Number} delta
* @example
* game.on('update', function (dt) {
*   console.log(dt)
* })
*/

/**
* Draw event.
*
* @event Game#draw
* @param {Object} renderer
* @param {Number} delta
* @example
* game.on('draw', function (renderer, dt) {
*   console.log(dt)
* })
*/

/**
* Pause event. Fired when `game.pause()` is called.
*
* @event Game#pause
* @example
* game.on('pause', function () {})
*/

/**
* Resume event. Fired when `game.resume()` is called.
*
* @event Game#resume
* @example
* game.on('resume', function () {})
*/
