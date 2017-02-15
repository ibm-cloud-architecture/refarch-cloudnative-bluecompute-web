var express = require('express');
var router = express.Router();
var http = require('request-promise-json');
var Promise = require('promise');
var UrlPattern = require('url-pattern');
var config = require('config');
var pkgcloud = require('pkgcloud');


// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
var _myApp = config.get('Application');
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");

var containerName="os-container1", local_mode=_myApp.local_mode, auth=false, storageClient;

init_object_storage();

function init_object_storage() {
  var config = {};
  if(local_mode)
  {/*
    var username = "xxx",
        password = "xxx",
        projectId = "688d49f5f5784aa8a36450c7b36c3ddf",
        domainId = "f5cd32c788594b15bff1a093467e4864";*/

    var username = "admin_21b66b75c4173e796c897bf16c9e13f361d2b4ff",
       password = "W}O1uDxV6pbX-l_c",
       projectId = "688d49f5f5784aa8a36450c7b36c3ddf",
       domainId = "f5cd32c788594b15bff1a093467e4864";

    config = {
      provider: 'openstack',
      useServiceCatalog: true,
      useInternal: false,
      keystoneAuthVersion: 'v3',
      authUrl: 'https://identity.open.softlayer.com',
      tenantId: projectId,    //projectId from credentials
      domainId: domainId,
      username: username,
      password: password,
      region: 'dallas'   //dallas or london region
    };
  }
  else {

    var credentials = services['Object-Storage'][0]['credentials'];
    console.log("VCAP credential: " + JSON.stringify(credentials));

    config = {
          provider: 'openstack',
          useServiceCatalog: true,
          useInternal: false,
          keystoneAuthVersion: 'v3',
          authUrl: 'https://identity.open.softlayer.com',
          tenantId: credentials.projectId,    //projectId from credentials
          domainId: credentials.domainId,
          username: credentials.username,
          password: credentials.password,
          region: credentials.region   //dallas or london region
        };
  }
  storageClient = pkgcloud.storage.createClient(config);
}

//Download the file
router.get('/:fileName', function(req, res){

  if(!auth)
  {
    storageClient.auth(function(err) {
        if (err) {
            console.error(err);
        }
        else {
            //console.log(storageClient._identity);
        }
    });
    auth = true;
  }

  storageClient.download({
    container: containerName,
    remote: req.params.fileName
  }).pipe(res);


    //res.writeHead(200, {'Content-Type': 'text/html'});
    //res.write();
    //res.end();
    return;

});


function renderErrorPage(function_input) {
  var err = function_input.err;
  var res = function_input.res;
  res.render('error', {reason: err});
}

module.exports = router;
