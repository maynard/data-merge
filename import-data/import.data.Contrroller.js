(function () {
    'use strict';

    angular
        .module('app')
        .controller('DefinemasterController', DefinemasterController);

    DefinemasterController.$inject = ['UserService', '$rootScope'];
    function DefinemasterController(UserService, $rootScope) {
        var vm = this;

        console.log('THIS IS A TEST');

    }

})();