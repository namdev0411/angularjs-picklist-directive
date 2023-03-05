var app = angular.module("myApp", []);

app.controller("MainCtrl", function ($scope) {
    $scope.genderOptions = [
        { label: "男", value: "男" },
        { label: "女", value: "女" },
    ];

    $scope.selectedGenderOption = null;
});


app.directive("customPicklist", function ($document) {
  return {
    restrict: "E",
    scope: {
      options: "=",
      selectedOption: "=",
    },
    templateUrl: "my-picklist-template.html",
    link: function (scope, element, attrs) {
      scope.defaultNull = { label: "--なし--", value: null };
      scope.options = [scope.defaultNull,...scope.options];
      scope.showPicklist = false;

      // Hàm chọn option
      scope.selectOption = function (option) {
        if(option && option.value === null){
            scope.selectedOption = null;
        }else{
            scope.selectedOption = option;
        }
        scope.showPicklist = false; // ẩn picklist
      };

      // Hàm toggle picklist
      scope.togglePicklist = function () {
        scope.showPicklist = !scope.showPicklist;
      };

      // Hàm kiểm tra xem element có nằm trong picklist hay không
      var isDescendant = function (parent, child) {
        var node = child.parentNode;
        while (node != null) {
          if (node == parent) {
            return true;
          }
          node = node.parentNode;
        }
        return false;
      };

      // Xử lý sự kiện click outside picklist
      var handleClickOutside = function (event) {
        var isClickedElementWithinPicklist = isDescendant(
          element[0],
          event.target
        );
        if (!isClickedElementWithinPicklist) {
          scope.$apply(function () {
            scope.showPicklist = false;
          });
        }
      };

      // Đăng ký sự kiện click document
      $document.on("click", handleClickOutside);

      // Cleanup khi directive bị destroy
      scope.$on("$destroy", function () {
        $document.off("click", handleClickOutside);
      });
    },
  };
});
