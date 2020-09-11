var express = require('express');
var main_controller = require('../controllers/mainController.js');
var router = express.Router();

/// HOMEPAGE ///

// GET home page.
router.get('/', main_controller.homePage);

/// FOR TESTING ///

// GET test page
router.get('/testing.html', function (req, res) {
  res.render('../views/testing.pug');
})

module.exports = router;
