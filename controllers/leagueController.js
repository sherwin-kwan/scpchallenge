const League = require('../models/league.js');
const Team = require('../models/team.js');
const async = require('async');

// Display list of all Leagues.
exports.league_list = function (req, res, next) {
  League.find({}, 'league league_short sport')
  .exec( (err, results) => {
    if (err) {
      return next(err);
    } else {
      res.render('league_list.pug', {title: 'All Leagues', all_leagues: results});
    }
  } )
};

// Display detail page for a specific League.
exports.league_detail = function (req, res, next) {
  async.parallel( {
      league_detail: function (callback) {
        League.findById(req.params.id)
        .exec(callback);
      },
      team_list: function (callback) {
        Team.find({'league': req.params.id})
        .exec(callback);
      },
    }, // Main callback function
    function (err, results) {
      if (err) {
        return next(err);
      } else {
        res.render('league_detail.pug', {title: results.league_detail.league, league_detail: results.league_detail, team_list: results.team_list} );
      }
    }
  )
};

// Display League create form on GET.
exports.league_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: League create GET');
};

// Handle League create on POST.
exports.league_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: League create POST');
};

// Display League delete form on GET.
exports.league_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: League delete GET');
};

// Handle League delete on POST.
exports.league_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: League delete POST');
};

// Display League update form on GET.
exports.league_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: League update GET');
};

// Handle League update on POST.
exports.league_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: League update POST');
};