var SquareValue = require('./Constants').SquareValue;
var SquareState = require('./Constants').SquareState;


var createSquare = function(value, state) {
  return {
    value: value,
    state: state,
  };
};


var cloneSquare = function(square) {
  return createSquare(square.value, square.state);
};


var createMineSquare = function() {
  return createSquare(SquareValue.MINE, SquareState.HIDDEN);
};


var createEmptySquare = function() {
  return createSquare(SquareValue.EMPTY, SquareState.HIDDEN);
};


var hideSquare = function(square) {
  return createSquare(square.value, SquareState.HIDDEN);
};


var showSquare = function(square) {
  return createSquare(square.value, SquareState.VISIBLE);
};


var flagSquare = function(square) {
  return createSquare(square.value, SquareState.FLAG);
};


var isSquareFlagged = function(square) {
  return square.state === SquareState.FLAG;
};

var checkSquareForMine = function(square) {
  return square.value === SquareValue.MINE;
};


var generateEmptyBoard = function(width, height) {
  var board = [];
  for (var y = 0; y < height; ++y) {
    board[y] = [];
    for (var x = 0; x < width; ++x) {
      board[y][x] = createEmptySquare();
    };
  }
  return board;
};


var getBoardSize = function(board) {
  return {
    width: board[0].length,
    height: board.length
  };
};


var cloneBoard = function(board) {
  var clonedBoard = [];
  var size = getBoardSize(board);
  for (var y = 0; y < size.height; ++y) {
    clonedBoard[y] = [];
    for (var x = 0; x < size.width; ++x) {
      clonedBoard[y][x] = cloneSquare(board[y][x]);
    };
  }
  return clonedBoard;
};


var generateMines = function(board, numMines) {
  var size = getBoardSize(board);
  if (numMines > size.width * size.height) {
    throw "Number of mines is greater than board size";
  }

  var clonedBoard = cloneBoard(board);
  for (var mineCount = 0; mineCount < numMines; ++mineCount) {
    while (true) {
      var y = Math.floor(Math.random() * size.height);
      var x = Math.floor(Math.random() * size.width);
      if (clonedBoard[y][x].value === SquareValue.EMPTY) {
        clonedBoard[y][x] = createMineSquare();
        break;
      }
    }
  }
  return clonedBoard;
};


var countAdjacentMines = function(board, y, x) {
  var adjacentSquares = [
    [-1, -1], [-1, 0], [-1, 1],
    [ 0, -1],          [ 0, 1],
    [ 1, -1], [ 1, 0], [ 1, 1],
  ];
  var mineCount = 0;
  for (var i = 0; i < adjacentSquares.length; ++i) {
    try {
      var adjacentY = y + adjacentSquares[i][0];
      var adjacentX = x + adjacentSquares[i][1];
      if (board[adjacentY][adjacentX].value === SquareValue.MINE) {
        ++mineCount;
      }
    } catch (error) {}
  }
  return mineCount;
};


var generateAdjacencyDigits = function(board) {
  var clonedBoard = cloneBoard(board);
  var size = getBoardSize(clonedBoard);
  for (var y = 0; y < size.height; ++y) {
    for (var x = 0; x < size.width; ++x) {
      if (clonedBoard[y][x].value === SquareValue.EMPTY) {
        clonedBoard[y][x] = createSquare(
          countAdjacentMines(board, y, x),
          SquareState.HIDDEN
        );
      }
    };
  }
  return clonedBoard;
};


var generateRandomBoard = function(width, height, mines) {
  var board = generateEmptyBoard(width, height);
  board = generateMines(board, mines);
  return generateAdjacencyDigits(board);
};


var revealSquares = function(board, y, x) {
  var clonedBoard = cloneBoard(board);
  var adjacentSquares = [
    [-1, -1], [-1, 0], [-1, 1],
    [ 0, -1],          [ 0, 1],
    [ 1, -1], [ 1, 0], [ 1, 1],
  ];

  var _revealSquares = function(board, y, x) {
    if (board[y][x].state === SquareState.VISIBLE || board[y][x].state === SquareState.FLAG) {
      return;
    }

    if (board[y][x].value === SquareValue.MINE) {
      return;
    }

    board[y][x].state = SquareState.VISIBLE;

    if (board[y][x].value === SquareValue.EMPTY) {
      for (var i = 0; i < adjacentSquares.length; ++i) {
        try {
          var adjacentY = y + adjacentSquares[i][0];
          var adjacentX = x + adjacentSquares[i][1];
          _revealSquares(board, adjacentY, adjacentX);
        } catch (error) {}
      }
    }
  };

  _revealSquares(clonedBoard, y, x);

  return clonedBoard;
};

var checkWinner = function(board) {
  var size = getBoardSize(board);
  for (var y = 0; y < size.height; ++y) {
    for (var x = 0; x < size.width; ++x) {
      if (board[y][x].value !== SquareValue.MINE && board[y][x].state !== SquareState.VISIBLE) {
        return false;
      }
    }
  }
  return true;
};


var countState = function(board, state) {
  var size = getBoardSize(board);
  var stateCount = 0;
  for (var y = 0; y < size.height; ++y) {
    for (var x = 0; x < size.width; ++x) {
      if (board[y][x].state === state) {
        ++stateCount;
      }
    }
  }
  return stateCount;
};


module.exports = {
  createSquare: createSquare,
  cloneSquare: cloneSquare,
  createEmptySquare: createEmptySquare,
  createMineSquare: createMineSquare,
  isSquareFlagged: isSquareFlagged,
  checkSquareForMine: checkSquareForMine,
  hideSquare: hideSquare,
  showSquare: showSquare,
  flagSquare: flagSquare,
  generateEmptyBoard: generateEmptyBoard,
  getBoardSize: getBoardSize,
  generateMines: generateMines,
  cloneBoard: cloneBoard,
  countAdjacentMines: countAdjacentMines,
  generateAdjacencyDigits: generateAdjacencyDigits,
  generateRandomBoard: generateRandomBoard,
  revealSquares: revealSquares,
  checkWinner: checkWinner,
  countState: countState
};

