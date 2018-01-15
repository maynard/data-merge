(function () {
    'use strict';

    angular
        .module('app')
        .controller('MapController', MapController);

    MapController.$inject = ['$scope', '$http', '$rootScope', '$location', '$window', 'UserService'];
    function MapController($scope, $http, $rootScope, location, window, UserService) {
        var vm = this;

        var url = 'http://localhost:1337/master/fields/' + $rootScope.globals.currentUser.username;
        $http.get(url).then(function (response) {
            $scope.fields = response.data;
        }, function (response) {
            console.error(response);
        });

        $scope.selectTableFields = function (table) {
            $rootScope.currentDb = table;
            var url = 'http://localhost:1337/databases/fields/' + $rootScope.globals.currentUser.username +"?table=" + table;
            $http.get(url).then(function (response) {
                $scope.tableFields = response.data;
            }, function (response) {
                console.error(response);
            });
        };

        var url = 'http://localhost:1337/databases/' + $rootScope.globals.currentUser.username;
        $http.get(url).then(function (response) {
            $scope.tables = response.data;
        }, function (response) {
            console.error(response);
        });

        var url = 'http://localhost:1337/master/fields/json/' + $rootScope.globals.currentUser.username;
        $http.get(url).then(function (response) {
            $scope.fieldsJson = response.data;
            console.log('$scope.fieldsJson= ' + JSON.stringify($scope.fieldsJson));
        }, function (response) {
            console.error(response);
        });

        //$scope.selectedItem="";
        $scope.mapField = function(tableFld) {
            console.log('$scope.selectedItem= ' + angular.element('#sel')[0].value);
            console.log('tableFld= ' + tableFld);

            var body = {};
            body.master_id = angular.element('#sel')[0].value;
            body.field_name = tableFld;

            var url = 'http://localhost:1337/alias/' + $rootScope.globals.currentUser.username;
            $http.post(url, body).then(function (response) {
                console.log(response);
            }, function (response) {
                console.error(response);
            });

            //window.location.reload();
        };

        var url = 'http://localhost:1337/master/alias/' + $rootScope.globals.currentUser.username;
        $http.get(url).then(function (response) {
            $scope.masterAlias = response.data;
            console.log('masterAlias = ' + $scope.masterAlias);
        }, function (response) {
            console.error(response);
        });


    }

})();