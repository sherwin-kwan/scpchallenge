const Event = require('../models/event');
const async = require('async');

// Display list of all Events.
exports.event_list = function (req, res) {
  Event.find({}, 'team1 team2 team1_result team2_result')
    .populate('team1 team 2')
    .exec( (err, results) => {
      if (err) {
        return next(err);
      } else {
        res.render('event_list.pug', {title: 'Event List', event_list: results});
      };
    })
};

// Display detail page for a specific Event.
exports.event_detail = function (req, res) {
  res.send('NOT IMPLEMENTED: Event detail: ' + req.params.id);
};

// Display Event create form on GET.
exports.event_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Event create GET');
};

// Handle Event create on POST.
exports.event_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Event create POST');
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