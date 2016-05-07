var State = window.G.State;

State.loader = function (game) {
  var self = this;
  self.progress = '';
};

State.loader.prototype = {

  init: function () {
    var self = this;

    var loading = self.add.sprite(self.world.centerX, self.world.centerY, 'loading');
    loading.anchor = { x: 0.5, y: 0.5 };
    loading.animations.add('loading');
    loading.animations.play('loading', 24, true);

    self.progress = self.add.text(self.world.centerX, self.world.centerY + 90, '0%', { fill: '#fff', fontSize: '16px' });
    self.progress.anchor = { x: 0.5, y: 0.5 };
  },

  preload: function () {
    var self = this;

    self.load.image('bg', 'assets/bg.png');
    self.load.image('bg2', 'assets/bg2.png');
    self.load.spritesheet('btn', 'assets/btn.png', 257, 108);
    self.load.image('grid', 'assets/grid.png');
    self.load.spritesheet('ball', 'assets/ball.png', 60, 60);
    self.load.spritesheet('face', 'assets/face.png', 256, 256);
    self.load.audio('jump', 'assets/jump.wav');
    self.load.audio('dismiss', 'assets/dismiss.wav');

    self.load.onFileComplete.add(function(pro) {
      self.progress.text = pro + '%';
    });
  },

  create: function () {
    this.state.start('Menu');
  }

};
