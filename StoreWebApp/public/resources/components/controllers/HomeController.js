app.controller('HomeController', ['$scope', 'UserInfoService', 'CONFIG', function($scope, UserInfoService, CONFIG) {

	console.log("Entering Home Controller")

	$scope.loggedIn = UserInfoService.state.authenticated
	var cluster_name = CONFIG.Application.cluster_name;
	var region = CONFIG.Application.region;

	if (cluster_name && cluster_name !== "") {
		$scope.clusterAndRegion = ("\nHosted in cluster \"" + cluster_name + "\"");
	}

	if (region && region !== "") {
		$scope.clusterAndRegion += (" in region \"" + region + "\"");
	}

}]);