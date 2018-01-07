(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'angular-uuid'])
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
                controller: ['$scope', '$http', '$rootScope', 'UserService', function($scope, $http, $rootScope, UserService) {

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


                    $scope.submitForm = function() {

                        console.dir($scope.choiceSet.choices);

                        var data = {};
                        data.choices = $scope.choiceSet.choices;
                        data.username = $rootScope.globals.currentUser.username;

                        var url = 'http://localhost:1337/master';

                        $http.post(url, data, config).then(function (response) {
                            // This function handles success
                            console.error(response);
                        }, function (response) {
                            // this function handles error
                            console.error(response);
                        });

                    }

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
                controller: ['$scope', '$http', '$rootScope', 'UserService', function($scope, $http, $rootScope, UserService) {

                    $scope.submitFile = function(){
                        //console.log($scope.fileURL);
                        //console.log($scope.dbName);
                        //console.log($scope.delimiter[0]);
                        //console.log($rootScope.globals.currentUser.username);

                        var data = {};
                        data.fileUrl = $scope.fileURL;
                        data.table = $scope.dbName;
                        data.delimiter = $scope.delimiter[0];
                        data.username = $rootScope.globals.currentUser.username;
                        data = JSON.stringify(data);

                        console.log(data);

                        var url = 'http://localhost:1337/transfer';

                        $http.post(url, data, config).then(function (response) {
                            // This function handles success
                            console.error(response);
                        }, function (response) {
                            // this function handles error
                            console.error(response);
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