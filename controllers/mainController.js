const express = require('express');
const Player = require('../models/player.js');
const Team = require('../models/team.js');
const async = require('async');


// Test code for directly accessing the database and doing 1 query
exports.xyz = function (req, res) {
  Player.countDocuments({}, (err, results) => {
    console.log(`There are ${results} players!`);
    res.render('index.pug', { title: 'Stanley Cup Playoffs Challenge Homepage', error: err, data: results })
  });
}

// This is the code that appears on the actual homepage, there are 2 queries which make up the data to be displayed
exports.homePage = function (req, res) {
  async.parallel({ // For documentation on this, see: https://caolan.github.io/async/v3/docs.html
    team_count: function (callback) {
      Team.countDocuments({}, callback);
    },
    player_count: function (callback) {
      Player.countDocuments({}, callback);
    }
  },
    // Above, the Team.countDocuments and Player.countDocuments methods (from module "mongoose") query the database for the total number of teams and players
    // Assuming there's no error, this number is passed to the variable "callback", and then async.parallel, once both results have been received from the database
    // will create an object {team_count: XXXX, player_count: XXX} and this is passed to the final function as "results". (If there is an error, then it is instead
    // passed as "err")
    function (err, results) {
      res.render('index.pug', { title: 'Stanley Cup Playoffs Challenge Homepage', error: err, data: results });
    });
}
