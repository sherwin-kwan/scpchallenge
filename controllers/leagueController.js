const League = require('../models/league.js');
const Team = require('../models/team.js');
const async = require('async');
const expVal = require('express-validator');

//const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

// Display list of all Leagues.
exports.league_list = function (req, res, next) {
  League.find({}, 'league league_short sport')
    .exec((err, results) => {
      if (err) {
        return next(err);
      } else {
        res.render('league_list.pug', { title: 'All Leagues', all_leagues: results });
      }
    })
};

// Display detail page for a specific League.
exports.league_detail = function (req, res, next) {
  async.parallel({
    league_detail: function (callback) {
      League.findById(req.params.id)
        .exec(callback);
    },
    team_list: function (callback) {
      Team.find({ 'league': req.params.id })
        .exec(callback);
    },
  }, // Main callback function
    function (err, results) {
      console.log(results);
      console.log(!results);
      console.log(results==null);
      if (err) {
        return next(err);
      } else if (results.team_list.length == 0) { // Watch out, if you write '!results' it fails, because an invalid ID still returns a results object, just
      // with no actual results!
        const err = new Error('You have entered an invalid league ID');
        err.status = 404;
        return next(err);
      } else {
        res.render('league_detail.pug', { title: results.league_detail.league, league_detail: results.league_detail, team_list: results.team_list });
      }
    }
  )
};

// Display League create form on GET.
exports.league_create_get = function (req, res) {
  res.render('league_submit.pug', { title: 'Add New League' });
};

// Handle League create on POST.
exports.league_create_post = [
  // Step 1: sanitizing and validating input
  // Step 2: If errors detected, display error message and have user revise
  // Step 3: Check if user is making a duplicate record. (No two leagues are allowed to have the same name)
  // Step 4: If all checks are passed, create a new league record in the database
  // For reference, the schema is:
  // league: {type: String, required: true},
  // league_short: {type: String, maxLength: 10},
  // sport: {type: String, required: true}, 
  expVal.body('league_name', 'League name required').trim().isLength({min: 1}),
  expVal.sanitizeBody('league_name').escape(),
  expVal.body('league_short', 'Abbreviation cannot be longer than 10 characters').trim().isLength({max: 10}),
  expVal.sanitizeBody('league_short').escape(),
  expVal.body('sport', 'Sport required').trim().isLength({min: 1}),
  expVal.sanitizeBody('sport').escape(),
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = expVal.validationResult(req);
    console.log(errors);
    // Create a new document for the database with the trimmed, sanitized data
    let league = new League(
      { league: req.body.league_name,
      league_short: req.body.league_short,
      sport: req.body.sport
     }
    );
    // If errors are detected, render form again with an error message
    if (!errors.isEmpty()) {
      console.log('We have errors!');
      res.render('league_submit', {title: 'Add New League', league: league, errors: errors.array()});
      // Note: errors.array() is needed to access the errors themselves
      // because express-validator returns an object containing the array of errors along with other information
      return;
    };
    // Check for duplicates
    League.findOne( {'league': req.body.league_name}, (err, results) => {
      console.log('No errors!');
      if (err) { // Search threw an error
        return next(err);
      } else if (results) { // Search found a duplicate
        res.redirect(results.url); 
      } else { // Yay, all tests passed, it actually is a new league!
        league.save(function (err) {
          if (err) {
            return next(err);
          } else {
            res.redirect(league.url);
          }
        })
      };
    })
  }
];

// Display League delete form on GET.
exports.league_delete_get = function (req, res) {
  // First of all, make sure there are no teams in the league being deleted (otherwise the procedure should not execute)
  /*
  async.parallel({
    league_to_delete: (callback) => {
      League.findById(req.params.id)
      .exec(callback);
    },
    teams_in_league: (callback) => {
      Team.find({ 'league': req.params.id})
      .exec(callback);
    }
  }, (err, results) => {
    if (err) {
      return next(err);
    } else {
      res.render('league_delete.pug', league: league_to_delete, teams: teams_in_league);
    }
  });*/
  res.send('Please delete leagues directly from the database. If you don\'t know where the database is, you don\'t have permission to delete a league.');
};

// Handle League delete on POST.
exports.league_delete_post = function (req, res) {
  res.send('Please delete leagues directly from the database. If you don\'t know where the database is, you don\'t have permission to delete a league.');
};

// Display League update form on GET.
exports.league_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: League update GET');
};

// Handle League update on POST.
exports.league_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: League update POST');
};