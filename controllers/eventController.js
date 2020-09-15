const Event = require('../models/event');
const League = require('../models/league');
const Team = require('../models/team');
const Round = require('../models/round');
const async = require('async');
const formats = require('../models/formats');

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
  res.send('NOT IMPLEMENTED: Event detail: ' + req.params.id);
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
      res.render('event_submit.pug', {format_list: formats, league: results.league, teams_in_league: results.team_list, round_list: results.round_list} )
    }
  });
};

// Handle Event create on POST.
exports.event_create_post = function (req, res) {
  
};

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