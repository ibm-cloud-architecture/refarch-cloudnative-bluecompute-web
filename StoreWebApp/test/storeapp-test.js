const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require('request');

describe('BlueCompute Web App Test Suites', function() {

	// Running the test locally
	var serviceBaseUrl = "http://localhost:8000";

	if (process.env.test_env == 'cloud') {
		//console.log("App Name" + appEnv.name);
		serviceBaseUrl = 'http://' + process.env.appname + '.mybluemix.net';
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

	// test the inventory page rendering
	describe('when request the path /inventory', function() {
		it('should return valid HTML page with a list of items', function(done) {

			var endPoint = serviceBaseUrl + "/inventory";

      request(endPoint, function(error, response, body){

				  //console.log(body);

          // Parse the home page HTML and expect the right content
				  expect(error).to.not.be.ok;
          expect(error).to.be.null;
				  expect(response).to.have.property('statusCode', 200);
          expect(response).to.be.html;

          expect(body).to.include('<!DOCTYPE html>');
          expect(body).to.include('IBM Cloud Architecture Center');
					expect(body).to.include('Dayton Meat Chopper');
					expect(body).to.include('Hollerith Tabulator');

				  done();
			});
		});
	});

	// test the first item in the default database
	describe('when request the path /item/13401', function() {
		it('should return valid HTML page with item detail', function(done) {

			var endPoint = serviceBaseUrl + "/item/13401";

      request(endPoint, function(error, response, body){

				  //console.log(body);

          // Parse the home page HTML and expect the right content
				  expect(error).to.not.be.ok;
          expect(error).to.be.null;
				  expect(response).to.have.property('statusCode', 200);
          expect(response).to.be.html;

          expect(body).to.include('<!DOCTYPE html>');
          expect(body).to.include('IBM Cloud Architecture Center');
					expect(body).to.include('Dayton Meat Chopper');
					expect(body).to.include('$4599');

				  done();
			});
		});
	});


});
