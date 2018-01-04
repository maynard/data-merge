(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
            })

            .when('/h2', {
                controller: 'Home2Controller',
                templateUrl: 'home2/home2.view.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
                controllerAs: 'vm'
            })

            .when('/define-master', {
                templateUrl: 'definemaster/define.master.view.html',
                controller: ['$scope', '$rootScope', 'UserService', function($scope, $rootScope, UserService) {

                    var vm = this;

                    initController();

                    function initController() {
                        loadCurrentUser();
                    }
                    function loadCurrentUser() {
                        UserService.GetByUsername($rootScope.globals.currentUser.username)
                            .then(function (user) {
                                vm.user = user;
                            });
                    }

                }]
            })

            .when('/define-master', {
                templateUrl: 'definemaster/define.master.view.html',
                controller: ['$scope', '$rootScope', 'UserService', function($scope, $rootScope, UserService) {

                }]
            })

            .when('/map-data', {
                templateUrl: 'map-data/map.data.view.html',
                controller: ['$scope', '$rootScope', 'UserService', function($scope, $rootScope, UserService) {

                }]
            })

            .when('/query-data', {
                templateUrl: 'query-data/query.data.view.html',
                controller: ['$scope', '$rootScope', 'UserService', function($scope, $rootScope, UserService) {

                }]
            })

            .when('/import-data', {
                templateUrl: 'import-data/import.data.view.html',
                controller: ['$scope', '$rootScope', 'UserService', function($scope, $rootScope, UserService) {

                    var vm = this;

                    initController();

                    function initController() {
                        loadCurrentUser();
                    }
                    function loadCurrentUser() {
                        UserService.GetByUsername($rootScope.globals.currentUser.username)
                            .then(function (user) {
                                vm.user = user;
                            });
                    }

                }]
            })

            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
    function run($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();