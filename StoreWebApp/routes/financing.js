var express = require('express');
var router = express.Router();
var http = require('request-promise-json');
var Promise = require('promise');
var UrlPattern = require('url-pattern');
var oauth = require('../server/js/oauth.js');
var config = require('config');

var session;
var api_url = new UrlPattern('(:protocol)\\://(:host)(/:org)(/:cat)(:api)/(:operation)');
var _myApp = config.get('Application');
var _apiServer = config.get('API-Server');
var _apiServerOrg = ((_apiServer.org == "") || (typeof _apiServer.org == 'undefined')) ? undefined : _apiServer.org;
var _apiServerCatalog = ((_apiServer.catalog == "") || (typeof _apiServer.catalog == 'undefined')) ? undefined : _apiServer.catalog;
var _apis = config.get('APIs');

/* Handle the request for calculating shipping cost */
router.get('/calculate/:item_price', function (req, res) {
  session = req.session;

  setFinancingReqOptions(req, res)
    .then(submitFinancingReq)
    .catch(renderErrorPage)
    .done();

});

function setFinancingReqOptions(req, res) {
  var amount = req.params.item_price;

  var financing_url = api_url.stringify({
    protocol: _apiServer.protocol,
    host: _apiServer.host,
    org: _apiServerOrg,
    cat: _apiServerCatalog,
    api: _apis.financing.base_path,
    operation: "calculate?duration=24&rate=3.9&amount=" + amount
  });

  var options = {
    method: 'GET',
    url: financing_url,
    strictSSL: false,
    headers: {
      "Host": _apiServer.host
    }
  };

  if (_apis.financing.require.indexOf("client_id") != -1) options.headers["X-IBM-Client-Id"] = _myApp.client_id;
  if (_apis.financing.require.indexOf("client_secret") != -1) options.headers["X-IBM-Client-Secret"] = _myApp.client_secret;

  return new Promise(function (fulfill) {
    
    // Get OAuth Access Token, if needed
    if (_apis.financing.require.indexOf("oauth") != -1) {

      // If already logged in, add token to request
      if (typeof session.oauth2token !== 'undefined') {
        options.headers.Authorization = 'Bearer ' + session.oauth2token;
        fulfill({
          options: options,
          res: res
        });
      } else {
        // Otherwise redirect to login page
        res.redirect('/login');
      }

    }
    else fulfill({
      options: options,
      res: res
    });
  });

}

function submitFinancingReq(function_input) {
  var options = function_input.options;
  var res = function_input.res;

  http.request(options)
    .then(function (data) {
      res.json(data);
    })
    .fail(function (err) {
      console.log("ERROR: " + err.description);
    });
}

function renderErrorPage(function_input) {
  var err = function_input.err;
  var res = function_input.res;
  res.render('error', {reason: err});
}

module.exports = router;
