app.factory('UserInfoService', ['$rootScope',function($rootScope) {
  /*
    return {
      accessToken: '',
      authenticated: false
    }; */

    var service = {
        state: {
          accessToken: '',
          authenticated: false
        },
      };

      function saveState() {
        sessionStorage.UserInfoService = angular.toJson(service.state);
      }
      function restoreState() {
        service.state = angular.fromJson(sessionStorage.UserInfoService);
      }
      $rootScope.$on("savestate", saveState);
      if (sessionStorage.UserInfoService) restoreState();

      return service;

  }]);
