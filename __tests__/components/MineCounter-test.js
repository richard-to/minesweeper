jest.autoMockOff();

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var MineCounterFactory = require('../../src/minesweeper/components/MineCounterFactory.jsx');

describe('MineCounter', function() {
  it('should correctly count the flagged mines', function() {
    var MineCounter = MineCounterFactory.create(function(board) {
        return 5;
    });

    var mineCounter = TestUtils.renderIntoDocument(
      <MineCounter board={[]} numMines={10} />
    );

    var div = TestUtils.findRenderedDOMComponentWithTag(mineCounter, 'div');
    expect(div.getDOMNode().textContent).toEqual('beers remaining: 5');
  });
});
