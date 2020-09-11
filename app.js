const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Player = require('./models/player.js');

const indexRouter = require('./routes/index.js');
const usersRouter = require('./routes/users.js');
const mainRouter = require('./routes/mainRoutes.js');

const app = express();
const mongoose = require('mongoose');
const mongoDB = require('./routes/mongoDB-link'); // If cloning,remember to create a file called mongoDB-link.js that exports the credentials for MongoDB API
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Database connected!');
  Player.find(function (err, players) {
    if (err) return console.error(err);
    console.log(players);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/data', mainRouter); // This causes the entire mainRoutes.js router to be bound to the path /data. 
// So for example, references to '/league' in that file are actually references to '/data/league'.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
