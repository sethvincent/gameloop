# gameloop
> the core methods/events of a game loop: start, end, pause, resume, update, draw

## Install

```
npm install gameloop
```

Designed for use with browserify.

## Usage

### Create a canvas and game object:

```js
var canvas = document.createElement('canvas')

var game = new Game({
  renderer: canvas.getContext('2d')
})
```

You can use it server-side by not passing in a canvas context: `var game = Game();`

> the `new` keyword is optional

### Use update and draw events

```js
game.on('update', function(dt){})

game.on('draw', function(context){})
```

### Use start, pause, and resume methods

```js
game.start()

game.end()

game.pause()

game.resume()
```

These methods have corresponding events:

```js
game.on('start', function(){})

game.on('end', function(){
  game.pause()
})

game.on('pause', function(){})

game.on('resume', function(){})
```


## Contributing
- Fork this repository.
- Create a branch for your changes.
- Include tests if applicable.
- Add/edit documentation for any changes.
- Submit a pull request.

## License
MIT
