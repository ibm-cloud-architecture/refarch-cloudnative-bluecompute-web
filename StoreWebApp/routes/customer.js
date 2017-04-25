var express = require('express');
var router = express.Router();
var http = require('request-promise-json');
var Promise = require('promise');
var UrlPattern = require('url-pattern');
var oauth = require('../server/js/oauth.js');
var config = require('config');

var session, page_filter;
var api_url = new UrlPattern('(:protocol)\\://(:host)(:api)/(:operation)');
var _myApp = config.get('Application');
var _apis = config.get('APIs');

/* GET Catalog listing from API and return JSON */
router.get('/', function (req, res) {
  session = req.session;

  //page_filter = (typeof req.query.filter !== 'undefined') ? JSON.stringify(req.query.filter.order) : false;
  page_filter = "";

  setGetCustomerOptions(req, res)
    .then(sendApiReq)
    .then(sendResponse)
    .catch(renderErrorPage)
    .done();

});


function setGetCustomerOptions(req, res) {
  var query = req.query;

  var customer_url = api_url.stringify({
    protocol: _myApp.protocol,
    host: _apis.customer.service_name,
    api: _apis.customer.base_path,
    operation: "customer"
  });


  var options = {
    method: 'GET',
    url: customer_url,
    strictSSL: false,
    headers: {}
  };

  if (_apis.customer.require.indexOf("client_id") != -1) options.headers["X-IBM-Client-Id"] = _myApp.client_id;
  //if (_apis.customer.require.indexOf("client_secret") != -1) options.headers["X-IBM-Client-Secret"] = _myApp.client_secret;

  return new Promise(function (fulfill) {

    // Get OAuth Access Token, if needed
    if (_apis.customer.require.indexOf("oauth") != -1) {
        options.headers.Authorization = req.headers.authorization;
        fulfill({
          options: options,
          res: res
        });
      }
      else fulfill({
        options: options,
        res: res
      });
    });
}


function sendApiReq(function_input) {
  var options = function_input.options;
  var res = function_input.res;

  console.log("MY OPTIONS:\n" + JSON.stringify(options));

  // Make API call for Catalog data
  return new Promise(function (fulfill, reject) {
    http.request(options)
      .then(function (result) {
        //console.log("Catalog call succeeded with result: " + JSON.stringify(result));
        fulfill({
          data: result,
          res: res
        });
      })
      .fail(function (reason) {
        console.log("Customer call failed with reason: " + JSON.stringify(reason));
        reject({
          err: reason,
          res: res
        });
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

function renderErrorPage(function_input) {
  var err = function_input.err;
  var res = function_input.res;

  // Render the error message in JSON
  res.setHeader('Content-Type', 'application/json');
  res.send(err);
}

module.exports = router;
