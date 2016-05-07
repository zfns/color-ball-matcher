var State = window.G.State;
var Config = window.G.Config;

State.game = function (game) {};

State.game.prototype = {

  init: function () {

  },

  preload: function () {

  },

  create: function () {
    var self = this;
    self.rect = null;
    self.lock = false;
    self.srcTile = {};
    self.destTile = {};

    self.add.image(0, 0, 'bg2');

    self.jummpSound = self.add.audio('jump');
    self.dismissSound = self.add.audio('dismiss');

    self.scoreText = self.add.text(40, 30, 'SCORE: 0', { font: '25px Arial', fill: '#ffffff'});
    self.score = 0;

    self.face = self.add.sprite(325, 20, 'face', 1);
    self.face.scale = { x: 0.2, y: 0.2 };

    self.restartText = self.add.text(Config.GAME_WIDTH - 240, 30, 'RESTART', { font: '25px Arial', fill: '#ffffff'});
    self.restartText.inputEnabled = true;
    self.restartText.input.useHandCursor = true;
    self.restartText.events.onInputDown.add(self.restart, self);

    self.menuText = self.add.text(Config.GAME_WIDTH - 110, 30, 'MENU', { font: '25px Arial', fill: '#ffffff'});
    self.menuText.inputEnabled = true;
    self.menuText.input.useHandCursor = true;
    self.menuText.events.onInputDown.add(self.back2Menu, self);

    self.drawBoard();
  },

  restart: function() {
    this.state.start('Game');
  },

  back2Menu: function() {
    this.state.start('Menu');
  },

  drawBoard: function() {
    var self = this;
    var graph = self.add.graphics();
    var top = Config.BOARD_TOP;
    var left = (Config.GAME_WIDTH - Config.GRID_WIDTH * Config.GRID_COL) / 2;

    graph.lineStyle(8, 0xFFFFFF, 1);
    graph.drawRect(left, top, Config.GRID_WIDTH * Config.GRID_COL, Config.GRID_HEIGHT * Config.GRID_ROW);

    self.grids = [];
    self.balls = [];

    for (var i = 0; i <  Config.GRID_ROW; i++) {
      var gridRow = [];
      var ballRow = [];
      for (var j = 0; j < Config.GRID_COL; j++) {
        var x1 = left + j * Config.GRID_WIDTH;
        var y1 = top + i * Config.GRID_HEIGHT;
        var grid = new Grid(i, j, x1, y1, self);
        var ball = new Ball(i, j, x1 + 1, y1 + 1, self);
        gridRow.push(grid);
        ballRow.push(ball);
      }
      self.grids.push(gridRow);
      self.balls.push(ballRow);
    }

    self.drawBalls();
  },

  drawBalls: function() {
    var self = this;
    var colors = [];
    var remain = 0;

    for (var i = 0; i < 3; i++) {
      /*do {
        var color = Ball.getColor();
      } while (colors.indexOf(color) >= 0);
      colors.push(color);*/
      colors.push(Ball.getColor());
    }

    for (var i = 0; i <  Config.GRID_ROW; i++) {
      for (var j = 0; j < Config.GRID_COL; j++) {
        if (!self.balls[i][j].hasBall) remain++;
      }
    }

    for (var i = 0; i < (remain < 3 ? remain : 3); i++) {
      do {
        var x = ~~(Config.GRID_ROW * Math.random());
        var y = ~~(Config.GRID_COL * Math.random());
      } while (self.balls[x][y].hasBall);

      self.balls[x][y].set(colors[i]);
    }

    self.check();
  },

  selectBall: function(row, col) {
    var self = this;

    self.srcTile.row = row;
    self.srcTile.col = col;
  },

  selectGrid: function(row, col) {
    var self = this;
    var srcTile = self.srcTile;
    var destTile = self.destTile;

    if (typeof srcTile.row == 'undefined') return;

    self.destTile.row = row;
    self.destTile.col = col;

    var tileMap = [];
    for (var i = 0; i <  Config.GRID_ROW; i++) {
      var row = [];
      for (var j = 0; j < Config.GRID_COL; j++) {
        if (self.balls[i][j].hasBall) {
          row.push(0);
        } else {
          row.push(1);
        }
      }
      tileMap.push(row);
    }

    var graph = new Graph(tileMap);
    var start = graph.grid[srcTile.row][srcTile.col];
    var end = graph.grid[destTile.row][destTile.col];
    var path = astar.search(graph, start, end);

    if (path.length) {
      self.lock = true;
      self.rect.kill();

      var color = self.balls[srcTile.row][srcTile.col].color;
      var i = 0;
      var int = setInterval(function() {
        if (i >= path.length) {
          clearInterval(int);
          self.lock = false;
          self.srcTile = {};

          if (!self.clearBalls()) self.drawBalls();
          return;
        }

        var node = path[i];
        if (i == 0) {
          self.balls[srcTile.row][srcTile.col].killBall();
        }
        if (i > 0) {
          var lastNode = path[i - 1];
          self.balls[lastNode.x][lastNode.y].killBall();
        }
        self.balls[node.x][node.y].set(color);
        i++;

        self.jummpSound.play();
      }, 100);
    }
  },

  clearBalls: function() {
    var self = this;
    var balls = self.balls;
    var destTile = self.destTile;
    var ball = balls[destTile.row][destTile.col];
    var lines = [];

    var line = [];
    for (var j = ball.col; j >= 0; j--) {
      var _ball = balls[ball.row][j];
      if (_ball.color == ball.color) {
        line.push(_ball);
      } else {
        break;
      }
    }
    for (var j = ball.col + 1; j < Config.GRID_COL; j++) {
      _ball = balls[ball.row][j];
      if (_ball.color == ball.color) {
        line.push(_ball);
      } else {
        break;
      }
    }
    if (line.length >= 5) lines.push(line);

    line = [];
    for (var i = ball.row, j = ball.col; i >= 0 && j >= 0; i--, j--) {
      _ball = balls[i][j];
      if (_ball.color == ball.color) {
        line.push(_ball);
      } else {
        break;
      }
    }
    for (var i = ball.row + 1, j = ball.col + 1; i < Config.GRID_ROW && j < Config.GRID_COL; i++, j++) {
      _ball = balls[i][j];
      if (_ball.color == ball.color) {
        line.push(_ball);
      } else {
        break;
      }
    }
    if (line.length >= 5) lines.push(line);

    line = [];
    for (var i = ball.row; i >=0; i--) {
      _ball = balls[i][ball.col];
      if (_ball.color == ball.color) {
        line.push(_ball);
      } else {
        break;
      }
    }
    for (var i = ball.row + 1; i < Config.GRID_ROW; i++) {
      _ball = balls[i][ball.col];
      if (_ball.color == ball.color) {
        line.push(_ball);
      } else {
        break;
      }
    }
    if (line.length >= 5) lines.push(line);

    line = [];
    for (var i = ball.row, j = ball.col; i >= 0 && j < Config.GRID_COL; i--, j++) {
      _ball = balls[i][j];
      if (_ball.color == ball.color) {
        line.push(_ball);
      } else {
        break;
      }
    }
    for (var i = ball.row + 1, j = ball.col - 1; i < Config.GRID_ROW && j >= 0; i++, j--) {
      _ball = balls[i][j];
      if (_ball.color == ball.color) {
        line.push(_ball);
      } else {
        break;
      }
    }
    if (line.length >= 5) lines.push(line);

    if (lines.length) {
      var score = 0;

      lines.forEach(function(line) {
        score += (line.length - 4) * 50;

        line.forEach(function(ball) {
          ball.killBall();
        });
      });

      self.scoreText.setText('SCORE: ' + (self.score += score));

      self.dismissSound.play();
    }

    return !!lines.length;
  },

  check: function() {
    var self = this;
    var failed = true;

    loop:
    for (var i = 0; i <  Config.GRID_ROW; i++) {
      for (var j = 0; j < Config.GRID_COL; j++) {
        if (!self.balls[i][j].hasBall) {
          failed = false;
          break loop;
        }
      }
    }

    if (failed) self.face.frame = 0;
  }

};

var Grid = function(row, col, offsetX, offsetY, ctx) {
  var self = this;

  self.row = row;
  self.col = col;
  self.offsetX = offsetX;
  self.offsetY = offsetY;
  self.ctx = ctx;

  self.sp = ctx.add.sprite(self.offsetX, self.offsetY, 'grid');
  self.init();
};

Grid.prototype.init = function() {
  var self = this;

  self.sp.inputEnabled = true;
  self.sp.input.useHandCursor = true;
  self.sp.events.onInputDown.add(self.onDown, self);
};

Grid.prototype.onDown = function() {
  var self = this;

  if (self.ctx.lock) return;

  self.ctx.selectGrid(self.row, self.col);
};

var Ball = function(row, col, offsetX, offsetY, ctx) {
  var self = this;

  self.row = row;
  self.col = col;
  self.offsetX = offsetX;
  self.offsetY = offsetY;
  self.ctx = ctx;

  self.hasBall = false;
};

Ball.prototype.init = function() {
  var self = this;

  self.sp.inputEnabled = true;
  self.sp.input.useHandCursor = true;
  self.sp.events.onInputDown.add(self.onDown, self);
};

Ball.prototype.onDown = function() {
  var self = this;

  if (self.ctx.lock) return;

  self.ctx.rect && self.ctx.rect.kill();

  self.ctx.rect = self.ctx.add.graphics();
  self.ctx.rect.lineStyle(2, 0xFF0000, 1);
  self.ctx.rect.drawRect(self.offsetX, self.offsetY, 60, 60);

  self.ctx.selectBall(self.row, self.col);
};

Ball.prototype.set = function(color) {
  var self = this;

  !color && (color = Ball.getColor());

  self.sp = self.ctx.add.sprite(self.offsetX, self.offsetY, 'ball', Config.BALL[color]);
  self.color = color;
  self.hasBall = true;
  self.init();
};

Ball.prototype.killBall = function() {
  var self = this;

  self.color = undefined;
  self.hasBall = false;
  self.sp.kill();
};

Ball.getColor = function() {
  var colors = [
    'RED',
    'ORANGE',
    'YELLOW',
    'GREEN',
    'BLUE',
    'PURPLE',
    'GRAY'
  ];

  return colors[~~(7 * Math.random())];
};
