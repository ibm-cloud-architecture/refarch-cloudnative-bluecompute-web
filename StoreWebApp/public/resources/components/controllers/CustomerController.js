app.controller('CustomerController', ['$scope','$routeParams','$location','UserInfoService','BlueAPIService',function($scope, $routeParams, $location, UserInfoService, BlueAPIService){

	console.log("Entering Home Controller")

	$scope.loggedIn = UserInfoService.state.authenticated

	BlueAPIService.getCustomerProfile(UserInfoService.state.accessToken, function (response) {
		 console.log("Customer Profile Result" + response)
		 $scope.customerInfo = response.data[0];

	 }, function (error){
		 console.log("Customer Profile Error: " + error);

    });

    var catalogMap = {};
    BlueAPIService.getCatalog(function (response) {
        var catalog = response.data;
        for (let i = 0; i < catalog.length; i++) {
            var cat = catalog[i];
            catalogMap[cat.id] = cat.name;
        }

        BlueAPIService.getCustomerOrders(UserInfoService.state.accessToken, function (response) {
            console.log("Get Orders Result" + response.data)
            var ordersData = response.data;
            var ordersInfo = [];
            for (let i = 0; i < ordersData.length; i++) {
                let o = ordersData[i];
                ordersInfo.push({date: o.date, itemId: o.itemId, itemName: catalogMap[o.itemId], count: o.count});
            }
            $scope.ordersInfo = ordersInfo;
        }, function (error){
            console.log("Get Orders Error: " + error);
        });
	}, function (error){
		 console.log("Get Catalog Error: " + error);
    });





}]);
