var React = require('react/addons');

module.exports = {
  create: function(countFlags) {
    return React.createClass({
      render: function() {
        return <div className="mine-counter">beers remaining: {this.props.numMines - countFlags(this.props.board)}</div>;
      }
    });
  }
};