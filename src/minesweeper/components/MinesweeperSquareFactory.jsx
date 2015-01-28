var React = require('react/addons');

var SquareValue = require('../Constants').SquareValue;
var SquareState = require('../Constants').SquareState;

var ClassSet = React.addons.classSet;

module.exports = {
  create: function(activateSquare) {
    return React.createClass({
      render: function() {

        var classes = ClassSet({
          'minesweeper-square': true,
          'minesweeper-square-visible': this.props.visible || this.props.state === SquareState.VISIBLE,
          'noselect': true,
          'mine-found': this.props.value === SquareValue.MINE && this.props.visible && this.props.state === SquareState.VISIBLE
        });

        var styles = {
          width: this.props.size,
          height: this.props.size,
          lineHeight: this.props.size
        }

        if (this.props.visible || this.props.state === SquareState.VISIBLE) {
          return <div className={classes} style={styles}>{this.renderValue(this.props.value)}</div>;
        } else if (this.props.state === SquareState.FLAG) {
          return (
            <div className={classes} style={styles} onClick={this.handleClick}>
              <i className="fa fa-fw fa-flag flag"></i>
            </div>
          );
        } else {
          return <div className={classes} style={styles} onClick={this.handleClick}>&nbsp;</div>;
        }
      },
      renderValue: function(value) {
        if (value === SquareValue.EMPTY) {
          return <span>&nbsp;</span>;
        } else if (value === SquareValue.MINE) {
          return <i className="fa fa-fw fa-beer mine"></i>;
        } else {
          return <span>{value}</span>;
        }
      },
      handleClick: function(e) {
        activateSquare(this.props.y, this.props.x);
      }
    });
  }
}

