(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', 'uuid', '$filter', '$q'];
    function UserService($http, uuid, $filter, $q) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('http://localhost:1337/users')
                .then(function(response){
                        return response.data;
                    },
                    function(response){
                        console.log(response);
                        return null;
                    });
        }

        function GetById(id) {
            return $http.get('http://localhost:1337/users/id/' + id)
                .then(function(response){
                        return response.data;
                    },
                    function(response){
                        console.log(response);
                        return null;
                    });
        }

        function GetByUsername(username) {
            return $http.get('http://localhost:1337/users/username/' + username)
                .then(function(response){
                        return response.data;
                    },
                    function(response){
                        console.log(response);
                        return null;
                    });
        }

        function Create(user) {
            var deferred = $q.defer();

            GetByUsername(user.username)
                .then(function (duplicateUser) {
                    if (duplicateUser !== null) {
                        deferred.resolve({ success: false, message: 'Username "' + user.username + '" is already taken' });
                    } else {
                        user.id = uuid.v4();

                        return $http.post('http://localhost:1337/users', user)
                            .then(function(response){
                                    console.log('INSERTED');

                                    // setup
                                    return $http.get('http://localhost:1337/users/setup/' + user.username)
                                        .then(function(response){
                                                console.log(response);
                                                deferred.resolve({ success: true });
                                            },
                                            function(response){
                                                console.log(response);
                                            });
                                },
                                function(response){
                                    console.error(response);
                                });

                    }
                });
            return deferred.promise;

        }

        function Update(user) {
            return $http.put('http://localhost:1337/users/username/' + user.username, user)
                .then(function(response){
                        return response;
                    },
                    function(response){
                        console.log(response);
                        return null;
                    });
        }

        function Delete(id) {
            //return $http.delete('http://localhost:1337/users/' + id).then(handleSuccess, handleError('Error deleting user'));
            return $http.delete('http://localhost:1337/users/username/' + username)
                .then(function(response){
                        return response;
                    },
                    function(response){
                        console.log(response);
                        return null;
                    });

        }

        // private functions
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
