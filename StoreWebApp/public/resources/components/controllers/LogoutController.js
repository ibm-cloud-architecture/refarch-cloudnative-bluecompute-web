app.controller('LogoutController', ['$scope','$location','UserInfoService', 'CONFIG', function($scope, $location, UserInfoService, CONFIG) {

	console.log("Entering Logout Controller");
	//$scope.loggedIn = UserInfoService.state.authenticated;
	//$scope.logoutError = false;

  // Reset the UserInfoService and clear the sessionStorage
	UserInfoService.state.authenticated = false;
	UserInfoService.state.accessToken = '';
	sessionStorage.clear();
  $location.path('/catalog');

}]);
