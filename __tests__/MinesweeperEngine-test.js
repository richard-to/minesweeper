jest.autoMockOff();

var _ = require('lodash');

var SquareValue = require('../src/minesweeper/Constants').SquareValue;
var SquareState = require('../src/minesweeper/Constants').SquareState;
var GameEngine = require('../src/minesweeper/GameEngine');

var generate3x3Board = function() {
  var width = 3;
  var height = 3;
  return GameEngine.generateEmptyBoard(width, height);
};

describe('Game Engine', function() {

  it('creates a square', function() {
    var square = GameEngine.createSquare(SquareValue.MINE, SquareState.FLAG);
    expect(square.value).toBe(SquareValue.MINE);
    expect(square.state).toBe(SquareState.FLAG);
  });

  it('clones a square', function() {
    var square = GameEngine.createSquare(SquareValue.MINE, SquareState.FLAG);
    var clonedSquare = _.clone(square);
    expect(square).not.toBe(clonedSquare);
  });

  it('creates a mine square', function() {
    var square = GameEngine.createMineSquare();
    expect(square.value).toBe(SquareValue.MINE);
    expect(square.state).toBe(SquareState.HIDDEN);
  });

  it('creates an empty square', function() {
    var square = GameEngine.createEmptySquare();
    expect(square.value).toBe(SquareValue.EMPTY);
    expect(square.state).toBe(SquareState.HIDDEN);
  });

  it('can make a square visible', function() {
    var square = GameEngine.createMineSquare();
    expect(square.value).toBe(SquareValue.MINE);
    expect(square.state).toBe(SquareState.HIDDEN);

    square = GameEngine.showSquare(square);
    expect(square.value).toBe(SquareValue.MINE);
    expect(square.state).toBe(SquareState.VISIBLE);
  });

  it('can show a square', function() {
    var square = GameEngine.createMineSquare();
    square = GameEngine.flagSquare(square);
    expect(square.value).toBe(SquareValue.MINE);
    expect(square.state).toBe(SquareState.FLAG);

    square = GameEngine.hideSquare(square);
    expect(square.value).toBe(SquareValue.MINE);
    expect(square.state).toBe(SquareState.HIDDEN);
  });

  it('can flag a square', function() {
    var square = GameEngine.createMineSquare();
    expect(square.value).toBe(SquareValue.MINE);
    expect(square.state).toBe(SquareState.HIDDEN);

    square = GameEngine.flagSquare(square);
    expect(square.value).toBe(SquareValue.MINE);
    expect(square.state).toBe(SquareState.FLAG);
  });

  it('creates an empty minesweeper board', function() {
    var width = 20;
    var height = 15;
    var board = GameEngine.generateEmptyBoard(width, height);
    expect(board[0].length).toBe(width);
    expect(board.length).toBe(height);
  });

  it('clones a minesweeper board', function() {
    var width = 10;
    var height = 5;
    var board = GameEngine.generateEmptyBoard(width, height);
    var clonedBoard = _.cloneDeep(board);
    expect(board).not.toBe(clonedBoard);
  });

  it('generates mines on board', function() {
    var width = 10;
    var height = 10;
    var mines = 10;
    var board = GameEngine.generateEmptyBoard(width, height);
    var boardWithMines = GameEngine.generateMines(board, mines);
    var mineCount = GameEngine.countValue(boardWithMines, SquareValue.MINE);
    expect(board[0].length).toBe(width);
    expect(board.length).toBe(height);
    expect(mineCount).toBe(mines);
  });

  describe('Count adjacent mines', function() {
    it('counts adjacent mines: top corner case', function() {
      var board = generate3x3Board();
      board[0][1] = GameEngine.createMineSquare();
      board[1][1] = GameEngine.createMineSquare();
      var adjacentMines = GameEngine.countAdjacentMines(board, 0, 0);
      expect(adjacentMines).toBe(2);
    });

    it('counts adjacent mines: bottom corner case', function() {
      var board = generate3x3Board();
      board[0][0] = GameEngine.createMineSquare();
      board[1][1] = GameEngine.createMineSquare();
      var adjacentMines = GameEngine.countAdjacentMines(board, 2, 2);
      expect(adjacentMines).toBe(1);
    });
    it('counts adjacent mines: no mines', function() {
      var board = generate3x3Board();
      var adjacentMines = GameEngine.countAdjacentMines(board, 0, 0);
      expect(adjacentMines).toBe(0);
    });

    it('counts adjacent mines: center case', function() {
      var board = generate3x3Board();
      board[0][1] = GameEngine.createMineSquare();
      board[2][1] = GameEngine.createMineSquare();
      board[1][2] = GameEngine.createMineSquare();
      var adjacentMines = GameEngine.countAdjacentMines(board, 1, 1);
      expect(adjacentMines).toBe(3);
    });
  });

  describe('Reveal board algorithm', function() {
    /**
     * Example board used for testing (9 represents a mine):
     *
     *  0 0 0 0 0
     *  1 1 1 0 0
     *  1 9 2 1 0
     *  1 2 9 1 0
     *  0 1 1 1 0
     */

    var calculateVisibility = function(board) {
      return board.map(function(row) {
        return row.map(function(square) {
          return square.state === SquareState.VISIBLE;
        });
      });
    };

    var width = 5;
    var height = 5;
    var board = GameEngine.generateEmptyBoard(width, height);

    board[2][1] = GameEngine.createMineSquare();
    board[3][2] = GameEngine.createMineSquare();
    board = GameEngine.generateAdjacencyDigits(board);

    it('reveals board: click empty space', function() {
      var revealedBoard = GameEngine.revealSquares(board, 0, 3);
      var expectedVisibility = [
        [true,  true,  true,  true, true],
        [true,  true,  true,  true, true],
        [false, false, true,  true, true],
        [false, false, false, true, true],
        [false, false, false, true, true],
      ];
      var actualVisibility = calculateVisibility(revealedBoard);
      expect(actualVisibility).toEqual(expectedVisibility);
    });

    it('reveals board: click number', function() {
      var revealedBoard = GameEngine.revealSquares(board, 1, 1);
      var expectedVisibility = [
        [false, false, false, false, false],
        [false, true, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
      ];
      var actualVisibility = calculateVisibility(revealedBoard);
      expect(actualVisibility).toEqual(expectedVisibility);
    });

    it('reveals board: with flag', function() {
      var clonedBoard = _.cloneDeep(board);
      clonedBoard[1][3] = GameEngine.createSquare(SquareValue.EMPTY, SquareState.FLAG);
      clonedBoard[1][4] = GameEngine.createSquare(SquareValue.EMPTY, SquareState.FLAG);

      var revealedBoard = GameEngine.revealSquares(clonedBoard, 4, 4);
      var expectedVisibility = [
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, true, true],
        [false, false, false, true, true],
        [false, false, false, true, true],
      ];
      var actualVisibility = calculateVisibility(revealedBoard);
      expect(actualVisibility).toEqual(expectedVisibility);
    });
  });

  it('can check if square is flagged', function() {
    var board = generate3x3Board();
    board[2][1] = GameEngine.flagSquare(board[2][1]);
    expect(GameEngine.isSquareFlagged(board[2][1])).toBeTruthy();
  });


  it('can check if a mine is encountered', function() {
    var board = generate3x3Board();
    board[2][1] = GameEngine.createMineSquare();
    expect(GameEngine.checkSquareForMine(board[2][1])).toBeTruthy();
  });

  it('can decide if the game has been won: No winner', function() {
    var board = generate3x3Board();
    board[2][1] = GameEngine.createMineSquare();
    expect(GameEngine.checkWinner(board)).toBeFalsy();
  });

  it('can decide if the game has been won: No winner due to flag', function() {
    var board = generate3x3Board();
    board[2][1] = GameEngine.createMineSquare();
    board = GameEngine.revealSafeSquares(board);
    board[0][0] = GameEngine.createMineSquare();
    expect(GameEngine.checkWinner(board)).toBeTruthy();
  });

  it('can decide if the game has been won: Winner', function() {
    var board = generate3x3Board();
    board[2][1] = GameEngine.createMineSquare();
    board = GameEngine.revealSafeSquares(board);
    expect(GameEngine.checkWinner(board)).toBeTruthy();
  });

  it('can count the state of the of board: Flags', function() {
    var board = generate3x3Board();
    board[2][1] = GameEngine.flagSquare(board[2][1]);
    board[2][1] = GameEngine.flagSquare(board[2][1]);
    expect(GameEngine.countState(board, SquareState.FLAG));
  });

  it('can count the state of the of board: Visible', function() {
    var board = generate3x3Board();
    expect(GameEngine.countState(board, SquareState.VISIBLE));
  });
});
