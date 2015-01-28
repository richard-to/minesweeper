var EventEmitter = require('events').EventEmitter;

var _ = require('lodash');

var SquareValue = require('./Constants').SquareValue;
var SquareState = require('./Constants').SquareState;
var GameStatus = require('./Constants').GameStatus;
var Mode = require('./Constants').Mode;
var GameEngine = require('./GameEngine');

var CHANGE_EVENT = 'change';

var defaultOptions = {
  width: 500,
  numRows: 10,
  numCols: 10,
  numMines: 10
};

module.exports = {
  create: function(userOptions) {
    var status = GameStatus.NOT_STARTED;
    var board = null;
    var mode = Mode.DIG;
    var options = _.clone(defaultOptions);

    var gameState = _.assign({}, EventEmitter.prototype, {
      options: _.clone(defaultOptions),

      updateOptions: function(userOptions) {
        if (_.isPlainObject(userOptions)) {
          _.assign(options, userOptions);
        }
      },

      getWidth: function() {
        return options.width;
      },

      getNumMines: function() {
        return options.numMines;
      },

      getBoard: function() {
        return _.cloneDeep(board);
      },

      getMode: function() {
        return mode;
      },

      getStatus: function() {
        return status;
      },

      changeToFlagMode: function() {
        mode = Mode.FLAG;
        this.emitChange();
      },

      changeToDigMode: function() {
        mode = Mode.DIG;
        this.emitChange();
      },

      resetBoard: function() {
        status = GameStatus.NOT_STARTED;
        board = GameEngine.generateRandomBoard(
          options.numRows, options.numCols, options.numMines);
        this.emitChange();
      },

      activateSquare: function(y, x) {
        if (status === GameStatus.NOT_STARTED) {
          status = GameStatus.IN_PROGRESS;
        }

        if (GameEngine.isSquareFlagged(board[y][x])) {
          board = GameEngine.updateBoardSquare(
            board, y, x, GameEngine.hideSquare(board[y][x]));
        } else if (mode === Mode.FLAG) {
          board = GameEngine.updateBoardSquare(
            board, y, x, GameEngine.flagSquare(board[y][x]));
        } else if (GameEngine.checkSquareForMine(board[y][x])) {
          board = GameEngine.updateBoardSquare(
            board, y, x, GameEngine.showSquare(board[y][x]));
          status = GameStatus.LOST;
        } else {
          board = GameEngine.revealSquares(board, y, x);
          if (GameEngine.checkWinner(board)) {
            status = GameStatus.WON;
          }
        }
        this.emitChange();
      },

      countFlags: function(board) {
        return GameEngine.countState(board, SquareState.FLAG);
      },

      emitChange: function(e) {
        this.emit(CHANGE_EVENT, e);
      },

      addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
      },

      removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
      }
    });


    gameState.updateOptions(userOptions);
    gameState.resetBoard();

    return gameState;
  }
};