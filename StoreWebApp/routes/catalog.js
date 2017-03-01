var express = require('express');
var router = express.Router();
var http = require('request-promise-json');
var Promise = require('promise');
var UrlPattern = require('url-pattern');
var oauth = require('../server/js/oauth.js');
var config = require('config');

var session, page_filter;
var api_url = new UrlPattern('(:protocol)\\://(:host)(/:org)(/:cat)(:api)/(:operation)');
var _myApp = config.get('Application');
var _apiServer = config.get('API-Server');
var _apiServerOrg = ((_apiServer.org === "") || (typeof _apiServer.org == 'undefined')) ? undefined : _apiServer.org;
var _apiServerCatalog = ((_apiServer.catalog === "") || (typeof _apiServer.catalog == 'undefined')) ? undefined : _apiServer.catalog;
var _apis = config.get('APIs');


/* Return application configuration to client */
router.get('/config', function (req, res) {

  // Render the page with the results of the API call
  res.setHeader('Content-Type', 'application/json');
  res.send(config);

});

/* GET Catalog listing from API and return JSON */
router.get('/', function (req, res) {
  session = req.session;

  //page_filter = (typeof req.query.filter !== 'undefined') ? JSON.stringify(req.query.filter.order) : false;
  page_filter = "";

  setGetItemsOptions(req, res)
    .then(sendApiReq)
    .then(sendResponse)
    .catch(renderErrorPage)
    .done();

});

/* Handle the GET request for obtaining  individual catalog item information*/
router.get('/:id', function (req, res) {
  session = req.session;

  setGetItemOptions(req, res)
    .then(sendApiReq)
    .then(sendResponse)
    .catch(renderErrorPage)
    .done();

});

function setGetItemsOptions(req, res) {
  var query = req.query;

  var items_url = api_url.stringify({
    protocol: _apiServer.protocol,
    host: _apiServer.host,
    org: _apiServerOrg,
    cat: _apiServerCatalog,
    api: _apis.catalog.base_path,
    operation: "items"
  });


  var options = {
    method: 'GET',
    url: items_url,
    strictSSL: false,
    headers: {}
  };

  if (_apis.catalog.require.indexOf("client_id") != -1) options.headers["X-IBM-Client-Id"] = _myApp.client_id;
  if (_apis.catalog.require.indexOf("client_secret") != -1) options.headers["X-IBM-Client-Secret"] = _myApp.client_secret;

  // Apply the query filter, if one is present
  //if (typeof query.filter !== 'undefined') options.url += '?filter=' + JSON.stringify(query.filter);
  //else options.url += '?filter[order]=name%20ASC';

  return new Promise(function (fulfill) {

    // Get OAuth Access Token, if needed
    if (_apis.catalog.require.indexOf("oauth") != -1) {

      // If already logged in, add token to request
      if (typeof session.oauth2token !== 'undefined') {

        console.log("Render catalog with Token: " + session.oauth2token);
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

function setGetItemOptions(req, res) {
  var params = req.params;

  var item_url = api_url.stringify({
    protocol: _apiServer.protocol,
    host: _apiServer.host,
    org: _apiServerOrg,
    cat: _apiServerCatalog,
    api: _apis.catalog.base_path,
    operation: "items/" + params.id
  });

  var getItem_options = {
    method: 'GET',
    url: item_url,
    strictSSL: false,
    headers: {}
  };

  if (_apis.catalog.require.indexOf("client_id") != -1) getItem_options.headers["X-IBM-Client-Id"] = _myApp.client_id;
  if (_apis.catalog.require.indexOf("client_secret") != -1) getItem_options.headers["X-IBM-Client-Secret"] = _myApp.client_secret;

  return new Promise(function (fulfill) {

    // Get OAuth Access Token, if needed
    if (_apis.catalog.require.indexOf("oauth") != -1) {

      // If already logged in, add token to request
      if (typeof session.oauth2token !== 'undefined') {
        getItem_options.headers.Authorization = 'Bearer ' + session.oauth2token;
        fulfill({
          options: getItem_options,
          res: res
        });
      } else {
        // Otherwise redirect to login page
        res.redirect('/login');
      }

    }
    else fulfill({
      options: getItem_options,
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
        console.log("catalog call failed with reason: " + JSON.stringify(reason));
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
