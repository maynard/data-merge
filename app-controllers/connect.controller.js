(function () {
    'use strict';

    angular
        .module('app')
        .controller('ConnectController', ConnectController);

    ConnectController.$inject = ['UserService', '$rootScope'];
    function ConnectController(UserService, $rootScope) {
        var vm = this;

        vm.myVariable = "This is My Variable";
        console.log('****************************************************************');
        console.log('vm.myVariable = ' + vm.myVariable)


    }

})();