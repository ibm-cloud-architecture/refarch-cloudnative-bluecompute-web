app.controller('HomeController', ['$scope','UserInfoService',function($scope, UserInfoService) {

	console.log("Entering Home Controller")

	$scope.loggedIn = UserInfoService.state.authenticated

}]);
