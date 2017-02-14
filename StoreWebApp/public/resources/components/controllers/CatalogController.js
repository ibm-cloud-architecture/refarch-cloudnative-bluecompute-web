app.controller('CatalogController', ['$scope','BlueAPIService',function($scope, BlueAPIService) {

	console.log("Entering Catalog Controller")
	//$scope.baseURL = "https://api.us.apiconnect.ibmcloud.com/centusibmcom-cloudnative-dev/bluecompute"
	$scope.baseURL = "/image/"

	BlueAPIService.getCatalog(function (response) {
			console.log("Get Catalog Result" + response)
			$scope.itemList = response.data

		}, function (error){
			console.log("Get Inventory Error: " + error);
	});

}]);
