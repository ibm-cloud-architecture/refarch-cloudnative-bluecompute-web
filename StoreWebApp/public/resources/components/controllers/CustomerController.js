app.controller('CustomerController', ['$scope','$routeParams','$location','UserInfoService','BlueAPIService',function($scope, $routeParams, $location, UserInfoService, BlueAPIService){

	console.log("Entering Home Controller")

	$scope.loggedIn = UserInfoService.state.authenticated

	BlueAPIService.getCustomerProfile(UserInfoService.state.accessToken, function (response) {
		 console.log("Customer Profile Result" + response)
		 $scope.customerInfo = response.data

	 }, function (error){
		 console.log("Customer Profile Error: " + error);
 });

}]);
