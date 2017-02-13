app.controller('ItemController', ['$scope','$routeParams','BlueAPIService',function($scope,$routeParams,BlueAPIService) {

	console.log("Entering Inventory Controller")
	$scope.baseURL = "https://api.us.apiconnect.ibmcloud.com/centusibmcom-cloudnative-dev/bluecompute"

	BlueAPIService.getItemById($routeParams.id, function (response) {
			console.log("Get Inventory Result" + response)
			$scope.item = response.data

		}, function (error){
			console.log("Get Inventory Error: " + error);
	});

}]);
