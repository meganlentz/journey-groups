'use strict';

/**
 * @ngdoc function
 * @name jgroupsApp.controller:GroupCtrl
 * @description
 * # GroupCtrl
 * Controller of the jgroupsApp
 */
angular.module('jgroupsApp')
  .controller('GroupCtrl', function($scope, $http) {
    $scope.saving = false;
    $scope.group = {};
    setTimeout(function() {
      $('#jg-yourname').focus();
    }, 500);

    $scope.startAGroup = function() {
      $scope.saving = true;
      $scope.group.public_search_listed = false;
      $scope.group.listed = false;
      $scope.group.group_type_id = '1';

      $http({
        method: 'post',
        url: 'group',
        data: $scope.group
      }).success(function(evt) {
        if (!evt || !evt.success) {
          alert(evt && evt.result || 'We had some trouble sending your group request. Would you try again later, or ask for help?')
        }
        else {
          alert('Created! We will be in touch soon!');
          $scope.group = {};
        }
        $scope.saving = false;
      });
    };
  });
