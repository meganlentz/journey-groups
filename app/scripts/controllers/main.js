'use strict';

/**
 * @ngdoc function
 * @name jgroupsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jgroupsApp
 */
angular.module('jgroupsApp')
  .controller('MainCtrl', function($scope, $http) {
    $scope.search = {
      type: 'NONE',
      when: 'ANY',
      time: 'NONE',
      people: 'NONE',
      ages: 'ANY',
      childcare: false
    };

    $scope.updateResults = function() {
      delete $scope.results;

      ga('send', {
        hitType: 'event',
        eventCategory: 'form',
        eventAction: 'submit',
        eventLabel: 'query'
      });
      $http({
        method: 'post',
        url: 'query',
        data: $scope.search
      }).success(function(evt) {
        if (!evt || !evt.success) {
          alert(evt && evt.result || 'We had some trouble looking for groups. Would you try again later, or ask for help?')
        }
        else if (!evt.result || evt.result.length === 0) {
          alert('No groups match what you searched for!');
        }
        else {
          ga('send', {
            hitType: 'event',
            eventCategory: 'form',
            eventAction: 'submit',
            eventLabel: 'result',
            eventValue: evt && evt.result && evt.result.length || 0
          });
          $scope.results = evt.result;

          setTimeout(function() {
            var resultsAnchor = document.getElementById('results');
            resultsAnchor && resultsAnchor.scrollIntoView && resultsAnchor.scrollIntoView();
          }, 100);
        }
      });
    };
  });
