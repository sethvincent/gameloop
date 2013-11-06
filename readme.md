# gameloop
> the core methods/events of a game framework: start, end, pause, resume, update, draw

Designed for use with browserify.

## Requirements
- node.js

## Install

````
npm install gameloop
````

## Usage

### Create a canvas and game object:
```
var canvas = document.createElement('canvas');

var gameOne = new Game({
  renderer: canvas.getContext('2d');
});
````

### Use update and draw events
````
game.on('update', function(interval){});

game.on('draw', function(context){});
````

### Use start, pause, and resume methods
````
game.pause();

game.resume();

game.start();
````

## Contributing
- Fork this repository.
- Create a branch for your changes.
- Include tests if applicable.
- Add/edit documentation for any changes.
- Submit a pull request.

## License
MIT