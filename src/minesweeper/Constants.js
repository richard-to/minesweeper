var keyMirror = require('react/lib/keyMirror');

module.exports = {
  TimerStatus: keyMirror({
    START: null,
    RUNNING: null,
    STOP: null
  }),
  Mode: keyMirror({
    DIG: null,
    FLAG: null
  }),
  GameStatus: keyMirror({
    NOT_STARTED: null,
    IN_PROGRESS: null,
    WON: null,
    LOSE: null
  }),
  SquareValue: {
    EMPTY: 0,
    MINE: 9
  },
  SquareState: keyMirror({
    HIDDEN: null,
    VISIBLE: null,
    FLAG: null
  })
}