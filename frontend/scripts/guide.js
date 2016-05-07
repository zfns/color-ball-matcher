var Config = window.G.Config;
var State = window.G.State;

State.guide = function (game) {};

State.guide.prototype = {

  init: function () {
    var self = this;
    self.add.image(0, 0, 'bg2');
  },

  preload: function () {

  },

  create: function () {
    var self = this;
    var btnBack = self.add.button(self.world.centerX, self.world.centerY + 200, 'btn', self.back, self, 5, 4);
    btnBack.anchor = { x: 0.5, y: 0.5 };

    self.add.text(120, 180, Config.GAME_GUIDE.join('\n'), { font: '20px Arial', fontStyle: 'oblique', fill: '#fff' });
  },

  back: function() {
    var self = this;
    self.state.start('Menu');
  }

};
