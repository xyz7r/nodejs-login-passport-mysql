var express = require('express');
var router = express.Router();

// PassportJs
const passport = require("passport");


/************************************************************/

router.get('/', (req, res, next) => {
  res.redirect('/login');
});


router.get('/sukses', (req, res, next) => {
  res.send("Login Sukses")
});

router.get('/gagal', (req, res, next) => {
  res.send("Login Gagal")
});



router.get('/login', (req, res, next) => {
  res.render('./auth/login');
  console.log(req.user)
});

router.get('/register', (req, res, next) => {
  res.render('./auth/register');
});



/** Action Login **/
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/sukses',
    failureRedirect: '/gagal'
  }));







//** Passport Config Serialize user dan Deserialize user */

// Menyimpan data user dengan field id yang ada di database ke dalam session
passport.serializeUser(function (id, done) {
  done(null, id);
});


// Mengambil data dari database berdasarkan id yang diberikan pada serialize user
passport.deserializeUser(function (id, done) {
  done(null, id);
});



module.exports = router;
