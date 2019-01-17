const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


/**************** Module Added Start *****************/

// Body-Parser
const bodyParser = require('body-parser');

// Express-Sessions
const session = require('express-session');

// Bcryptjs
const bcrypt = require('bcryptjs');

/**************** Module Added End *****************/

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

/**************** Configure Module Start *****************/

// Body-Parser
app.use(bodyParser.urlencoded({
  extended: true
}));

// Express-Sessions
app.use(session({
  secret: "$2a$10$0jlmueFVPi.EFmwoHjzM3uZvAy1QPHs6PFcrX3nXLYcoq7CvtCUT.",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));






/**************** Configure Module End *****************/



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
