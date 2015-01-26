var React = require('react/addons');

var GameStatus = require('../Constants').GameStatus;

module.exports = {
  create: function(MinesweeperSquare) {
    return React.createClass({
      render: function() {
        var minesweeperRows = [];
        var size = Math.floor(this.props.width / this.props.board[0].length).toString() + "px";
        var minesweeperRows = this.props.board.map(function(row, y) {
          return <div key={"row" + y} className="minesweeper-row">{this.renderRow(row, y, size)}</div>;
        }.bind(this));
        return <div className="minesweeper-board">{minesweeperRows}</div>
      },
      renderRow: function(row, y, size) {
        return row.map(function(square, x) {
          return <MinesweeperSquare
            key={"y" + y + "x" + x}
            size={size}
            visible={this.props.status === GameStatus.LOST}
            state={square.state}
            value={square.value}
            x={x} y={y} />;
        }.bind(this));
      }
    });
  }
}