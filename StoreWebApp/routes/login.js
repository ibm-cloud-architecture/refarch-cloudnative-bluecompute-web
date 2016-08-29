var express = require('express');
var router = express.Router();
var Promise = require('promise');
var oauth = require('../server/js/oauth.js');

var session;

/* GET request for login screen 
router.get('/', function (req, res) {
  session = req.session;

  // render the login page
  res.render('login', {
    title: 'ThinkIBM Consumer Login'
  });

});
*/

/* PROCESS POST request for login */
router.post('/', function (req, res) {
  session = req.session;

  console.log("Ready to call login");

  loginWithOAuth(req, res)
    .then(renderPage)
    .catch(renderErrorPage)
    .done();

});

function loginWithOAuth(req, res) {
  var form_body = req.body;
  var username = form_body.username;
  var password = form_body.password;


  console.log("loginWithOAuth");

  return new Promise(function (fulfill) {
    oauth.login(username, password, session)
      .then(function () {
        fulfill(res);
      })
      .done();
  });

}

//TODO: format the other pages with login / logout link

function renderPage(res) {
  // Redirect to the inventory view
  res.redirect('/inventory');
}

function renderErrorPage(function_input) {
  var err = function_input.err;
  var res = function_input.res;
  res.render('error', {reason: err});
}

module.exports = router;
