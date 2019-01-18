# nodejs-login-passport-mysql

## Depedency
npm i [nama packge]
```
Package :
- mysql
- body-parser
- express-session
- express-mysql-session
- passport
- passport-local
- bcryptjs
```

## File App.js
Konfigurasi dari module yang ada di file App.js
#### Deklarasi Module
```
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
```

#### Konfigurasi Modul
```
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

```
#### Aksi Passport Local-Strategy [Simple]
```
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

```

## File routes/index.js

#### Aksi Login 
```
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/sukses',
    failureRedirect: '/gagal'
  }));
```

#### serializeUser dan deserializeUser
```
/** Passport Config Serialize user dan Deserialize user */

// Menyimpan data user dengan field id yang ada di database ke dalam session
passport.serializeUser(function (id, done) {
  done(null, id);
});


// Mengambil data dari database berdasarkan id yang diberikan pada serialize user
passport.deserializeUser(function (id, done) {
  done(null, id);
});
```

## Database Scema 
```
Database : db_login

Tabel : tbl_login
Field : 
id int auto increment
username varchar(12)
password varchar (100) //kenapa 100 nantinya bakalan gw update, passwordnya di encrypt
```
