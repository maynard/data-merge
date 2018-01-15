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

            .when('/connect', {
                controller: 'ConnectController',
                templateUrl: 'app-views/connect.view.html',
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

            .when('/edit', {
                templateUrl: 'edit-user/edit.user.view.html',
                controllerAs: 'vm',
                controller: ['$scope', '$http', '$rootScope', 'FlashService', 'UserService', function($scope, $http, $rootScope, FlashService, UserService) {

                    UserService.GetByUsername($rootScope.globals.currentUser.username)
                        .then(function (response) {
                            console.log('============ ' + response.first_name);

                            $scope.firstName = response.first_name;
                            $scope.lastName = response.last_name;
                            $scope.email = response.email;
                            $scope.username = response.username;
                            $scope.password = response.password;
                        });
                    $scope.edit = function() {
                        console.log('Editing profile...');

                        var body = {};
                        body.firstName = $scope.firstName;
                        body.lastName = $scope.lastName;
                        body.email = $scope.email;
                        body.username = $scope.username;
                        body.password = $scope.password;

                        UserService.Update(body)
                            .then(function (response) {
                                FlashService.Success('Profile edit successful', true);
                            });
                    }

                }]
            })

            .when('/define-master', {
                templateUrl: 'definemaster/define.master.view.html',
                controller: ['$scope', '$http', '$rootScope', '$location', '$window', 'UserService', function($scope, $http, $rootScope, location, window, UserService) {

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


                    var url = 'http://localhost:1337/master/fields/' + $rootScope.globals.currentUser.username;
                    $http.get(url).then(function (response) {
                        $scope.fields = response.data;
                    }, function (response) {
                        console.error(response);
                    });


                    $scope.deleteFld = function(fld) {
                        var url = 'http://localhost:1337/master/'+ $rootScope.globals.currentUser.username +'?field_name=' + fld;
                        $http.delete(url).then(function (response) {
                        }, function (response) {
                            console.log(response);
                        });
                        window.location.reload();
                    };

                    $scope.submitForm = function() {
                        var data = {};
                        data.choices = $scope.choiceSet.choices;
                        data.username = $rootScope.globals.currentUser.username;
                        var url = 'http://localhost:1337/master';
                        $http.post(url, data, config).then(function (response) {
                        }, function (response) {
                            console.log(response);
                        });
                        //window.location.reload();
                        location.path('/map-data');

                    }

                }]
            })

            .when('/map-data', {
                controller: 'MapController',
                templateUrl: 'app-views/map.data.view.html',
                controllerAs: 'vm'
            })

            .when('/view-result', {
                templateUrl: 'view-result/view.result.html',
                controller: ['$scope', '$http', '$rootScope', 'FlashService', 'UserService', function($scope, $http, $rootScope, FlashService, UserService) {

                    //var randomObject = {"id":352,"first_name":"Audrey","last_name":"Wroughton","email":"awroughton9r@paginegialle.it","gender":"Female"};
                    var randomObject = $rootScope.result;
                    randomObject.circularRef = randomObject;
                    var ppTable = prettyPrint(randomObject);
                    document.getElementById('debug').appendChild(ppTable);

                }]
            })

            .when('/query-data', {
                controller: 'QueryController',
                templateUrl: 'app-views/query.data.view.html',
                controllerAs: 'vm'
            })

            .when('/import-data', {
                templateUrl: 'import-data/import.data.view.html',
                controller: ['$scope', '$http', '$rootScope', 'FlashService', 'UserService', function($scope, $http, $rootScope, FlashService, UserService) {

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

                        var url = 'http://localhost:1337/files/import/' + $rootScope.globals.currentUser.username;

                        $http.post(url, data, config).then(function (response) {
                            // This function handles success
                            console.log(response);
                        }, function (response) {
                            // this function handles error
                            console.error(response);
                            FlashService.Error('This file has already been imported.');
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