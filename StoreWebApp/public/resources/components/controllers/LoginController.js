app.controller('LoginController', ['$scope','$location','BlueAPIService','UserInfoService', 'CONFIG', function($scope, $location, BlueAPIService, UserInfoService, CONFIG) {

	console.log("Entering Login Controller")
	$scope.loggedIn = UserInfoService.state.authenticated
	$scope.loginError = false;

	 $scope.save = function (loginForm) {

		 $scope.payload = 'grant_type=password&scope=blue&username='+$scope.username+'&password='+$scope.password

		 BlueAPIService.loginUser($scope.payload, function (response) {
	 			console.log("Login Result" + response)
				UserInfoService.state.accessToken = response.data.access_token
				UserInfoService.state.authenticated = true;
				$location.path('/catalog');

	 		}, function (error){
	 			console.log("Login Error: " + error);
				$scope.loginError = true;
	 	});

	 }
}]);
