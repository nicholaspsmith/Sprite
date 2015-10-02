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

// Speed in pixels per second
var playerSpeed = 200;
var bulletSpeed = 500;
var enemySpeed = 100;

// Update game objects
function update(dt) {
  gameTime += dt;

  handleInput(dt);
  updateEntities(dt);

  // It gets harder over time by adding enemies using this
  // equation: 1-.993^gameTime
  if(Math.random() < 1 - Math.pow(.993, gameTime)) {
    enemies.push({
      pos: [canvas.width, Math.random() * (canvas.height - 39)], sprite: new Sprite('img/sprites.png', [0, 78], [80, 39], 6, [0, 1, 2, 3, 2, 1])
    });
  }
  checkCollisions();
  scoreEl.innerHTML = score;
}

// User input
function handleInput(dt) {
  if(input.isDown('DOWN') || input.isDown('s')) {
    player.pos[1] += playerSpeed * dt;
  }

  if(input.isDown('UP') || input.isDown('w')) {
    player.pos[1] -= playerSpeed * dt;
  }

  if(input.isDown('LEFT') || input.isDown('a')) {
    player.pos[0] -= playerSpeed * dt;
  }

  if(input.isDown('RIGHT') || input.isDown('d')) {
    player.pos[0] += playerSpeed * dt;
  }

  if (input.isDown('SPACE') && !isGameOver && Date.now() - lastFire > 100) {
    var x = player.pos[0] + player.sprite.size[0] / 2;
    var y = player.pos[1] + player.sprite.size[1] / 2;

    bullets.push({
      pos: [x, y],
      dir: 'forward',
      sprite: new Sprite('img/sprites.png', [0, 39], [18,8])
    });
    bullets.push({
      pos: [x, y],
      dir: 'up',
      sprite: new Sprite('img/sprites.png', [0, 50], [9, 5])
    });
    bullets.push({
      pos: [x, y],
      dir: 'down',
      sprite: new Sprite('img/sprites.png', [0, 60], [9, 5])
    });

    lastFire = Date.now();
  }
}
