const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


/**************** Module Added Start *****************/

// Body-Parser
const bodyParser = require('body-parser');

// MYySQL
const mysql = require("mysql");

// Express-Sessions
const session = require('express-session');

// Mysql Express Sessions
const MySQLStore = require('express-mysql-session')(session);

// Bcryptjs
const bcrypt = require('bcryptjs');

// PassportJs
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

/**************** Module Added End *****************/

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

/**************** Configure Module Start *****************/

// Body-Parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Mysql
const connection = {
  host: 'localhost',
  user: 'root',
  password: '', //optional (jika mysql tidak menggunakan password dapat dicantumkan / tidak)
  database: 'db_login',
  multipleStatements: false //True = Bulk Statment (multipleStatements) aktif / False Bulk Statment (multipleStatements) tidak aktif
};

const connect = mysql.createConnection(connection);
connect.connect();
const sessionStore = new MySQLStore(connection, connect);


// Express-Sessions
app.use(session({
  secret: "$2a$10$0jlmueFVPi.EFmwoHjzM3uZvAy1QPHs6PFcrX3nXLYcoq7CvtCUT.",
  store: sessionStore,
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true } 
}));

//PassportJS
app.use(passport.initialize());
app.use(passport.session());



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


/********************** Passport Action Login Start **********************/
passport.use('local', new LocalStrategy(
  /* 
  
  Karena di passportJS LocalStrategy untuk login parameter yang dicari adalah username dan password,
  jika field pada tabel bukan "username" dan "password" maka untuk merubahnya harus di definisikan secara manual terlebih dahulu

  -Jika username dan password pada field adalah "usernm" dan "pwd" : 

  {
  usernameField :usernm,
  passwordFIeld : pwd
  }

  -Jika Login menggunakan email maka sama seperti diatas, usernameField harus didefinisikan sebagai email
   {
  usernameField :email,
  passwordFIeld : pwd
  }
  
  */

  (username, password, done) => {


    const db = connect;
    db.query(`SELECT * FROM tbl_login WHERE username = '${username}'`, (err, results) => {

      if (err) {
        return done(null, false);
      }

      if (results.length === 0) {
        return done(null, false);
      }

      if (results[0].password === password) {
        return done(null, results[0])
      } else {
        return done(null, false);
      }

    });

  }
));

/********************** Passport Action Login End **********************/

module.exports = app;
