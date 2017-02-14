var app = angular.module('ibm-cloud-arch', ['ngRoute']);
var baseUrl = '/components/views/';

app.config(['$routeProvider', function($routeProvider) {

	console.log("entering Angular config");

	$routeProvider.when('/home', {
       templateUrl : baseUrl + 'home.html',
       controller: 'HomeController'
    })
    .when('/login', {
       templateUrl : baseUrl + 'login.html',
       controller: 'LoginController'
    })
		.when('/catalog', {
       templateUrl : baseUrl + 'catalog.html',
       controller: 'CatalogController'
    })
		.when('/item/:id', {
       templateUrl : baseUrl + 'item.html',
       controller: 'ItemController'
    })
    .otherwise({
        redirectTo: '/home'
      });
 }]);
