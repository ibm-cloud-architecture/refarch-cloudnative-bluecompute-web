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
var secretEnv = JSON.parse(process.env.objectstorage || "{}");

var containerName = _myApp.ObjectStorage.container,
    local_mode = _myApp.local_mode,
    auth = false,
    authSucess = false,
    storageClient;

init_object_storage();

function init_object_storage() {
    console.log("init object storage");
    var config = {};
    if (local_mode) {
        var username = "admin_ea2777264b5ce34c97eec50e90b8a827c9c08ec8",
            password = "",
            projectId = "acc42f2db0874f1bb797529aabbb5041",
            domainId = "f5cd32c788594b15bff1a093467e4864";


        config = {
            provider: 'openstack',
            useServiceCatalog: true,
            useInternal: false,
            keystoneAuthVersion: 'v3',
            authUrl: 'https://identity.open.softlayer.com',
            tenantId: projectId, //projectId from credentials
            domainId: domainId,
            username: username,
            password: password,
            region: 'dallas' //dallas or london region
        };
    } else {

        //var credentials = services['Object-Storage'][0].credentials;
        var credentials = secretEnv;
        console.log("Service Binding credential: " + JSON.stringify(credentials));

        config = {
            provider: 'openstack',
            useServiceCatalog: true,
            useInternal: false,
            keystoneAuthVersion: 'v3',
            authUrl: 'https://identity.open.softlayer.com',
            tenantId: credentials.projectId, //projectId from credentials
            domainId: credentials.domainId,
            username: credentials.username,
            password: credentials.password,
            region: credentials.region //dallas or london region
        };
    }
    storageClient = pkgcloud.storage.createClient(config);
    if (!auth) {
        storageClient.auth(function(err) {
            if (err) {
                console.log("Object Storage Auth error");
                console.error(err);
            } else {
                console.log("Object Storage Auth Succeed");
                authSucess = true;
            }
        });
        auth = true;
    }
}

//Download the file
router.get('/:fileName', function(req, res) {


    if (authSucess) {
        //console.log(storageClient._identity);
        storageClient.download({
            container: containerName,
            remote: req.params.fileName
        }).pipe(res);

    } else {
        res.status(500).send('Failed to authenticate to Object Storage!');
    }


    //res.writeHead(200, {'Content-Type': 'text/html'});
    //res.write();
    //res.end();


});


function renderErrorPage(function_input) {
    var err = function_input.err;
    var res = function_input.res;
    res.render('error', {
        reason: err
    });
}

module.exports = router;