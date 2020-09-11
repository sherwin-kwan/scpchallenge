const async = require('async');
const Team = require('../models/team');
const Player = require('../models/player');

// Display list of all Teams.
exports.team_list = function (req, res, next) {
  Team.find({}, 'city teamName league conference division')
  .populate('league')
  .exec((err, results) => {
    if (err) {
      return next(err);
    } else {
      console.log(results);
      res.render('team_list.pug', { title: 'All Teams', all_teams: results });
    }
  })
};

// Display detail page for a specific Team, including Players on that Team
exports.team_detail = function (req, res, next) {
  async.parallel({
    team_detail: function (callback) {
      Team.findById(req.params.id)
        .populate('league')
        .exec(callback);
    },
    player_list: function (callback) {
      Player.find( {'team': req.params.id})
        .exec(callback);
    }
  }, // Here's the main callback function that results are passed to
    function (err, results) {
      if (err) {
        return next(err);
      } else if (!(results.team_detail)) { // The team cannot be found
        const err = new Error('This team ID is invalid');
        err.status = 404;
        return next(err);
      } else {
        res.render('team_detail.pug', { title: `${results.team_detail.teamName} Roster`, team_detail: results.team_detail, 
        player_list: results.player_list });
      };
    }
  );
};

// Display Team create form on GET.
exports.team_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Team create GET');
};

// Handle Team create on POST.
exports.team_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Team create POST');
};

// Display Team delete form on GET.
exports.team_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Team delete GET');
};

// Handle Team delete on POST.
exports.team_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Team delete POST');
};

// Display Team update form on GET.
exports.team_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Team update GET');
};

// Handle Team update on POST.
exports.team_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Team update POST');
};