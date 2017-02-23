app.controller('LoginController', ['$scope','$location','BlueAPIService','UserInfoService', 'CONFIG', function($scope, $location, BlueAPIService, UserInfoService, CONFIG) {

	console.log("Entering Login Controller")
	$scope.loggedIn = UserInfoService.authenticated
	$scope.loginError = false;

	 $scope.save = function (loginForm) {

		 $scope.payload = 'grant_type=password&scope=blue&username='+$scope.username+'&password='+$scope.password+'&client_id='+CONFIG.Application.client_id

		 BlueAPIService.loginUser($scope.payload, function (response) {
	 			console.log("Login Result" + response)
				UserInfoService.accessToken = response.data.access_token
				UserInfoService.authenticated = true;
				$location.path('/catalog');

	 		}, function (error){
	 			console.log("Login Error: " + error);
				$scope.loginError = true;
	 	});

	 }
}]);
