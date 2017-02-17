app.controller('ReviewItemController', ['$scope','$routeParams','UserInfoService','BlueAPIService',function($scope, $routeParams, UserInfoService, BlueAPIService) {

	console.log("Entering Review Item Controller")

	$scope.loggedIn = UserInfoService.authenticated

	angular.element('#stars').starrr();

	$scope.getStars = function () {
			$scope.count = angular.element('#stars').find('.fa-star.fa');
	}

  $scope.addReview = function () {

  			$scope.payload = {
                          'reviewer_name':$scope.reviewer_name,
  												'reviewer_email':$scope.reviewer_email,
                          'rating':$scope.count.length,
                          'comment':$scope.comments
  											}

  			BlueAPIService.addReviewItem(UserInfoService.accessToken, $routeParams.id, $scope.payload, function (response) {
  					console.log("Add Review Item Result" + response)
  					$scope.result = response.data
						$location.path('item/'+$routeParams.id);

  				}, function (error){
  					console.log("Add Review Item Error: " + error);
  			});

  }

}]);
