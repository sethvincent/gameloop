var Emitter = require('component-emitter')
var inherits = require('inherits')
var raf = require('raf')

module.exports = Game
inherits(Game, Emitter)

function Game (options) {
  if (!(this instanceof Game)) return new Game(options)
  var options = options || {}
  Emitter.call(this)
  this.paused = true
  this.renderer = options.renderer || {}
  this.fps = options.fps || 60
  this.step = 1/this.fps
  this.time = null
}

Game.prototype.start = function () {
  this.paused = false
  this.emit('start')
  this.dt = 0
  this.accumulator = 0.0
  raf(this.frame.bind(this))
}

Game.prototype.frame = function (time) {
  if (!this.paused){
    this.dt = Math.min(1, (time - this.time) / 1000)
    this.time = time
    this.accumulator += this.dt

    while(this.accumulator >= this.step) {
      this.update(this.step)
      this.accumulator -= this.step
    }

    this.draw(this.dt)
    raf(this.frame.bind(this))
  }
}

Game.prototype.end = function () {
  this.pause()
  this.emit('end')
}

Game.prototype.pause = function () {
  if (!this.paused){
    this.paused = true
    this.emit('pause')
  }
}

Game.prototype.resume = function () {
  if (this.paused){
    this.start()
    this.emit('resume')
  }
}

Game.prototype.update = function (dt) {
  this.emit('update', dt)
}

Game.prototype.draw = function (dt) {
  this.emit('draw', this.renderer, dt)
}

Game.prototype.timestamp = function () {
  return global.performance.now()
}
