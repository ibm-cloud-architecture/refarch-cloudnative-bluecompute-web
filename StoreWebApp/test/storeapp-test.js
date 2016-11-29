const assert = require('chai').assert;
const expect = require('chai').expect;
//const chaiJquery  = require('chai-jquery')
const request = require('request');

// Register the plugin
//chai.use(chaiJquery);

var cfenv = require('cfenv');
// get the app environment from Cloud Foundry
//var appEnv = cfenv.getAppEnv();

describe('BlueCompute Web App Test Suites', function() {


	//console.log(process.env);
	//console.log("################");
	//console.log("App Name" + appEnv.name);
	//var serviceBaseUrl = "http://localhost:8000";
	var serviceBaseUrl = "https://bluecompute-web-gangchen-dev.mybluemix.net";
	if (process.env.test_env == 'cloud') {
		serviceBaseUrl = 'http://' + appEnv.name + '.mybluemix.net';
	}

	// test the home page loading
	describe('when request the home page', function() {
		it('should return valid HTML page', function(done) {

			var endPoint = serviceBaseUrl;

      request(endPoint, function(error, response, body){

				  //console.log(body);

          // Parse the home page HTML and expect the right content
				  expect(error).to.not.be.ok;
          expect(error).to.be.null;
				  expect(response).to.have.property('statusCode', 200);
          expect(response).to.be.html;
          expect(body).to.include('BlueCompute Store!');
          expect(body).to.include('<!DOCTYPE html>');
          expect(body).to.include('IBM Cloud Architecture Center');

				  done();
			});
		});
	});


});
