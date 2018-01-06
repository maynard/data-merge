(function () {
    'use strict';

    angular
        .module('app')
        .controller('ImportdataController', ImportdataController);

    ImportdataController.$inject = ['UserService', '$http', '$rootScope'];
    function ImportdataController(UserService, $http, $rootScope) {
        var vm = this;

        console.log('THIS IS A TEST');

    }

})();