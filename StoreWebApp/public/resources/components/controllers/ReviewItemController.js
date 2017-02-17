app.controller('ReviewItemController', ['$scope','$routeParams','UserInfoService','BlueAPIService',function($scope, $routeParams, UserInfoService, BlueAPIService) {

	console.log("Entering Review Item Controller")

	$scope.loggedIn = UserInfoService.authenticated

  $scope.addReview = function () {

  			$scope.payload = {
                          'reviewer_name':$scope.reviewer_name,
  												'reviewer_email':$scope.reviewer_email,
                          'rating':$scope.rating,
                          'comment':$scope.comments
  											}

  			BlueAPIService.addReviewItem(UserInfoService.accessToken, $routeParams.id, $scope.payload, function (response) {
  					console.log("Add Review Item Result" + response)
  					$scope.result = response.data

  				}, function (error){
  					console.log("Add Review Item Error: " + error);
  			});

  }

}]);
