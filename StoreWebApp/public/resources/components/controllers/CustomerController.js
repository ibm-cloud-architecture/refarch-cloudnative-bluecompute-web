app.controller('CustomerController', ['$scope','$routeParams','$location','UserInfoService','BlueAPIService',function($scope, $routeParams, $location, UserInfoService, BlueAPIService){

	console.log("Entering Home Controller")

	$scope.loggedIn = UserInfoService.authenticated

	BlueAPIService.getCustomerProfile(UserInfoService.accessToken, function (response) {
		 console.log("Customer Profile Result" + response)
		 $scope.customerInfo = response.data

	 }, function (error){
		 console.log("Customer Profile Error: " + error);
 });

}]);
