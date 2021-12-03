require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');

const mongoose = require('mongoose');

const app = express();

// Set up mongoose connection
let mongoURI = 'mongodb+srv://cluster0.q3fti.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(mongoURI, {
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASSWORD
});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// output log in 'dev' mode
app.use(logger('dev'));
// retrieve data whose Content-Type is application/json
app.use(express.json());
// retrieve data whose Content-Type is application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter); // Add catalog routes to middleware chain

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
