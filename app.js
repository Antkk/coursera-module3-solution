(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItems)
.constant('ApiPath', "https://davids-restaurant.herokuapp.com/menu_items.json");

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrow = this;

  narrow.searchButton = function () {
    if (narrow.searchText === '') {
      narrow.nothingFound = true;
    } else {
      MenuSearchService.getMatchedMenuItems(narrow.searchText).then(function (filteredItems) {
        narrow.displayItems = filteredItems;
        if (narrow.displayItems.length === 0) {
          narrow.nothingFound = true;
        } else {
          narrow.nothingFound = false;
        }
      });
    }
  }

  narrow.removeItem = function (index) {
    narrow.displayItems.splice(index, 1);
    narrow.nothingFound = narrow.displayItems.length === 0;
  }
}

function FoundItems() {
  var ddo = {
    restrict: 'E',
    scope: {
      displayItems: '<',
      onRemove: '=',
      nothingFound: '<'
    },
    templateUrl: 'foundItems.html'
  }
  return ddo;
}

MenuSearchService.$inject = ['$http', 'ApiPath'];
function MenuSearchService($http, ApiPath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({url: ApiPath}).then(function (result) {
      var foundItems = [];
      for (var i = 0; i < result.data.menu_items.length; i++) {
         if (result.data.menu_items[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
           foundItems.push(result.data.menu_items[i]);
         }
      };
      return foundItems;
    });
  }
}

})();
