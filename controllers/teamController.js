const async = require('async');
const Team = require('../models/team');
const Player = require('../models/player');
const League = require('../models/league');
const expVal = require('express-validator');
const team = require('../models/team');

// Display list of all Teams.
exports.team_list = function (req, res, next) {
  Team.find({}, 'city teamName league conference division')
    .populate('league')
    .exec((err, results) => {
      if (err) {
        return next(err);
      } else {
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
      Player.find({ 'team': req.params.id })
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
        const updateUrl = results.team_detail._id + '/update';
        const deleteUrl = results.team_detail._id + '/delete';
        res.render('team_detail.pug', {
          title: `${results.team_detail.teamName} Roster`, team_detail: results.team_detail,
          player_list: results.player_list, update_url: updateUrl, delete_url: deleteUrl
        });
      };
    }
  );
};

// Display Team create form on GET.
exports.team_create_get = function (req, res, next) {
  League.find({}, 'league_short')
    .exec((err, results) => {
      if (err) {
        return next(err);
      } else {
        res.render('team_submit.pug', { title: 'Add New Team', leagues_object: results })
      }
    });
};

// Handle Team create on POST.
exports.team_create_post = [
  // Step 1: sanitizing and validating input
  // Step 2: If errors detected, display error message and have user revise
  // Step 3: Check if user is making a duplicate record. (No two leagues are allowed to have the same name)
  // Step 4: If all checks are passed, create a new league record in the database
  // For reference, the schema is:
  // city: {type: String, required: true, maxLength: 64},
  // teamName: {type: String, maxLength: 64},
  // league: {type: Schema.Types.ObjectId, ref: 'League', required: true},
  // conference: {type: String},
  // division: {type: String},
  expVal.body('city', 'City required and must be no longer than 64 characters').trim().isLength({ min: 1, max: 64 }),
  expVal.sanitizeBody('city').escape(),
  expVal.body('teamName', 'Team name is maximum 64 characters').trim().isLength({ max: 64 }),
  expVal.sanitizeBody('teamName').escape(),
  expVal.body('conference').trim(),
  expVal.sanitizeBody('conference').escape(),
  expVal.body('division').trim(),
  expVal.sanitizeBody('division').escape(),
  function (req, res, next) {
    // Extract the validation errors from a request.
    const errors = expVal.validationResult(req);
    // Create a new document for the database with the trimmed, sanitized data
    let team_to_create = new Team(
      {
        city: req.body.city,
        teamName: req.body.teamName,
        league: req.body.league,
        conference: req.body.conference,
        division: req.body.division
      }
    );
    // If errors are detected, render form again with error message showing
    if (!errors.isEmpty()) { // This is used because even if there are no errors, a (truthy!) errors object with zero elements is returned
      console.log('attempting to re-render');
      League.find({}, 'league_short') // Grab the list of leagues from database again, in order to populate the dropdown list
        .exec((err, results) => {
          if (err) {
            return next(err);
          } else {
            res.render('team_submit', { title: 'Add New Team', team: team_to_create, errors: errors.array(), leagues_object: results });
          }
        })
      // Note: errors.array() is needed to access the errors themselves
      // because express-validator returns an object containing the array of errors along with other information
      return;
    };
    Team.findOne({ teamName: req.body.teamName, league: req.body.league }, (err, results) => {
      if (err) {
        return next(err);
      } else if (results) { // Duplicate found
        res.redirect(results.url);
      } else { // Yay, all tests passed, it actually is a new team!
        team_to_create.save((err) => {
          if (err) {
            return new (err);
          } else {
            res.redirect(team_to_create.url);
          }
        })
      }
    })
  }
];

// Display Team delete form on GET.
exports.team_delete_get = function (req, res) {
  async.parallel({
    team_to_delete: (callback) => {
      Team.findById(req.params.id)
        .exec(callback);
    },
    players_on_roster: (callback) => {
      Player.find({ 'team': req.params.id })
        .exec(callback);
    }
  }, (err, results) => {
    if (err) {
      return next(err);
    } else if (results.team_to_delete.teamName == null) {
      const err = new Error('This team ID is invalid');
      err.status = 404;
      return next(err);
    } else {
      res.render('team_delete.pug', { team: results.team_to_delete, roster: results.players_on_roster, title: 'Are you sure you want to delete ' });
    }
  });
}

// Handle Team delete on POST.
exports.team_delete_post = function (req, res, next) {
  async.parallel({
    team_to_delete: (callback) => {
      Team.findById(req.params.id)
        .exec(callback);
    },
    players_on_roster: (callback) => {
      Player.find({ 'team': req.params.id })
        .exec(callback);
    }
  }, (err, results) => {
    if (err) {
      return next(err);
    } else if (results.team_to_delete == null) {
      res.redirect('')
    } else if (results.players_on_roster.length != 0) { // Trying to delete a team with players still on it
      res.render('team_delete.pug', { team: results.team_to_delete, roster: results.players_on_roster, title: 'Error: Cannot delete ' });
    } else {
      // Actually deleting the team now
      Team.findByIdAndDelete(req.params.id, (err, results) => {
        if (err) {
          return next(err);
        } else { // Back to list of teams
          res.redirect('../../teams');
        }
      });
    }
  })
};

// Display Team update form on GET.
exports.team_update_get = function (req, res, next) {
  async.parallel({
    team_details: (callback) => {
      Team.findById(req.params.id).populate('league').exec(callback);
    },
    leagues_object: (callback) => {
      League.find(callback);
    }
  }, (err, results) => {
    if (err) {
      return next(err);
    } else if (results.team_details == null) {
      const err = new Error('Team not found.');
      err.status = 404;
      return next(err);
    } else { // Team actually exists
      res.render('team_submit.pug', { title: 'Edit Team', team: results.team_details, leagues_object: results.leagues_object });
    }
  })
};

// Handle Team update on POST.
exports.team_update_post = [
  expVal.body('city', 'City required and must not be longer than 64 characters').trim().isLength({ min: 1, max: 64 }),
  expVal.sanitizeBody('city').escape(),
  expVal.body('teamName', 'Team name is maximum 64 characters').trim().isLength({ max: 64 }),
  expVal.sanitizeBody('teamName').escape(),
  expVal.body('conference').trim(),
  expVal.sanitizeBody('conference').escape(),
  expVal.body('division').trim(),
  expVal.sanitizeBody('division').escape(),
  function (req, res, next) {
    // Extract the validation errors from a request.
    const errors = expVal.validationResult(req);
    // Create a new document for the database with the trimmed, sanitized data
    let edited_team = new Team(
      {
        city: req.body.city,
        teamName: req.body.teamName,
        league: req.body.league,
        conference: req.body.conference,
        division: req.body.division,
        _id: req.params.id // Note: Ensure the original ID is included in this new record (Mongo document) so there's no confusion
        // And we don't inadvertently create a duplicate
      }
    );
    // If errors are detected, render form again with error message showing
    if (!errors.isEmpty()) { // This is used because even if there are no errors, a (truthy!) errors object with zero elements is returned
      console.log('attempting to re-render');
      League.find({}, 'league_short')
        .exec((err, results) => {
          if (err) {
            return next(err);
          } else {
            res.render('team_submit', { title: 'Edit Team', team: edited_team, errors: errors.array(), leagues_object: results });
          }
        })
      // Note: errors.array() is needed to access the errors themselves
      // because express-validator returns an object containing the array of errors along with other information
      return;
    };
    // This Mongo command finds and updates the document. $set: X is the syntax for setting the contents of the document to X
    Team.findByIdAndUpdate(req.params.id, { $set: edited_team }, (err, results) => {
      if (err) {
        return next(err);
      } else { // Back to team details page, now edited
        res.redirect(edited_team.url);
      }
    })
  }
];