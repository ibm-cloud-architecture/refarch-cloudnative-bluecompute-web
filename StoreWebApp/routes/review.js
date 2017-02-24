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

/* Handle the GET request for obtaining item information and render the page */
router.get('/:id', function (req, res) {
  session = req.session;

  setGetReviewOptions(req, res)
    .then(sendApiReq)
    .then(sendResponse)
    .catch(renderErrorPage)
    .done();

});

/* Handle the POST request for creating a new item review */
router.post('/:id', function (req, res) {
  session = req.session;

  setNewReviewOptions(req, res)
    .then(submitNewReview)
    .catch(renderErrorPage)
    .done();

});

function setGetReviewOptions(req, res) {
  var params = req.params;

  var reviews_url = api_url.stringify({
    protocol: _apiServer.protocol,
    host: _apiServer.host,
    org: _apiServerOrg,
    cat: _apiServerCatalog,
    api: _apis.review.base_path,
    operation: "reviews/list?itemId=" + params.id
  });

  var getItemReviews_options = {
    method: 'GET',
    url: reviews_url,
    strictSSL: false,
    headers: {}
  };

  if (_apis.review.require.indexOf("client_id") != -1) getItemReviews_options.headers["X-IBM-Client-Id"] = _myApp.client_id;
  if (_apis.review.require.indexOf("client_secret") != -1) getItemReviews_options.headers["X-IBM-Client-Secret"] = _myApp.client_secret;

  return new Promise(function (fulfill) {

    fulfill({
      options: getItemReviews_options,
      res: res
    });
  });

}

function setNewReviewOptions(req, res) {
  var form_body = req.body;
  var params = req.params;

  var reqBody = {
    review_date: new Date(),
    rating: form_body.rating
  };

  // Add optional portions to the request body
  //if (form_body.name !== '') reqBody.reviewer_name = form_body.reviewer_name;
  //if (form_body.email !== '') reqBody.reviewer_email = form_body.reviewer_email;
  if (form_body.comment !== '') reqBody.comment = form_body.comment;

  var reviews_url = api_url.stringify({
    protocol: _apiServer.protocol,
    host: _apiServer.host,
    org: _apiServerOrg,
    cat: _apiServerCatalog,
    api: _apis.review.base_path,
    operation: "reviews/comment?itemId=" + params.id
  });

  var options = {
    method: 'POST',
    url: reviews_url,
    strictSSL: false,
    headers: {},
    body: reqBody,
    JSON: true
  };

  if (_apis.review.require.indexOf("client_id") != -1) options.headers["X-IBM-Client-Id"] = _myApp.client_id;

  return new Promise(function (fulfill) {
    // Get OAuth Access Token, if needed
    if (_apis.review.require.indexOf("oauth") != -1) {

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

  // Make API call for Review data
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
        console.log("review call failed with reason: " + JSON.stringify(reason));
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

function submitNewReview(function_input) {
  var options = function_input.options;
  var item_id = function_input.item_id;
  var res = function_input.res;

  //Inject the call to customer here
  var customer_url = api_url.stringify({
    protocol: _apiServer.protocol,
    host: _apiServer.host,
    org: _apiServerOrg,
    cat: _apiServerCatalog,
    api: _apis.customer.base_path,
    operation: "customer"
  });


  var customer_options = {
    method: 'GET',
    url: customer_url,
    strictSSL: false,
    headers: {}
  };
  if (_apis.customer.require.indexOf("client_id") != -1) customer_options.headers["X-IBM-Client-Id"] = _myApp.client_id;
  customer_options.headers.Authorization = options.headers.Authorization;

  // Call the APIs
  http.request(customer_options)
    .then(function (customer_data) {

        //Pull the customer name and email from customer API
        options.body.reviewer_name = customer_data.firstName + " " + customer_data.lastName;
        options.body.reviewer_email = customer_data.email;

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
