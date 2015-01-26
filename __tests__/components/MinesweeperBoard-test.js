jest.autoMockOff();

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var SquareValue = require('../../src/minesweeper/Constants').SquareValue;
var SquareState = require('../../src/minesweeper/Constants').SquareState;
var GameStatus = require('../../src/minesweeper/Constants').GameStatus;

var GameEngine = require('../../src/minesweeper/GameEngine');
var MinesweeperBoardFactory = require('../../src/minesweeper/components/MinesweeperBoardFactory.jsx');

describe('MinesweeperBoard', function() {
  it('can render a board', function() {
    var MockSquare = React.createClass({
      render: function() {
        return <div className="minesweeper-square" />;
      }
    });
    var MinesweeperBoard = MinesweeperBoardFactory.create(MockSquare);
    var width = 10;
    var height = 5;
    var size = 30;
    var board = GameEngine.generateEmptyBoard(width, height);
    var minesweeperBoard = TestUtils.renderIntoDocument(
      <MinesweeperBoard width={size} status={GameStatus.IN_PROGRESS} board={board} />
    );
    var squares = TestUtils.scryRenderedComponentsWithType(minesweeperBoard, MockSquare);
    expect(squares.length).toBe(width * height);
    var rows = TestUtils.scryRenderedDOMComponentsWithClass(minesweeperBoard, 'minesweeper-row');
    expect(rows.length, height);
  });
});
