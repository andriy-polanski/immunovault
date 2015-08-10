'use strict';

angular
  .module('newhomezapp.module')
    .directive('ngReturn', function () {
      return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
          if(event.which === 13) {
            scope.$apply(function (){
              scope.$eval(attrs.ngReturn);
            });

            event.preventDefault();
          }
        });
      };
    })
    .directive('ngInitialFocus', ['$timeout', function ($timeout) {
        return function (scope, element, attrs) {
            $timeout(function() {
                $timeout(function() {
                    var $element = angular.element(element);
                    $element.click();
                    $element.focus();
                }, 750);
            });
        };
    }])
    .directive('showTab', function() {
      return function($scope, $element, $attrs) {

        var hideAllTabs = function() {
            $element.parent().parent().parent().parent().parent().find('.tab-content .tab-pane').removeClass('active');
        };

        var showOnlyTab = function() {
            angular.element($attrs.showTab).addClass('active');
        };

        $element.click(function() {
            
            hideAllTabs();

            showOnlyTab();

        });
      };
    })
    .directive('fileUploader', ['Upload', '$q', function(Upload, $q) {
      return {
        restrict: 'A',
        scope: {
          callback:'=fileUploader',
          before: '=fileUploaderBefore',
          error: '=fileUploaderError',
          progress: '=fileUploaderProgress',
          remove: '=removeCallback',
          model: '=ngModel',
          multiple: '@multiple',
          photoResize: '@photoResize'
        },
        link: function($scope, $elem, $attrs) {
          
          $elem.css('position', 'relative');
          var $file = angular.element('<input type="file" style="opacity:0;position:absolute;left:0px;top:0px;width:100%;height:100%;pointer-events: none;" />');
          if(!$scope.multiple) {
            $scope.multiple = false;
          }
          else {
            $file.attr('multiple', 'multiple');
          }
          if(!$scope.photoResize) $scope.photoResize = false;
          else $scope.photoResize = true;
          $elem.append($file);
          $file
            .change(function() {
              if(this.files.length == 0) return;

              $scope.upload(this.files);
            });

          $scope.upload = function(files) {
            if(typeof $scope.before !== 'undefined' && $scope.before !== null) {
              $scope.before();
            }

            var $promises = [];
            var urls = [];

            var uploadFile = function(file, index) {
              var deferred = $q.defer();

              Upload.upload({
                url: 'file/upload',
                file: file,
                fields: {resize: $scope.photoResize}
              }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                if($scope.progress) {
                    $scope.progress(progressPercentage, evt.loaded, evt.total, index);
                }
              }).success(function (data, status, headers, config) {
                urls.push(data.url);
                deferred.resolve(data.url);
              }).error(function (data, status, headers, config) {
                if($scope.error) {
                  $scope.error(data, index);
                }
                deferred.resolve('');
              });

              return deferred.promise;
            };

            _.each(files, function(file, index) {
              if(!$scope.multiple && index != 0) return;

              $promises.push(uploadFile(file, index));
            });

            $q.all($promises)
              .then(function() {
                if($scope.callback) {
                  $scope.callback($scope.multiple ? urls : (urls.length == 0 ? '' : urls[0]));
                }
              });
          };
          
          var $trash = angular.element('<a style="position:absolute;right:10px;top:10px;width:32px;height:32px;pointer-events: none;"><i class="fa fa-trash fa-lg"></i></a>');
          $elem.append($trash);
          $trash
            .click(function() {
              if(!confirm('Are you sure to remove this image?')) return;

              if($scope.remove) {
                  $scope.remove();
              }
            });

          var $drop = angular.element('<div style="position:absolute;left:0px;top:0px;width:100%;height:100%;border:2px dotted #ccc;display:none;pointer-events: none;"><span style="position:absolute;left:50%;top:50%;color:#333;font-size:20px;margin-left:-80px;margin-top:-25px;text-align:center;pointer-events: none;">Drop here to upload</span></div>')
          $elem.append($drop);
          angular.element('body').bind('dragover', function(e){
            e.stopPropagation();
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = 'copy';
            $drop.show();
          });

          angular.element('body').bind('dragleave', function(e){
            $drop.hide();
          });

          $elem.bind('drop', function(e){
            e.stopPropagation();
            e.preventDefault();

            $drop.hide();

            var files = e.originalEvent.dataTransfer.files;
            files = Array.prototype.slice.call(files); //convert filelist to file array
            files = _.map(files, function(f){
              return _.extend(f, {
                url: URL.createObjectURL(f)
              });
            });
            $scope.upload(files);
          });

          $scope.$watch('model', function() {

            if($scope.model !== '' && $scope.model) {
              $trash.show();
            }
            else {
              $trash.hide();
            }
          });
            
        }
      };
    }]);