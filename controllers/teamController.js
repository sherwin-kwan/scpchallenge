const { nextTick } = require('async');
var Team = require('../models/team');

// Display list of all Teams.
exports.team_list = function(req, res) {
    Team.find({}, 'city teamName league conference division')
      .populate('league')
      .exec( (err, results) => {
        if (err) {
          return next(err);
        } else {
          res.render('team_list.pug', {title: 'All Teams', all_teams: results});
        }
      })
};

// Display detail page for a specific Team.
exports.team_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Team detail: ' + req.params.id);
};

// Display Team create form on GET.
exports.team_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Team create GET');
};

// Handle Team create on POST.
exports.team_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Team create POST');
};

// Display Team delete form on GET.
exports.team_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Team delete GET');
};

// Handle Team delete on POST.
exports.team_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Team delete POST');
};

// Display Team update form on GET.
exports.team_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Team update GET');
};

// Handle Team update on POST.
exports.team_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Team update POST');
};