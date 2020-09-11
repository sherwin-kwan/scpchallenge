const Player = require('../models/player');
const Team = require('../models/team');
const async = require('async');


// Display list of all Players.
exports.player_list = function (req, res, next) {
  Player.find({}, 'firstName lastName team jersey_number position')
  .populate('team')
  .exec((err, results) => {
    if (err) {
      return next(err)
    } else {
      console.log(results);
      res.render('player_list.pug', { title: 'All Players', all_players: results });
    }
  })
};

// Display detail page for a specific Player.
exports.player_detail = function (req, res) {
  res.send('Player pages are under construction' + req.params.id);
};

// Display Player create form on GET.
exports.player_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Player create GET');
};

// Handle Player create on POST.
exports.player_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Player create POST');
};

// Display Player delete form on GET.
exports.player_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Player delete GET');
};

// Handle Player delete on POST.
exports.player_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Player delete POST');
};

// Display Player update form on GET.
exports.player_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Player update GET');
};

// Handle Player update on POST.
exports.player_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Player update POST');
};