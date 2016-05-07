var State = window.G.State;

State.menu = function (game) {};

State.menu.prototype = {

  init: function () {
    var self = this;
    self.add.image(0, 0, 'bg');
  },

  preload: function () {

  },

  create: function () {
    var self = this;

    var btnStart = self.add.button(self.world.centerX, self.world.centerY + 30, 'btn', self.start, self, 1, 0);
    var btnHow2Play = self.add.button(self.world.centerX, self.world.centerY + 160, 'btn', self.guide, self, 3, 2);
    btnStart.anchor = { x: 0.5, y: 0.5 };
    btnHow2Play.anchor = { x: 0.5, y: 0.5 };
  },

  start: function() {
    this.state.start('Game');
  },

  guide: function() {
    this.state.start('Guide');
  }

};
