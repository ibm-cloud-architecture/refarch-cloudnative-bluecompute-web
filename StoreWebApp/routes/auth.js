var express = require('express');
var router = express.Router();
var http = require('request-promise-json');
var Promise = require('promise');
var UrlPattern = require('url-pattern');
var config = require('config');

var session;
var api_url = new UrlPattern('(:protocols)\\://(:host)(:api)/(:operation)');
var _apis = config.get('APIs');
var _authServer = config.get('Auth-Server');


/* Handle the POST request for creating a new item review */
router.post('/token', function (req, res) {
  session = req.session;
  setOAuthOptions(req, res)
    .then(getOauthToken)
    .then(sendResponse)
    .catch(renderErrorPage)
    .done();

});

function setOAuthOptions(req, res) {
  var form_body = req.body;
  //console.log("Browser request data:\n" + JSON.stringify(form_body));
  console.log("Form data:\n" + JSON.stringify(form_body));

  var reqBody = {
    grant_type: form_body.grant_type,
    scope: form_body.scope,
    username: form_body.username,
    password: form_body.password
  };


  var oauth_url = api_url.stringify({
    protocols: _apis.protocols,
    host: _apis.oauth20.service_name,
    api: _apis.oauth20.base_path,
    operation: "token"
  });

  var basicAuthToken = _authServer.client_id + ":" + _authServer.client_secret;
  var buffer = new Buffer(basicAuthToken);
  var basicToken = 'Basic ' + buffer.toString('base64');
  var options = {
    method: 'POST',
    url: oauth_url,
    strictSSL: false,
    headers: {},
    json: true,
    form: reqBody // body type has a bug in request library that failed with str.replace error
  };

  options.headers.Authorization = basicToken;
  //options.headers.Content-Type = 'application/x-www-form-urlencoded';

  return new Promise(function (fulfill) {
    // Get OAuth Access Token, if needed
    fulfill({
      options: options,
      res: res
    });
  });

}

function sendResponse(function_input) {
  var data = function_input.data;
  var res = function_input.res;

  // Render the page with the results of the API call
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
}

function getOauthToken(function_input) {
  var options = function_input.options;
  var res = function_input.res;
  console.log("Auth OPTIONS:\n" + JSON.stringify(options));

  // Make API call for Catalog data
  return new Promise(function (fulfill, reject) {
    http.request(options)
      .then(function (data) {
        console.log("DATA: " + JSON.stringify(data));
        //res.setHeader('Content-Type', 'application/json');
        //res.send(data);
        fulfill({
          data: data,
          res: res
        });
      })
      .fail(function (reason) {
        console.log("Failed HTTP request " + JSON.stringify(reason));
        // Render the error message in JSON
        //res.setHeader('Content-Type', 'application/json');
        reject({
            err: reason,
            res: res
          });
      });
    });
}

function renderErrorPage(function_input) {
  var err = function_input.err;
  var res = function_input.res;
  console.log("ERR: " + JSON.stringify(err));
  // Render the error message in JSON
  //res.setHeader('Content-Type', 'application/json');

  var statusCode = "500";
  if(err.statusCode)
  {
    statusCode = err.statusCode;
  }

  res.status(statusCode);
  res.send(err);

}

module.exports = router;
