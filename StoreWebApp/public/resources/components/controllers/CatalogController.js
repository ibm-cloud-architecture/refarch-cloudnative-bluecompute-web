app.controller('CatalogController', ['$scope','BlueAPIService','UserInfoService',function($scope, BlueAPIService, UserInfoService) {

	console.log("Entering Catalog Controller")
	$scope.baseURL = "/image/"
	$scope.loggedIn = UserInfoService.state.authenticated

	BlueAPIService.getCatalog(function (response) {
			console.log("Get Catalog Result" + response)
			$scope.itemList = response.data

		}, function (error){
			console.log("Get Inventory Error: " + error);
	});

}]);
