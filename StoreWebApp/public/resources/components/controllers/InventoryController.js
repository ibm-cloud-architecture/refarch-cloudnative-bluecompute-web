app.controller('InventoryController', ['$scope','BlueAPIService',function($scope, BlueAPIService) {

	console.log("Entering Inventory Controller")
	$scope.baseURL = "https://api.us.apiconnect.ibmcloud.com/centusibmcom-cloudnative-dev/bluecompute"

	BlueAPIService.getInventory(function (response) {
			console.log("Get Inventory Result" + response)
			$scope.itemList = response.data

		}, function (error){
			console.log("Get Inventory Error: " + error);
	});

}]);
