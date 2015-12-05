var Emitter = require('eventemitter2').EventEmitter2
var inherits = require('inherits')
var raf = require('raf')

module.exports = Game
inherits(Game, Emitter)

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

Game.prototype.start = function gameloop_start () {
  this.paused = false
  this.emit('start')
  this.dt = 0
  this.accumulator = 0.0
  raf(this.frame.bind(this))
}

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

Game.prototype.update = function gameloop_update (dt) {
  this.emit('update', dt)
}

Game.prototype.draw = function gameloop_draw (renderer, dt) {
  this.emit('draw', renderer, dt)
}

Game.prototype.end = function gameloop_end () {
  this.emit('end')
}

Game.prototype.pause = function gameloop_pause () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

Game.prototype.resume = function gameloop_resume () {
  if (this.paused) {
    this.start()
    this.emit('resume')
  }
}
