app.service('BlueAPIService',['$http', 'CONFIG', '$base64', function($http, CONFIG, $base64) {

	var invokeService = function(restUrl,
			requestType, parameters, successCallback,
			errorCallback, access_token) {

		//$http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

		if (requestType == 'GET') {
			$http({
				  method: 'GET',
				  url: restUrl
				}).then(successCallback, errorCallback);
		}
		else if (requestType == 'GET_AUTH') {
			$http({
				headers: {
				//	"Content-Type": 'application/x-www-form-urlencoded'
					"Authorization": 'Bearer '+ access_token
					},
				  method: 'GET',
				  url: restUrl
				}).then(successCallback, errorCallback);
		}
		else if (requestType == 'DELETE'){
			$http({
					method: 'DELETE',
					url: restUrl
				}).then(successCallback, errorCallback);
		}else if (requestType == 'POST_AUTH'){
			$http({
				headers: {
				//	"Content-Type": 'application/x-www-form-urlencoded'
					"Authorization": 'Bearer '+ access_token
				},
				method: 'POST',
				url: restUrl,
				data: parameters
				}).then(successCallback, errorCallback);
		}
		else {
			var basicAuthToken = CONFIG["Auth-Server"].client_id + ":" + CONFIG["Auth-Server"].client_secret;
			var authToken = 'Basic ' + $base64.encode(basicAuthToken);
			console.log("BasiAuth of " + basicAuthToken + " 64 encoded token: " + authToken);
			console.log("with Url parameter: " + JSON.stringify(parameters));
			$http({
					headers: {
						'Authorization': authToken,
						"Content-Type": 'application/x-www-form-urlencoded'
						//"Authorization": 'Basic ' + authToken
					},
					method: 'POST',
					url: restUrl,
					data: parameters
				}).then(successCallback, errorCallback);
		}
	}
		return  {
			getCatalog : function(successCallback, errorCallback) {
				var restUrl = 'catalog/';
				var requestType = 'GET';
				invokeService(restUrl, requestType, null, successCallback, errorCallback);
			},
			getItemById : function(itemId, successCallback, errorCallback) {
				var restUrl = 'catalog/' + itemId;
				var requestType = 'GET';
				invokeService(restUrl, requestType, null, successCallback, errorCallback);
			},
			getItemReviewById : function(itemId, successCallback, errorCallback) {
				var restUrl = 'review/' + itemId;
				var requestType = 'GET';
				invokeService(restUrl, requestType, null, successCallback, errorCallback);
			},
			loginUser : function(parameters, successCallback, errorCallback) {
				//var restUrl = CONFIG["Auth-Server"].protocol + '://' + CONFIG["Auth-Server"].host + '/oauth/token'
				var restUrl = 'oauth/token'
				var requestType = 'POST';
				invokeService(restUrl, requestType, parameters, successCallback, errorCallback);
			},
			buyItems : function(access_token, parameters, successCallback, errorCallback) {
				var restUrl = 'order/';
				var requestType = 'POST_AUTH';
				invokeService(restUrl, requestType, parameters, successCallback, errorCallback, access_token);
			},
			addReviewItem : function(access_token, itemId, parameters, successCallback, errorCallback) {
				var restUrl = 'review/' + itemId;
				var requestType = 'POST_AUTH';
				invokeService(restUrl, requestType, parameters, successCallback, errorCallback, access_token);
			},
			getCustomerProfile : function(access_token, successCallback, errorCallback) {
				var restUrl = 'customer/';
				var requestType = 'GET_AUTH';
				invokeService(restUrl, requestType, null, successCallback, errorCallback, access_token);
			},
			getCustomerOrders : function(access_token, successCallback, errorCallback) {
				var restUrl = 'order/';
				var requestType = 'GET_AUTH';
				invokeService(restUrl, requestType, null, successCallback, errorCallback, access_token);
			}

		}
}]);
