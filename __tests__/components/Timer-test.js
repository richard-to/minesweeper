jest.autoMockOff();

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var TimerStatus = require('../../src/minesweeper/Constants').TimerStatus;
var Timer = require('../../src/minesweeper/components/Timer.jsx');

describe('Timer', function() {
  it('starts off as stopped', function() {
    var timer = TestUtils.renderIntoDocument(
      <Timer status={TimerStatus.STOP} reset={false} />
    );

    expect(setTimeout.mock.calls.length).toBe(0);

    var div = TestUtils.findRenderedDOMComponentWithTag(timer, 'div');
    expect(div.getDOMNode().textContent).toEqual('0.0 sec');
  });

  // TODO(richard-to): Why is timer called 4 times here for 2.0 seconds? Doesn't make sense.
  it('starts off as started, then reset to 0, then start', function() {

    var timer = TestUtils.renderIntoDocument(<Timer status={TimerStatus.START} reset={false} />);
    var div = TestUtils.findRenderedDOMComponentWithTag(timer, 'div');

    jest.runOnlyPendingTimers();
    expect(setTimeout.mock.calls.length).toBe(4);
    expect(setTimeout.mock.calls[0][1]).toBe(1000);
    expect(div.getDOMNode().textContent).toEqual('2.0 sec');

    timer.setProps({status: TimerStatus.STOP, reset: true});
    expect(div.getDOMNode().textContent).toEqual('0.0 sec');

    timer.setProps({status: TimerStatus.START, reset: false});
    jest.runOnlyPendingTimers();
    expect(setTimeout.mock.calls.length).toBe(6);
    expect(setTimeout.mock.calls[0][1]).toBe(1000);
    expect(div.getDOMNode().textContent).toEqual('2.0 sec');
  });
});
