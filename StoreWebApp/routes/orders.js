var express = require('express');
var router = express.Router();
var http = require('request-promise-json');
var Promise = require('promise');
var UrlPattern = require('url-pattern');
//var oauth = require('../server/js/oauth.js');
var config = require('config');

var session;
var api_url = new UrlPattern('(:protocols)\\://(:host)(:api)/(:operation)');
var _apis = config.get('APIs');

/* Handle the GET request for obtaining item information and render the page */
router.get('/', function (req, res) {
  session = req.session;

  setGetOrdersOptions(req, res)
    .then(sendApiReq)
    .then(sendResponse)
    .catch(renderErrorPage)
    .done();

});

/* Handle the POST request for creating a new item review */
router.post('/', function (req, res) {
  session = req.session;

  setNewOrderOptions(req, res)
    .then(submitNewOrder)
    .catch(renderErrorPage)
    .done();

});

function setGetOrdersOptions(req, res) {
  var params = req.params;

  var orders_url = api_url.stringify({
    protocols: _apis.protocols,
    host: _apis.order.service_name,
    api: _apis.order.base_path,
    operation: "orders"
  });

  var getOrders_options = {
    method: 'GET',
    url: orders_url,
    strictSSL: false,
    headers: {}
  };

  return new Promise(function (fulfill) {

    // Get OAuth Access Token, if needed
    if (_apis.order.require.indexOf("oauth") != -1) {
      // If already logged in, add token to request
      getOrders_options.headers.Authorization = req.headers.authorization;
      fulfill({
        options: getOrders_options,
        res: res
      });
    }
    else {
        fulfill({
            options: getOrders_options,
            res: res
        });
    }
  });

}

function setNewOrderOptions(req, res) {
  var form_body = req.body;

  var reqBody = {
    itemId: form_body.itemId,
    count: form_body.count
  };


  var orders_url = api_url.stringify({
    protocols: _apis.protocols,
    host: _apis.order.service_name,
    api: _apis.order.base_path,
    operation: "orders"
  });

  var options = {
    method: 'POST',
    url: orders_url,
    strictSSL: false,
    headers: {},
    body: reqBody,
    JSON: true
  };

  return new Promise(function (fulfill) {
    // Get OAuth Access Token, if needed
    if (_apis.order.require.indexOf("oauth") != -1) {
        // Add OAuth access token to the header
        options.headers.Authorization = req.headers.authorization;
        fulfill({
          options: options,
          item_id: form_body.itemId,
          res: res
        });
    }
    else fulfill({
      options: options,
      item_id: form_body.itemId,
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
        //console.log("Order call succeeded with result: " + JSON.stringify(result));
        fulfill({
          data: result,
          res: res
        });
      })
      .fail(function (reason) {
        console.log("Order call failed with reason: " + JSON.stringify(reason));
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

function submitNewOrder(function_input) {
  var options = function_input.options;
  var item_id = function_input.item_id;
  var res = function_input.res;
  console.log("Order OPTIONS:\n" + JSON.stringify(options));
  http.request(options)
    .then(function (data) {
      console.log("DATA: " + JSON.stringify(data));
      // Render the page with the results of the API call
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    })
    .fail(function (err) {
      console.log("ERR: " + JSON.stringify(err));
      // Render the error message in JSON
      res.setHeader('Content-Type', 'application/json');
      res.send(err);
    });
}

function renderErrorPage(function_input) {
  var err = function_input.err;
  var res = function_input.res;

  // Render the error message in JSON
  res.setHeader('Content-Type', 'application/json');
  res.send(err);

}

module.exports = router;
