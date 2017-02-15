app.controller('ItemController', ['$scope','$routeParams','BlueAPIService',function($scope,$routeParams,BlueAPIService) {

	console.log("Entering Inventory Controller")
	$scope.baseURL = "/image/"

	BlueAPIService.getItemById($routeParams.id, function (response) {
			console.log("Get Item Detail Result" + response)
			$scope.item = response.data
			BlueAPIService.getItemReviewById($routeParams.id, function (response) {
					console.log("Get Item Review List Result" + response)
					$scope.itemReviewList = response.data

				}, function (error){
					console.log("Get Item Review List Error: " + error);
			});

		}, function (error){
			console.log("Get Item Detail Result Error: " + error);
	});

}]);
