var G = window.G = {};

G.Config = {
  GAME_WIDTH: 700,
  GAME_HEIGHT: 770,

  GRID_WIDTH: 62,
  GRID_HEIGHT: 62,
  GRID_ROW: 10,
  GRID_COL: 10,

  GAME_GUIDE: [
    'Click to select the ball ,',
    'and click the empty tile to move the selected ball there .',
    'Once at least 5 consecutive balls',
    'which have the same color are on the same line ,',
    'then the balls will be cleared away .',
    'If no balls are cleared away after you move the ball ,',
    'there is going to be 3 new balls on the board .',
    'If there is no empty space , the game is over .',
    'Enjoy yourself !'
  ],

  BOARD_TOP: 100,

  BALL: {
    RED: 0,
    ORANGE: 1,
    YELLOW: 2,
    GREEN: 3,
    BLUE: 4,
    PURPLE: 5,
    GRAY: 6
  }
};

G.State = {};
