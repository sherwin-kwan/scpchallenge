const express = require('express');
const router = express.Router();

// Require controller modules.
const event_controller = require('../controllers/eventController');
const league_controller = require('../controllers/leagueController');
const pick_controller = require('../controllers/pickController');
const player_controller = require('../controllers/playerController');
const team_controller = require('../controllers/teamController');
const user_controller = require('../controllers/userController');

/// EVENT ROUTES ///

// GET request for creating an Event. NOTE This must come before routes that display Event (uses id).
router.get('/event/:lid/create', event_controller.event_create_get);
// POST request for creating Event.
router.post('/event/:lid/create', event_controller.event_create_post);
// GET request to delete Event.
router.get('/event/:id/delete', event_controller.event_delete_get);
// POST request to delete Event.
router.post('/event/:id/delete', event_controller.event_delete_post);
// GET request to update Event.
router.get('/event/:id/update', event_controller.event_update_get);
// POST request to update Event.
router.post('/event/:id/update', event_controller.event_update_post);
// GET request for one Event.
router.get('/event/:id', event_controller.event_detail);
// GET request for list of all Event items in a League
router.get('/events/:lid', event_controller.events_in_league);
// GET request for list of all Events
router.get('/events', event_controller.event_list);
// POST request to go from all Events page to Event page for a specific League
router.post('/events', event_controller.filter_events_by_league);
router.post('/events/:lid', event_controller.filter_events_by_league);

/// LEAGUE ROUTES ///

router.get('/league/create', league_controller.league_create_get);
router.post('/league/create', league_controller.league_create_post);
router.get('/league/:id/delete', league_controller.league_delete_get);
router.post('/league/:id/delete', league_controller.league_delete_post);
router.get('/league/:id/update', league_controller.league_update_get);
router.post('/league/:id/update', league_controller.league_update_post);
router.get('/league/:id', league_controller.league_detail);
router.get('/leagues', league_controller.league_list);

/// PICK ROUTES ///

router.get('/pick/create', pick_controller.pick_create_get);
router.post('/pick/create', pick_controller.pick_create_post);
router.get('/pick/:id/delete', pick_controller.pick_delete_get);
router.post('/pick/:id/delete', pick_controller.pick_delete_post);
router.get('/pick/:id/update', pick_controller.pick_update_get);
router.post('/pick/:id/update', pick_controller.pick_update_post);
router.get('/pick/:id', pick_controller.pick_detail);
router.get('/picks', pick_controller.pick_list);

/// PLAYER ROUTES ///

router.get('/player/create', player_controller.player_create_get);
router.post('/player/create', player_controller.player_create_post);
router.get('/player/:id/delete', player_controller.player_delete_get);
router.post('/player/:id/delete', player_controller.player_delete_post);
router.get('/player/:id/update', player_controller.player_update_get);
router.post('/player/:id/update', player_controller.player_update_post);
router.get('/player/:id', player_controller.player_detail);
router.get('/players', player_controller.player_list);

/// TEAM ROUTES ///

router.get('/team/create', team_controller.team_create_get);
router.post('/team/create', team_controller.team_create_post);
router.get('/team/:id/delete', team_controller.team_delete_get);
router.post('/team/:id/delete', team_controller.team_delete_post);
router.get('/team/:id/update', team_controller.team_update_get);
router.post('/team/:id/update', team_controller.team_update_post);
router.get('/team/:id', team_controller.team_detail);
router.get('/teams', team_controller.team_list);

/// USER ROUTES ///

router.get('/user/create', user_controller.user_create_get);
router.post('/user/create', user_controller.user_create_post);
router.get('/user/:id/delete', user_controller.user_delete_get);
router.post('/user/:id/delete', user_controller.user_delete_post);
router.get('/user/:id/update', user_controller.user_update_get);
router.post('/user/:id/update', user_controller.user_update_post);
router.get('/user/:id', user_controller.user_detail);
router.get('/users', user_controller.user_list);

module.exports = router;