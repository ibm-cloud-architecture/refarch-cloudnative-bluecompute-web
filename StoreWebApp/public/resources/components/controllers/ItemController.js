app.controller('ItemController', ['$scope','$routeParams','BlueAPIService','UserInfoService',function($scope,$routeParams,BlueAPIService, UserInfoService) {

	console.log("Entering Inventory Controller")
	$scope.baseURL = "/image/"
	$scope.loggedIn = UserInfoService.authenticated

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
