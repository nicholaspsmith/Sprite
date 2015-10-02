// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();


// Create canvas
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


var lastTime;
function main() {
  var now = Date.now();
  var dt = (nos - lastTime) / 1000.0;

  update(dt);
  render();

  lastTime = now;
  requestAnimFrame(main);
}

function init() {
  terrainPattern = ctx.createPattern(resources.get('img/terrain.png'), 'repeat');

  document.getElementById('play-again').addEventListener('click', function() {
    reset();
  });

  reset();
  lastTime = Date.now();
  main();
}

resources.load([
    'img/sprites.png',
    'img/terrain.png'
]);
resources.onReady(init);

// Game state
var player = {
    pos: [0, 0],
    sprite: new Sprite('img/sprites.png', [0, 0], [39, 39], 16, [0, 1])
};

var bullets = [];
var enemies = [];
var explosions = [];

var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
var terrainPattern;

// The score
var score = 0;
var scoreEl = document.getElementById('score');
