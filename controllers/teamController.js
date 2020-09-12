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
      } else if (!results.team_detail.city) { // Watch out, if you write '!results' it fails, because an object with zero results is still truthy!
        res.send('You have entered an invalid team ID');
      } else {
        res.render('team_detail.pug', { title: `${results.team_detail.teamName} Roster`, team_detail: results.team_detail, 
        player_list: results.player_list });
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
      res.render('team_submit.pug', {title: 'Add New Team', leagues_object: results})
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
  expVal.body('city', 'City required').trim().isLength({min: 1, max: 64}),
  expVal.sanitizeBody('city').escape(),
  expVal.body('teamName').trim().isLength({max: 64}),
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
      { city: req.body.city,
      teamName: req.body.teamName,
      league: req.body.league,
      conference: req.body.conference,
      division: req.body.division
     }
    );
    // If errors are detected, render form again with error message showing
    if (!errors.isEmpty()) { // This is used because even if there are no errors, a (truthy!) errors object with zero elements is returned
      console.log('attempting to re-render');
      res.render('team_submit', {title: 'Add New Team', team: team_to_create, errors: errors.array()});
      // Note: errors.array() is needed to access the errors themselves
      // because express-validator returns an object containing the array of errors along with other information
      return;
    };
    console.log('past re-render');
    Team.findOne( {city: req.body.city, teamName: req.body.teamName, league: req.body.league}, (err, results) => {
      if (err) {
        return next(err);
      } else if (results) { // Duplicate found
        res.redirect(results.url);
      } else { // Yay, all tests passed, it actually is a new team!
        team_to_create.save( (err) => {
          if (err) {
            return new(err);
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