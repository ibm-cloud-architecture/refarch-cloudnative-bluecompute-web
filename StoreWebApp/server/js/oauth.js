var Promise = require('promise');
var UrlPattern = require('url-pattern');
var ClientOAuth2 = require('client-oauth2');
var config = require('config');

var api_url = new UrlPattern('(:protocol)\\://(:host)(/:org)(/:cat)(:api)(:operation)');
var _myApp = config.get('Application');
var _apiServer = config.get('API-Server');
var _apiServerOrg = ((_apiServer.org == "") || (typeof _apiServer.org == 'undefined')) ? undefined : _apiServer.org;
var _apiServerCatalog = ((_apiServer.catalog == "") || (typeof _apiServer.catalog == 'undefined')) ? undefined : _apiServer.catalog;
var _apis = config.get('APIs');

module.exports.login = function (username, password, session) {

  console.log("inside of oauth.js");
  return new Promise(function (fulfill, reject) {
    if (typeof session.oauth2token !== 'undefined') {
      console.log("Using OAuth Token: " + session.oauth2token);
      fulfill(session.oauth2token);
    }
    else {

      var authz_url = api_url.stringify({
        protocol: _apiServer.protocol,
        host: _apiServer.host,
        org: _apiServerOrg,
        cat: _apiServerCatalog,
        api: _apis.oauth20.base_path,
        operation: _apis.oauth20.paths.authz
      });



      var token_url = api_url.stringify({
        protocol: _apiServer.protocol,
        host: _apiServer.host,
        org: _apiServerOrg,
        cat: _apiServerCatalog,
        api: _apis.oauth20.base_path,
        operation: _apis.oauth20.paths.token
      });


      console.log("Invoke OAuth endpoint: " + JSON.stringify(token_url));
    /*  console.log("Invoke OAuth endpoint: " + JSON.stringify(_myApp.client_id));
      console.log("Invoke OAuth endpoint: " + JSON.stringify(_myApp.client_secret));
      console.log("Invoke OAuth endpoint: " + JSON.stringify(authz_url));
      console.log("Invoke OAuth endpoint: " + JSON.stringify(_apis.oauth20.grant_types));
      console.log("Invoke OAuth endpoint: " + JSON.stringify(_apis.oauth20.redirect_url));
      console.log("Invoke OAuth endpoint: " + JSON.stringify(_apis.oauth20.scopes)); */

      var thinkAuth = new ClientOAuth2({
        clientId: _myApp.client_id,
        clientSecret: _myApp.client_secret,
        accessTokenUri: token_url,
        authorizationUri: authz_url,
        authorizationGrants: _apis.oauth20.grant_types,
        redirectUri: _apis.oauth20.redirect_url,
        scopes: _apis.oauth20.scopes
      });



      // Set an option to disable the check for self-signed certificates
      var options = {
        options: {
          rejectUnauthorized: false
        }
      };

      thinkAuth.owner.getToken(username, password, options)
        .then(function (user) {
          session.oauth2token = user.accessToken;
          console.log("Using OAuth Token: " + session.oauth2token);
          fulfill(session.oauth2token);
        })
        .catch(function (reason) {
          reject(reason);
        });
    }
  });

};
