var React = require('react/addons');
var GameFactory = require('./minesweeper/GameFactory');
var AppFactory = require('./minesweeper/AppFactory.jsx');
var MinesweeperGame = GameFactory.create();

MinesweeperApp = React.createFactory(AppFactory.create(MinesweeperGame));
React.render(MinesweeperApp(), document.getElementById('minesweeper-app'));