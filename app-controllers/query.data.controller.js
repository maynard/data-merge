(function () {
    'use strict';

    angular
        .module('app')
        .controller('QueryController', QueryController);

    QueryController.$inject = ['$scope', '$document', '$http', '$rootScope', '$location', '$window', 'UserService'];
    function QueryController($scope, document, $http, $rootScope, location, window, UserService) {
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

        $scope.selectFld = function(val) {
            console.log('val= ' + val)
            $scope.fldVal = val;
            $scope.fldResults = "";
        };

        //////////////////////////////////////////////////////////////////////////////////////////////////
        $scope.showAdvanced = true;
        $scope.showSimple = false;

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

        $scope.fldKeyed = function(e) {

            //console.dir(e.originalEvent.path[0].value);
            var body = {};
            body.term = e.originalEvent.path[0].value;

            var url = 'http://localhost:1337/search/fields/' + $rootScope.globals.currentUser.username;
            $http.post(url, body).then(function (response) {
                console.log(response.data);
                $scope.fldResults = response.data;
            }, function (response) {
                console.error(response);
            });

        };

    }

})();