var React = require('react/addons');

var SquareValue = require('./Constants').SquareValue;
var SquareState = require('./Constants').SquareState;
var GameStatus = require('./Constants').GameStatus;
var Mode = require('./Constants').Mode;
var TimerStatus = require('./Constants').TimerStatus;

var MinesweeperSquareFactory = require('./components/MinesweeperSquareFactory.jsx');
var MineCounterFactory = require('./components/MineCounterFactory.jsx');
var MinesweeperBoardFactory = require('./components/MinesweeperBoardFactory.jsx');

var Timer = require('./components/Timer.jsx');

var ClassSet = React.addons.classSet;


module.exports = {
  create: function(game) {


    var MineCounter = MineCounterFactory.create(game.countFlags);
    var MinesweeperSquare = MinesweeperSquareFactory.create(game.activateSquare.bind(game));
    var MinesweeperBoard = MinesweeperBoardFactory.create(MinesweeperSquare);


    var getState = function() {
      return {
        board: game.getBoard(),
        status: game.getStatus(),
        width: game.getWidth(),
        mode: game.getMode(),
        numMines: game.getNumMines()
      };
    };

    var MinesweeperApp = React.createClass({
      getInitialState: function() {
        return getState();
      },
      componentDidMount: function() {
        game.addChangeListener(this.handleChange);
      },
      componentWillUnmount: function() {
        game.removeChangeListener(this.handleChange);
      },
      handleChange: function() {
        this.setState(getState());
      },
      render: function() {
        var styles = {
          width: this.state.width + "px"
        };

        var classesGavelButton = ClassSet({
          'btn': true,
          'selected': this.state.mode === Mode.DIG
        });

        var classesFlagButton = ClassSet({
          'btn': true,
          'selected': this.state.mode === Mode.FLAG
        });

        var timeStatus = TimerStatus.STOP;
        if (this.state.status === GameStatus.IN_PROGRESS) {
          timeStatus = TimerStatus.START;
        }

        var timeReset = false;
        if (this.state.status === GameStatus.NOT_STARTED) {
          timeReset = true;
        }

        return (
          <div className="container-center" style={styles}>
            <Timer status={timeStatus} reset={timeReset} />
            <div className="panel-btn">
              <button className={classesGavelButton} onClick={this.handleClickDig}>
                <i className="fa fa-gavel"></i> Dig
              </button>
              {' '}
              <button className={classesFlagButton} onClick={this.handleClickFlag}>
                <i className="fa fa-flag"></i> Flag
              </button>
            </div>
            <MineCounter numMines={this.state.numMines} board={this.state.board} />
            <MinesweeperBoard width={this.state.width} status={this.state.status} board={this.state.board} />
            <button className="btn btn-restart" onClick={this.handleClickRestart}>
              <i className="fa fa-refresh"></i> Restart
            </button>
          </div>
        );
      },
      handleClickRestart: function() {
        game.resetBoard();
      },
      handleClickFlag: function() {
        game.changeToFlagMode();
      },
      handleClickDig: function() {
        game.changeToDigMode();
      },
    });


    return MinesweeperApp;
  }
};