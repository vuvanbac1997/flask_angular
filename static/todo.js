"use strict";
angular
    .module('TodoApp', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '../static/index.html',
                controller: 'TodoController'
            })
            .when('/secondPage', {
                templateUrl: '../static/secondPage.html',
                controller: 'SecondController'
            })
            .when('/editPage', {
                templateUrl: '../static/editPage.html',
                controller: 'TodoController'
            })
            .otherwise({ redirectTo: '/' });
    }])
    .factory('windowAlert', [
        '$window',
        function($window) {
            return $window.alert;
        }
    ])
    .controller('TodoController', [
        '$scope',
        '$http',
        'windowAlert',
        function($scope, $http, windowAlert) {

            // API Lay Du Lieu
            $http.get('/api/v1/article')
            .success(function(data, status) {
//            tra ve du lieu , .data la phia dau cua json tra ve
                $scope.articles = data.data
//                windowAlert("Get data Succesful");
            })
            .error(function(data, status, headers, config) {
                windowAlert("Get Data failed");
            });

            $scope.article = {};

            // API insert du lieu
            $scope.addItem = function(){
                if (!$scope.article.title || !$scope.article.content) {
                    windowAlert("Please fill both title and content");
                } else{
                   $http.post('/api/v1/article', $scope.article)
                    .success(function(data, status) {
                        $scope.getData();
//                        windowAlert("ADDED");
                    })
                    .error(function(data, status, headers, config) {
                        windowAlert("ADDING HAS FAIL");
                    });
                }

            };

            // Delete Data
            $scope.deleteData = function(id){
//               windowAlert(id);
                $http.delete('/api/v1/article', {params:{ _id:id}})
                    .success(function(data, status) {
                        $scope.getData();
//                        windowAlert("DELETED");
                    })
                    .error(function(data, status, headers, config) {
                        windowAlert("DELETING HAS ERROR");
                    });
            }

            $scope.infoArticle = {} ;
            $scope.hidden = "hidden";

            $scope.showEdit = function(){
                $scope.showcreate = false;
                $scope.showedit = true;
            }
            $scope.showCreate = function(){
                $scope.showcreate = true;
                $scope.showedit = false;
            }
            // Edit Data
            $scope.editData = function(id){
                $scope.showEdit();
                $http.get('/api/v1/article/edit', {params:{ id:id}})
                .success(function(data, status) {
                    $scope.infoArticle = data.data
//                    windowAlert($scope.infoArticle.title)
                })
                .error(function(data, status, headers, config) {
                    windowAlert("Get Data failed");
                });
            }

            $scope.upArticle = {} ;

            // Update Data
            $scope.updateData = function(){

                $scope.upArticle._id = $scope.infoArticle._id.$oid;
                $scope.upArticle.title = $scope.infoArticle.title;
                $scope.upArticle.content = $scope.infoArticle.content;

                $http.put('/api/v1/article', $scope.upArticle)
                .success(function(data, status) {
//                    windowAlert("Update Successful");
                    $scope.getData();
                })
                .error(function(data, status, headers, config) {
                    windowAlert("Update Fail");
                });

            }

            // Ham load lai data khi Add
            $scope.getData = function(){
                $http.get('/api/v1/article')
                .success(function(data, status) {
    //            tra ve du lieu , .data la phia dau cua json tra ve
                    $scope.articles = data.data
                })
                .error(function(data, status, headers, config) {
                    windowAlert("Get Data failed");
                });
            }
        }
    ])
    .directive('navtabs', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '../static/navtabs.html',
            scope: {
                pageName: '='
            },
            controller: [
                '$scope',
                function($scope) {
                    this.selectTabIfOnPage = function(tab) {
                        if (tab.name === $scope.pageName) {
                            tab.selected = true;
                        }
                    };
                }
            ]
        };
    })
    .directive('tab', function() {
        return {
            require: '^navtabs',
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {},
            template: '<li class="nav-item" ng-class="{ active: selected }"><a class="nav-link" href="{{ href }}" ng-transclude></a></li>',
            link: function(scope, element, attr, navtabsCtrl) {
                scope.name = attr.name;
                scope.href = attr.href;
                scope.selected = false;
                navtabsCtrl.selectTabIfOnPage(scope);
            }
        };
    })
    .controller('SecondController', [
        '$scope',
        function($scope) {
            $scope.state = {};
            $scope.state.pageName = 'secondPage';
        }
    ])
    ;
