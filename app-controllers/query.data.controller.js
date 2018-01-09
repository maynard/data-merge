(function () {
    'use strict';

    angular
        .module('app')
        .controller('QueryController', QueryController);

    QueryController.$inject = ['$scope', '$http', '$rootScope', '$location', '$window', 'UserService'];
    function QueryController($scope, $http, $rootScope, location, window, UserService) {
        var vm = this;

        $scope.choiceSet = {choices: []};
        $scope.quest = {};

        $scope.choiceSet.choices = [];
        $scope.addNewChoice = function () {
            $scope.choiceSet.choices.push('');
        };

        $scope.removeChoice = function (z) {
            //var lastItem = $scope.choiceSet.choices.length - 1;
            $scope.choiceSet.choices.splice(z,1);
        };

        $scope.showAdvanced = false;
        $scope.showSimple = true;

        $scope.toggleAdvanced = function(){
            $scope.showAdvanced = !$scope.showAdvanced;
            $scope.showSimple = !$scope.showSimple;
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        $scope.viewResult = function(res) {
            //res = JSON.stringify(res);
            $rootScope.result = res;
            console.log('RES= '+ $rootScope.result);
            location.path('/view-result');
        };


        $scope.enter = function(e) {

            console.dir(e.originalEvent.path[0].value);
            var body = {};
            body.term = e.originalEvent.path[0].value;

            var url = 'http://localhost:1337/search/' + $rootScope.globals.currentUser.username;
            $http.post(url, body).then(function (response) {
                console.dir(response)
                $scope.searchResults = response.data;
            }, function (response) {
                console.error(response);
            });

        };

        $scope.query = function() {

            var body = {};
            body.term = angular.element('#search').value;
            console.log('TERM: ' + $scope.term);

            var url = 'http://localhost:1337/search/' + $rootScope.globals.currentUser.username;
            $http.post(url, body).then(function (response) {
                $scope.searchResults = response.data;
            }, function (response) {
                console.error(response);
            });


        }



    }

})();