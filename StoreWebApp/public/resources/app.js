var app = angular.module('ibm-cloud-arch', ['ngRoute']);
var baseUrl = '/components/views/';

fetchData().then(bootstrapApp);

function fetchData() {
    var initInjector = angular.injector(["ng"]);
    var $http = initInjector.get("$http");

    return $http.get("catalog/config").then(function(response) {
        app.constant("CONFIG", response.data);
				console.log("Boostrap success")
    }, function(error) {
        console.log("Error bootstraping application: "+ error)
    });
}

function bootstrapApp() {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ["ibm-cloud-arch"]);
    });
}

app.run(function($rootScope) {
  window.onbeforeunload = function(event) {
    $rootScope.$broadcast('savestate');
  };
});

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
		.when('/customer', {
       templateUrl : baseUrl + 'customer.html',
       controller: 'CustomerController'
    })
    .otherwise({
        redirectTo: '/home'
      });
 }]);
