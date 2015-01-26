var React = require('react/addons');

var TimerStatus = require('../Constants').TimerStatus;

var MS_PER_SECOND = 1000;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      timeElapsed: 0
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.reset) {
      this.setState({timeElapsed: 0});
    }
  },
  componentWillUnmount: function() {
    clearTimeout(this.interval);
  },
  componentDidMount: function() {
    this.runTimer();
  },
  componentDidUpdate: function() {
    this.runTimer();
  },
  runTimer: function () {
    if (this.props.status === TimerStatus.START && this.interval === undefined) {
      this.setState({timeElapsed: 0});
      this.tick();
    }
  },
  tick: function() {
    this.interval = setTimeout(function() {
      if (this.props.status === TimerStatus.STOP) {
        this.interval = undefined;
        return;
      }
      this.setState({timeElapsed: this.state.timeElapsed + 1});
      this.tick();
    }.bind(this), MS_PER_SECOND);
  },
  render: function() {
    return <div className="timer">{this.state.timeElapsed}.0 sec</div>
  }
});