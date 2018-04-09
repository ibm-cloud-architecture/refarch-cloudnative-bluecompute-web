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



/* Handle the Get request*/
router.get('/userinfo', function (req, res) {
  session = req.session;
  setCustomerOptions(req, res)
    .then(sendApiReq)
    .then(sendResponse)
    .catch(renderErrorPage)
    .done();

});

function setCustomerOptions(req, res) {
  var form_body = req.body;
  //console.log("Browser request data:\n" + JSON.stringify(form_body));
  console.log("Form data:\n" + JSON.stringify(form_body));

  var customer_url = api_url.stringify({
    protocols: _apis.protocols,
    host: _apis.customer.service_name,
    api: _apis.customer.base_path,
    operation: "userinfo"
  });

  var basicAuthToken = _authServer.client_id + ":" + _authServer.client_secret;
  var buffer = new Buffer(basicAuthToken);
  var basicToken = 'Basic ' + buffer.toString('base64');

  var getCustomer_options = {
    method: 'GET',
    url: customer_url,
    strictSSL: false,
    headers: {},
  };
  return new Promise(function (fulfill) {
    // Get OAuth Access Token, if needed
    if (_apis.customer.require.indexOf("oauth") != -1) {
      // If already logged in, add token to request
      getCustomer_options.headers.Authorization = req.headers.authorization;
      fulfill({
        options: getCustomer_options,
        res: res
      });
    }
    else {
        fulfill({
            options: getCustomer_options,
            res: res
        });
    }
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
        console.log("Customer call succeeded with result: " + JSON.stringify(result));
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
