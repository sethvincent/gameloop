var test = require('tape')
var createGame = require('./index')

test('create a game loop', function (t) {
  var game = createGame({ renderer: {} })
  t.ok(game)
  t.end()
})

test('start game and use arbitrary function as renderer', function (t) {
  var game = createGame({ renderer: function (a) { return a } })

  game.once('draw', function (renderer) {
    var ok = renderer('ok')
    t.equal(ok, 'ok')
    t.end()
  })

  game.start()
})

test('update event emits interval', function (t) {
  var game = createGame({ renderer: {} })
  game.once('update', function (interval, time) {
    t.ok(interval)
    t.end()
  })
  game.start()
})

test('end game', function (t) {
  var game = createGame({ renderer: {} })
  game.on('end', function (data) {
    t.ok(data.cool)
    t.end()
    process.exit()
  })
  game.start()
  game.end({ cool: true })
  t.end()
})
