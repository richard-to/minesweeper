jest.autoMockOff();

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var SquareValue = require('../../src/minesweeper/Constants').SquareValue;
var SquareState = require('../../src/minesweeper/Constants').SquareState;

var MinesweeperSquareFactory = require('../../src/minesweeper/components/MinesweeperSquareFactory.jsx');

describe('MinesweeperSquare', function() {

  it('can respond to click event', function() {
    var expectedX = 10;
    var expectedY = 5;
    var loggedX = null;
    var loggedY = null;

    runs(function() {
      var MinesweeperSquare = MinesweeperSquareFactory.create(function(y, x) {
        loggedX = x;
        loggedY = y;
      });

      var minesweeperSquare = TestUtils.renderIntoDocument(
        <MinesweeperSquare
            key="y0x0"
            size={30}
            visible={false}
            value={SquareValue.MINE}
            state={SquareState.HIDDEN}
            x={expectedX} y={expectedY} />
      );

      var div = TestUtils.findRenderedDOMComponentWithTag(
        minesweeperSquare, 'div');

      TestUtils.Simulate.click(div);
    });

    waitsFor(function() {
      return loggedX && loggedY;
    }, "LoggedX and LoggedY should be set", 200);

    runs(function() {
      expect(loggedX).toBe(expectedX);
      expect(loggedY).toBe(expectedY);
    });
  });

  it('can render a hidden square', function() {
    var MinesweeperSquare = MinesweeperSquareFactory.create(function(x, y) {});
    var minesweeperSquare = TestUtils.renderIntoDocument(
      <MinesweeperSquare
          key="y0x0"
          size={30}
          visible={false}
          value={SquareValue.MINE}
          state={SquareState.HIDDEN}
          x={0} y={0} />
    );
    var div = TestUtils.findRenderedDOMComponentWithTag(minesweeperSquare, 'div');
    expect(div.getDOMNode().style.width).toEqual('30px');
    expect(div.getDOMNode().style.height).toEqual('30px');
    expect(div.getDOMNode().style.lineHeight).toEqual('30');
    expect(div.getDOMNode().className).toEqual('minesweeper-square noselect');
  });

  it('can render a hidden square with falg', function() {
    var MinesweeperSquare = MinesweeperSquareFactory.create(function(x, y) {});
    var minesweeperSquare = TestUtils.renderIntoDocument(
      <MinesweeperSquare
          key="y0x0"
          size={30}
          visible={false}
          value={SquareValue.MINE}
          state={SquareState.FLAG}
          x={0} y={0} />
    );
    var iTag = TestUtils.findRenderedDOMComponentWithTag(minesweeperSquare, 'i');
    expect(iTag.getDOMNode().className).toEqual('fa fa-fw fa-flag flag');
  });


  it('can render a visible square: empty', function() {
    var MinesweeperSquare = MinesweeperSquareFactory.create(function(x, y) {});
    var minesweeperSquare = TestUtils.renderIntoDocument(
      <MinesweeperSquare
          key="y0x0"
          size={30}
          visible={false}
          value={SquareValue.EMPTY}
          state={SquareState.VISIBLE}
          x={0} y={0} />
    );
    var div = TestUtils.findRenderedDOMComponentWithTag(minesweeperSquare, 'div');
    expect(div.getDOMNode().className).toEqual('minesweeper-square minesweeper-square-visible noselect');
  });

  it('can render a visible square: number', function() {
    var MinesweeperSquare = MinesweeperSquareFactory.create(function(x, y) {});
    var minesweeperSquare = TestUtils.renderIntoDocument(
      <MinesweeperSquare
          key="y0x0"
          size={30}
          visible={false}
          value={8}
          state={SquareState.VISIBLE}
          x={0} y={0} />
    );
    var div = TestUtils.findRenderedDOMComponentWithTag(minesweeperSquare, 'div');
    expect(div.getDOMNode().textContent).toEqual('8');
  });

  it('can render a visible square: mine', function() {
    var MinesweeperSquare = MinesweeperSquareFactory.create(function(x, y) {});
    var minesweeperSquare = TestUtils.renderIntoDocument(
      <MinesweeperSquare
          key="y0x0"
          size={30}
          visible={false}
          value={SquareValue.MINE}
          state={SquareState.VISIBLE}
          x={0} y={0} />
    );
    var iTag = TestUtils.findRenderedDOMComponentWithTag(minesweeperSquare, 'i');
    expect(iTag.getDOMNode().className).toEqual('fa fa-fw fa-beer mine');
  });

  it('can force render a hidden square: mine', function() {
    var MinesweeperSquare = MinesweeperSquareFactory.create(function(x, y) {});
    var minesweeperSquare = TestUtils.renderIntoDocument(
      <MinesweeperSquare
          key="y0x0"
          size={30}
          visible={true}
          value={SquareValue.MINE}
          state={SquareState.HIDDEN}
          x={0} y={0} />
    );
    var iTag = TestUtils.findRenderedDOMComponentWithTag(minesweeperSquare, 'i');
    expect(iTag.getDOMNode().className).toEqual('fa fa-fw fa-beer mine');
  });

  it('can force render a hidden square: mine that was click (losing move)', function() {
    var MinesweeperSquare = MinesweeperSquareFactory.create(function(x, y) {});
    var minesweeperSquare = TestUtils.renderIntoDocument(
      <MinesweeperSquare
          key="y0x0"
          size={30}
          visible={true}
          value={SquareValue.MINE}
          state={SquareState.VISIBLE}
          x={0} y={0} />
    );
    var div = TestUtils.findRenderedDOMComponentWithTag(minesweeperSquare, 'div');
    expect(div.getDOMNode().className).toEqual('minesweeper-square minesweeper-square-visible noselect mine-found');
    var iTag = TestUtils.findRenderedDOMComponentWithTag(minesweeperSquare, 'i');
    expect(iTag.getDOMNode().className).toEqual('fa fa-fw fa-beer mine');
  });
});
