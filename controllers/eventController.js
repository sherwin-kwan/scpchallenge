const Event = require('../models/event');
const League = require('../models/league');
const Team = require('../models/team');
const Round = require('../models/round');
const async = require('async');
const formats = require('../models/formats');
const { body, validationResult } = require('express-validator');

exports.event_list = function (req, res) {
  async.parallel({
    events: (callback) => {
      Event.find({}, 'team1 team2 league season team1_result team2_result')
        .populate('team1 team2 league')
        .exec(callback)
    },
    all_leagues: (callback) => {
      League.find({})
        .exec(callback)
    },
  }, (err, results) => {
    if (err) {
      return next(err);
    } else {
      res.render('event_list.pug', { title: 'Event List', all_events: results.events, all_leagues: results.all_leagues })
    }
  });
};

// Display list of all Events in a particular League.
exports.events_in_league = function (req, res, next) {
  async.parallel({
    events_in_league: (callback) => {
      Event.find({ league: req.params.lid }, 'team1 team2 round season team1_result team2_result next_game_number next_game_begins_at')
        .populate('team1 team2 round')
        .exec(callback)
    },
    all_leagues: (callback) => {
      League.find({})
        .exec(callback)
    },
    this_league: (callback) => {
      League.findById({ _id: req.params.lid })
        .exec(callback);
    }
  }, (err, results) => {
    if (err) {
      return next(err);
    } else {
      res.render('events_in_league.pug', {
        title: `List of ${results.this_league.tournament_name} ${results.this_league.event_name}`, events_in_league: results.events_in_league,
        all_leagues: results.all_leagues, this_league: results.this_league
      });
    }
  })
};

exports.filter_events_by_league = function (req, res, next) {
  res.redirect(`/data/events/${req.body.chooseleague}`)
}

// Display detail page for a specific Event.
exports.event_detail = function (req, res) {
  async.parallel({
    round_list: (callback) => {
      Round.find({ league: req.params.lid })
        .exec(callback)
    },
    team_list: (callback) => {
      Team.find({ league: req.params.lid })
        .exec(callback)
    },
    league: (callback) => {
      League.findById(req.params.lid)
        .exec(callback)
    }
  }, (err, results) => {
    res.render('event_detail.pug', {});
  });
};

// Display Event create form on GET.
exports.event_create_get = function (req, res, next) {
  async.parallel({
    round_list: (callback) => {
      Round.find({ league: req.params.lid })
        .exec(callback)
    },
    team_list: (callback) => {
      Team.find({ league: req.params.lid })
        .exec(callback)
    },
    league: (callback) => {
      League.findById(req.params.lid)
        .exec(callback)
    }
  }, (err, results) => {
    if (err) {
      return next(err);
    } else {
      res.render('event_submit.pug', { format_list: formats, league: results.league, teams_in_league: results.team_list, round_list: results.round_list })
    }
  });
};

// Handle Event create on POST.
exports.event_create_post = [
  // Step 1: sanitizing and validating input - this time only two fields aren't dropdown lists so less sanitation needed
  // Step 2: If errors detected, display error message and have user revise
  // Step 3: Check if user is making a duplicate record. (No two leagues are allowed to have the same name)
  // Step 4: If all checks are passed, create a new league record in the database
  body('season', 'Season should be a numeric year').isNumeric(),
  body('player_result_name').trim().escape(),
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a new document for the database with the validated, sanitized data
    let event_to_create = new Event(
      {
        team1: req.body.team1,
        team2: req.body.team2,
        begins_at: new Date(req.body.begins_at),
        next_game_number: 1,
        next_game_begins_at: new Date(req.body.begins_at),
        team1_result: 0,
        team2_result: 0,
        player_result_name: req.body.player_result_name,
        round: req.body.round,
        format: req.body.format,
        league: req.params.lid,
        season: req.body.season,
      }
    );
    // If errors are detected, render form again with error message showing
    if (!errors.isEmpty()) { // This is used because even if there are no errors, a (truthy!) errors object with zero elements is returned
      console.log('attempting to re-render');
      async.parallel({
        round_list: (callback) => {
          Round.find({ league: req.params.lid })
            .exec(callback)
        },
        team_list: (callback) => {
          Team.find({ league: req.params.lid })
            .exec(callback)
        },
        league: (callback) => {
          League.findById(req.params.lid)
            .exec(callback)
        }
      }, (err, results) => {
        if (err) {
          return next(err);
        } else {
          res.render('event_submit.pug', { errors: errors.array(), event_to_create: event_to_create, format_list: formats, league: results.league, teams_in_league: results.team_list, round_list: results.round_list })
        }
      });
      // Note: errors.array() is needed to access the errors themselves
      // because express-validator returns an object containing the array of errors along with other information
      return;
    };
    event_to_create.save((err) => {
      if (err) {
        return new (err);
      } else {
        res.redirect(event_to_create.url);
      }
    })
  }
];

// Display Event delete form on GET.
exports.event_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Event delete GET');
};

// Handle Event delete on POST.
exports.event_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Event delete POST');
};

// Display Event update form on GET.
exports.event_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Event update GET');
};

// Handle Event update on POST.
exports.event_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Event update POST');
};