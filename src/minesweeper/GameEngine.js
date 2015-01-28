var SquareValue = require('./Constants').SquareValue;
var SquareState = require('./Constants').SquareState;

var _ = require('lodash');

var ADJACENT_SQUARES = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

module.exports = {
  createSquare: function(value, state) {
    return {
      value: value,
      state: state,
    };
  },
  createMineSquare: function() {
    return this.createSquare(SquareValue.MINE, SquareState.HIDDEN);
  },
  createEmptySquare: function() {
    return this.createSquare(SquareValue.EMPTY, SquareState.HIDDEN);
  },
  hideSquare: function(square) {
    return this.createSquare(square.value, SquareState.HIDDEN);
  },
  showSquare: function(square) {
    return this.createSquare(square.value, SquareState.VISIBLE);
  },
  flagSquare: function(square) {
    return this.createSquare(square.value, SquareState.FLAG);
  },
  isSquareFlagged: function(square) {
    return square.state === SquareState.FLAG;
  },
  checkSquareForMine: function(square) {
    return square.value === SquareValue.MINE;
  },
  generateEmptyBoard: function(width, height) {
    var board = [];
    for (var y = 0; y < height; ++y) {
      board[y] = [];
      for (var x = 0; x < width; ++x) {
        board[y][x] = this.createEmptySquare();
      };
    }
    return board;
  },
  generateMines: function(board, numMines) {
    var width = board[0].length;
    var height = board.length;
    if (numMines > width * height) {
      throw "Number of mines is greater than board size";
    }
    var clonedBoard = _.cloneDeep(board);
    for (var mineCount = 0; mineCount < numMines; ++mineCount) {
      while (true) {
        var y = Math.floor(Math.random() * height);
        var x = Math.floor(Math.random() * width);
        if (clonedBoard[y][x].value === SquareValue.EMPTY) {
          clonedBoard[y][x] = this.createMineSquare();
          break;
        }
      }
    }
    return clonedBoard;
  },
  countAdjacentMines: function(board, y, x) {
    return ADJACENT_SQUARES.map(function(offset) {
      var minesFound = 0;
      try {
        if (board[y + offset[0]][x + offset[1]].value === SquareValue.MINE) {
          minesFound = 1;
        }
      } catch (error) {}
      return minesFound;
    }).reduce(function(mineCount, hasMine) {
      return mineCount + hasMine;
    });
  },
  generateAdjacencyDigits: function(board) {
    return board.map(function(row, y) {
      return row.map(function(square, x) {
        if (square.value === SquareValue.EMPTY) {
          return this.createSquare(this.countAdjacentMines(board, y, x), SquareState.HIDDEN);
        } else {
          return _.clone(square);
        }
      }.bind(this));
    }.bind(this));
  },
  generateRandomBoard: function(width, height, mines) {
    var board = this.generateEmptyBoard(width, height);
    board = this.generateMines(board, mines);
    return this.generateAdjacencyDigits(board);
  },
  revealSquares: function(board, y, x) {
    var clonedBoard = _.cloneDeep(board);
    var _revealSquares = function(board, y, x) {
      if (board[y][x].state === SquareState.VISIBLE || board[y][x].state === SquareState.FLAG) {
        return;
      }

      if (board[y][x].value === SquareValue.MINE) {
        return;
      }

      board[y][x].state = SquareState.VISIBLE;

      if (board[y][x].value === SquareValue.EMPTY) {
        ADJACENT_SQUARES.forEach(function(offset) {
          try {
            _revealSquares(board, y + offset[0], x + offset[1]);
          } catch (error) {}
        });
      }
    };

    _revealSquares(clonedBoard, y, x);

    return clonedBoard;
  },
  updateBoardSquare: function(board, y, x, square) {
    var clonedBoard = _.cloneDeep(board);
    clonedBoard[y][x] = square;
    return clonedBoard;
  },
  revealSafeSquares: function(board) {
    return board.map(function(row) {
      return row.map(function(square) {
        if (square.value !== SquareValue.MINE) {
          return this.showSquare(square);
        } else {
          return _.clone(square);
        }
      }.bind(this));
    }.bind(this));
  },
  checkWinner: function(board) {
    return !_.flatten(board).some(function(square) {
      return square.value !== SquareValue.MINE && square.state !== SquareState.VISIBLE;
    });
  },
  countState: function(board, state) {
    return _.flatten(board).reduce(function(count, square) {
      return count + ((square.state === state) ? 1 : 0);
    }, 0);
  },
  countValue: function(board, value) {
    return _.flatten(board).reduce(function(count, square) {
      return count + ((square.value === value) ? 1 : 0);
    }, 0);
  }
};
