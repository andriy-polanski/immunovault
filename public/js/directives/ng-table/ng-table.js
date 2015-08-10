(function(angular, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['angular'], function(angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(angular || null, function(angular) {
    'use strict';
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc module
 * @name ngTable
 * @description ngTable: Table + Angular JS
 * @example
 <doc:example>
 <doc:source>
 <script>
 var app = angular.module('myApp', ['ngTable']);
 app.controller('MyCtrl', function($scope) {
                    $scope.users = [
                        {name: "Moroni", age: 50},
                        {name: "Tiancum", age: 43},
                        {name: "Jacob", age: 27},
                        {name: "Nephi", age: 29},
                        {name: "Enos", age: 34}
                    ];
                });
 </script>
 <table ng-table class="table">
 <tr ng-repeat="user in users">
 <td data-title="'Name'">{{user.name}}</td>
 <td data-title="'Age'">{{user.age}}</td>
 </tr>
 </table>
 </doc:source>
 </doc:example>
 */
var app = angular.module('newhomezapp.module');
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc service
 * @name ngTable.factory:ngTableParams
 * @description Parameters manager for ngTable
 */
app.factory('ngTableParams', ['$q', '$log', function ($q, $log) {
    var isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    var ngTableParams = function (baseParameters, baseSettings) {
        var self = this,
            log = function () {
                if (settings.debugMode && $log.debug) {
                    $log.debug.apply(this, arguments);
                }
            };

        this.data = [];

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#parameters
         * @methodOf ngTable.factory:ngTableParams
         * @description Set new parameters or get current parameters
         *
         * @param {string} newParameters      New parameters
         * @param {string} parseParamsFromUrl Flag if parse parameters like in url
         * @returns {Object} Current parameters or `this`
         */
        this.parameters = function (newParameters, parseParamsFromUrl) {
            parseParamsFromUrl = parseParamsFromUrl || false;
            if (angular.isDefined(newParameters)) {
                for (var key in newParameters) {
                    var value = newParameters[key];
                    if (parseParamsFromUrl && key.indexOf('[') >= 0) {
                        var keys = key.split(/\[(.*)\]/).reverse()
                        var lastKey = '';
                        for (var i = 0, len = keys.length; i < len; i++) {
                            var name = keys[i];
                            if (name !== '') {
                                var v = value;
                                value = {};
                                value[lastKey = name] = (isNumber(v) ? parseFloat(v) : v);
                            }
                        }
                        if (lastKey === 'sorting') {
                            params[lastKey] = {};
                        }
                        params[lastKey] = angular.extend(params[lastKey] || {}, value[lastKey]);
                    } else {
                        params[key] = (isNumber(newParameters[key]) ? parseFloat(newParameters[key]) : newParameters[key]);
                    }
                }
                log('ngTable: set parameters', params);
                return this;
            }
            return params;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#settings
         * @methodOf ngTable.factory:ngTableParams
         * @description Set new settings for table
         *
         * @param {string} newSettings New settings or undefined
         * @returns {Object} Current settings or `this`
         */
        this.settings = function (newSettings) {
            if (angular.isDefined(newSettings)) {
                if (angular.isArray(newSettings.data)) {
                    //auto-set the total from passed in data
                    newSettings.total = newSettings.data.length;
                }
                settings = angular.extend(settings, newSettings);
                log('ngTable: set settings', settings);
                return this;
            }
            return settings;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#page
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter page not set return current page else set current page
         *
         * @param {string} page Page number
         * @returns {Object|Number} Current page or `this`
         */
        this.page = function (page) {
            return angular.isDefined(page) ? this.parameters({'page': page}) : params.page;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#total
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter total not set return current quantity else set quantity
         *
         * @param {string} total Total quantity of items
         * @returns {Object|Number} Current page or `this`
         */
        this.total = function (total) {
            return angular.isDefined(total) ? this.settings({'total': total}) : settings.total;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#count
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter count not set return current count per page else set count per page
         *
         * @param {string} count Count per number
         * @returns {Object|Number} Count per page or `this`
         */
        this.count = function (count) {
            if(angular.isDefined(params.onCount)) {
                params.onCount ( count );
            }
            // reset to first page because can be blank page
            return angular.isDefined(count) ? this.parameters({'count': count, 'page': 1}) : params.count;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#filter
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter page not set return current filter else set current filter
         *
         * @param {string} filter New filter
         * @returns {Object} Current filter or `this`
         */
        this.filter = function (filter) {
            return angular.isDefined(filter) ? this.parameters({'filter': filter}) : params.filter;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#sorting
         * @methodOf ngTable.factory:ngTableParams
         * @description If 'sorting' parameter is not set, return current sorting. Otherwise set current sorting.
         *
         * @param {string} sorting New sorting
         * @returns {Object} Current sorting or `this`
         */
        this.sorting = function (sorting) {
            if (arguments.length == 2) {
                var sortArray = {};
                sortArray[sorting] = arguments[1];
                this.parameters({'sorting': sortArray});
                return this;
            }
            return angular.isDefined(sorting) ? this.parameters({'sorting': sorting}) : params.sorting;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#isSortBy
         * @methodOf ngTable.factory:ngTableParams
         * @description Checks sort field
         *
         * @param {string} field     Field name
         * @param {string} direction Direction of sorting 'asc' or 'desc'
         * @returns {Array} Return true if field sorted by direction
         */
        this.isSortBy = function (field, direction) {
            return angular.isDefined(params.sorting[field]) && params.sorting[field] == direction;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#orderBy
         * @methodOf ngTable.factory:ngTableParams
         * @description Return object of sorting parameters for angular filter
         *
         * @returns {Array} Array like: [ '-name', '+age' ]
         */
        this.orderBy = function () {
            var sorting = [];
            for (var column in params.sorting) {
                sorting.push((params.sorting[column] === "asc" ? "+" : "-") + column);
            }
            return sorting;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#getData
         * @methodOf ngTable.factory:ngTableParams
         * @description Called when updated some of parameters for get new data
         *
         * @param {Object} $defer promise object
         * @param {Object} params New parameters
         */
        this.getData = function ($defer, params) {
            if (angular.isArray(this.data) && angular.isObject(params)) {
                $defer.resolve(this.data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            } else {
                $defer.resolve([]);
            }
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#getGroups
         * @methodOf ngTable.factory:ngTableParams
         * @description Return groups for table grouping
         */
        this.getGroups = function ($defer, column) {
            var defer = $q.defer();

            defer.promise.then(function (data) {
                var groups = {};
                angular.forEach(data, function (item) {
                    var groupName = angular.isFunction(column) ? column(item) : item[column];

                    groups[groupName] = groups[groupName] || {
                        data: []
                    };
                    groups[groupName]['value'] = groupName;
                    groups[groupName].data.push(item);
                });
                var result = [];
                for (var i in groups) {
                    result.push(groups[i]);
                }
                log('ngTable: refresh groups', result);
                $defer.resolve(result);
            });
            this.getData(defer, self);
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#generatePagesArray
         * @methodOf ngTable.factory:ngTableParams
         * @description Generate array of pages
         *
         * @param {boolean} currentPage which page must be active
         * @param {boolean} totalItems  Total quantity of items
         * @param {boolean} pageSize    Quantity of items on page
         * @returns {Array} Array of pages
         */
        this.generatePagesArray = function (currentPage, totalItems, pageSize) {
            var maxBlocks, maxPage, maxPivotPages, minPage, numPages, pages;
            maxBlocks = 11;
            pages = [];
            numPages = Math.ceil(totalItems / pageSize);
            if (numPages > 1) {
                pages.push({
                    type: 'prev',
                    number: Math.max(1, currentPage - 1),
                    active: currentPage > 1
                });
                pages.push({
                    type: 'first',
                    number: 1,
                    active: currentPage > 1
                });
                maxPivotPages = Math.round((maxBlocks - 5) / 2);
                minPage = Math.max(2, currentPage - maxPivotPages);
                maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
                minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));
                var i = minPage;
                while (i <= maxPage) {
                    if ((i === minPage && i !== 2) || (i === maxPage && i !== numPages - 1)) {
                        pages.push({
                            type: 'more',
                            active: false
                        });
                    } else {
                        pages.push({
                            type: 'page',
                            number: i,
                            active: currentPage !== i
                        });
                    }
                    i++;
                }
                pages.push({
                    type: 'last',
                    number: numPages,
                    active: currentPage !== numPages
                });
                pages.push({
                    type: 'next',
                    number: Math.min(numPages, currentPage + 1),
                    active: currentPage < numPages
                });
            }
            return pages;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#url
         * @methodOf ngTable.factory:ngTableParams
         * @description Return groups for table grouping
         *
         * @param {boolean} asString flag indicates return array of string or object
         * @returns {Array} If asString = true will be return array of url string parameters else key-value object
         */
        this.url = function (asString) {
            asString = asString || false;
            var pairs = (asString ? [] : {});
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var item = params[key],
                        name = encodeURIComponent(key);
                    if (typeof item === "object") {
                        for (var subkey in item) {
                            if (!angular.isUndefined(item[subkey]) && item[subkey] !== "") {
                                var pname = name + "[" + encodeURIComponent(subkey) + "]";
                                if (asString) {
                                    pairs.push(pname + "=" + item[subkey]);
                                } else {
                                    pairs[pname] = item[subkey];
                                }
                            }
                        }
                    } else if (!angular.isFunction(item) && !angular.isUndefined(item) && item !== "") {
                        if (asString) {
                            pairs.push(name + "=" + encodeURIComponent(item));
                        } else {
                            pairs[name] = encodeURIComponent(item);
                        }
                    }
                }
            }
            return pairs;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#reload
         * @methodOf ngTable.factory:ngTableParams
         * @description Reload table data
         */
        this.reload = function () {
            var $defer = $q.defer(),
                self = this;

            settings.$loading = true;
            if (settings.groupBy) {
                settings.getGroups($defer, settings.groupBy, this);
            } else {
                settings.getData($defer, this);
            }
            log('ngTable: reload data');
            $defer.promise.then(function (data) {
                settings.$loading = false;
                log('ngTable: current scope', settings.$scope);
                if (settings.groupBy) {
                    self.data = settings.$scope.$groups = data;
                } else {
                    self.data = settings.$scope.$data = data;
                }
                settings.$scope.pages = self.generatePagesArray(self.page(), self.total(), self.count());
                settings.$scope.$emit('ngTableAfterReloadData');
            });
        };

        this.reloadPages = function () {
            var self = this;
            settings.$scope.pages = self.generatePagesArray(self.page(), self.total(), self.count());
        };

        this.doFilterableAction = function ( data, except ){
            var conditions = params.filterable;
            if(typeof except != "undefined") {
                conditions = _.filter(conditions, function(item, name) {
                    return item.field.name != except.name;
                });
            }

            return _.filter ( data, function(item) {
                for(var name in conditions) {
                    var con = conditions[name];
                    var val;
                    if(_.isFunction(con.field.field)) {
                        val = con.field.field(item);
                    }
                    else {
                        val = item[con.field.field];
                    }

                    if(con.field.type == 'text' && con.value != "") {
                        if(_.isString(val)) {
                            if(val.toLowerCase().indexOf(con.value.toLowerCase()) == -1) return false;
                        }
                        else {
                            if(val != con.value) return false;
                        }
                    }
                    else if(con.field.type == 'dropdown' && con.value.length > 0) {
                        if(_.contains(con.value, val) != true) return false;
                    }
                    else if(con.field.type == 'date_range') {
                        val = Date.parse(val);
                        var start = Date.parse(con.value.start);
                        var end = Date.parse(con.value.end);

                        if( !_.isNaN(start) || !_.isNaN(end) ) {
                            if(_.isNaN(val)) return false;

                            if( !_.isNaN(start) && start > val ) return false;
                            if( !_.isNaN(end) && end < val ) return false;
                        }
                    }
                    else if(con.field.type == 'number_range') {
                        if(val < con.value.start || val > con.value.end) return false;
                    }
                }

                return true;
            });
        };
        this.getFilter = function ( field ) {
            if( typeof field == "undefined") return params.filterable;
            var val = params.filterable[field.name];
            if(typeof val == "undefined") {
                if(field.type == 'dropdown') val = [];
                else if (field.type == 'text') val = '';
                else if (field.type == 'date_range') val = { start: '', end: '' };
                else if (field.type == 'number_range') val = { start: field.options.min, end: field.options.max };
            }
            else {
                val = val.value;
            }
            return val;
        };
        this.setFilter = function ( field, value ) {
            params.filterable[field.field.name] = {
                field: field.field,
                items: field.items,
                value: value
            };
        };
        this.clearFilter = function ( field_name ) {
            if ( typeof field_name == "undefined" ) {
                params.filterable = {};
            }
            else {
                delete params.filterable[field_name];
            }
        };
        this.isFiltered = function( field_name ) {
            if(typeof params.filterable[field_name] == "undefined") return false;

            if(params.filterable[field_name].field.type == "text" && params.filterable[field_name].value != "") return true;
            if(params.filterable[field_name].field.type == "dropdown" && params.filterable[field_name].value.length > 0 && params.filterable[field_name].value.length < params.filterable[field_name].items.length) return true;
            if(params.filterable[field_name].field.type == 'date_range' && (!_.isNaN(Date.parse(params.filterable[field_name].value.start)) || !_.isNaN(Date.parse(params.filterable[field_name].value.end)) )) return true;
            if(params.filterable[field_name].field.type == "number_range" && (params.filterable[field_name].value.start != params.filterable[field_name].field.options.min || params.filterable[field_name].value.end != params.filterable[field_name].field.options.max)) return true;
            return false;
        };

        var params = this.$params = {
            page: 1,
            count: 1,
            filter: {},
            sorting: {},
            group: {},
            groupBy: null,
            filterable: {}
        };
        var settings = {
            $scope: null, // set by ngTable controller
            $loading: false,
            data: null, //allows data to be set when table is initialized
            total: 0,
            defaultSort: 'desc',
            filterDelay: 750,
            counts: [10, 25, 50, 100],
            getGroups: this.getGroups,
            getData: this.getData
        };

        this.settings(baseSettings);
        this.parameters(baseParameters, true);
        return this;
    };
    return ngTableParams;
}]);

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc object
 * @name ngTable.directive:ngTable.ngTableController
 *
 * @description
 * Each {@link ngTable.directive:ngTable ngTable} directive creates an instance of `ngTableController`
 */
var ngTableController = ['$scope', 'ngTableParams', '$timeout', '$q', function ($scope, ngTableParams, $timeout, $q) {
    $scope.$loading = false;

    if (!$scope.params) {
        $scope.params = new ngTableParams();
    }
    $scope.params.settings().$scope = $scope;

    var delayFilter = (function () {
        var timer = 0;
        return function (callback, ms) {
            $timeout.cancel(timer);
            timer = $timeout(callback, ms);
        };
    })();

    $scope.$watch('params.$params', function (newParams, oldParams) {
        $scope.params.settings().$scope = $scope;

        if (!angular.equals(newParams.filter, oldParams.filter)) {
            delayFilter(function () {
                $scope.params.$params.page = 1;
                $scope.params.reload();
            }, $scope.params.settings().filterDelay);
        } else {
            $scope.params.reload();
        }
    }, true);

    $scope.sortBy = function (column, event, dir) {
        var parsedSortable = $scope.parse(column.sortable);
        if (!parsedSortable) {
            return;
        }
        var defaultSort = $scope.params.settings().defaultSort;
        var inverseSort = (defaultSort === 'asc' ? 'desc' : 'asc');
        var sorting = $scope.params.sorting() && $scope.params.sorting()[parsedSortable] && ($scope.params.sorting()[parsedSortable] === defaultSort);
        var sortingParams = (event.ctrlKey || event.metaKey) ? $scope.params.sorting() : {};
        sortingParams[parsedSortable] = (typeof dir != "undefined") ? dir : (sorting ? inverseSort : defaultSort);
        $scope.params.parameters({
            sorting: sortingParams
        });
    };

    $scope.onColumnHeaderClick = function (column, event) {
        var parsedFilterable = $scope.parse(column.filterable);

        if(!parsedFilterable) {
            $scope.sortBy(column, event);
            return;
        }
        parsedFilterable.name = $scope.parse(column.title);
        parsedFilterable.align = parsedFilterable.align || 'RIGHT';
        parsedFilterable.type = parsedFilterable.type || 'text';

        var $defer = $q.defer();
        $scope.tableParams.settings().getFilteredData ($defer, $scope.params, parsedFilterable );

        $defer.promise
            .then( function (data) {                

                var filteringData = _.sortBy(
                    _.uniq ( 
                        _.map ( data, function ( item ) {
                            if(_.isFunction(parsedFilterable.field)) {
                                return parsedFilterable.field(item);
                            }
                            return item[parsedFilterable.field];
                        })
                    ),
                    function(item) {
                        return item;
                    }
                );

                filteringData = _.map ( filteringData, function (item) {
                    if(typeof parsedFilterable.render == "undefined") {
                        return {
                            value: item,
                            text: item
                        }
                    }
                    else {
                        return {
                            value: item,
                            text: parsedFilterable.render(item)
                        }
                    }
                });

                var left = parsedFilterable.align == 'LEFT' ? event.currentTarget.offsetLeft : event.currentTarget.offsetLeft + event.currentTarget.offsetWidth - 200;
                var top = event.currentTarget.offsetHeight + 1;
                $scope.filterable = {
                    show: true,
                    style: {left: left + 'px' , top: top + 'px' },
                    items: filteringData,
                    filters: _.clone($scope.tableParams.getFilter(parsedFilterable)),
                    field: parsedFilterable,
                    column: column,
                    selectall: false
                };
                if(parsedFilterable.type == 'dropdown' && $scope.filterable.filters.length == 0) {
                    $scope.filterable.filters = _.pluck( $scope.filterable.items, 'value');
                }
                $scope.filterable.selectall = $scope.filterable.items.length == $scope.filterable.filters.length;

            });

    };
    // $scope.$watch('filterable.selectall', function() {
    $scope.onSelectAll = function() {
        if($scope.filterable.selectall) {
            $scope.filterable.filters = _.pluck( $scope.filterable.items, 'value');
        }
        else {
            $scope.filterable.filters = [];
        }
    };
    $scope.$watch('filterable.filters', function() {
        if(typeof $scope.filterable.field == "undefined") return;
        if($scope.filterable.field.type == 'dropdown') {
            $scope.filterable.selectall = $scope.filterable.items.length == $scope.filterable.filters.length;
        }
    }, true);
    $scope.onFilterableSort = function (dir, $event) {
        $scope.filterable.show = false;

        if(typeof $scope.filterable.column == "undefined" || $scope.filterable.column == null) return;

        $scope.sortBy ( $scope.filterable.column, $event, dir );
    };
    $scope.onFilterableOK = function () {
        $scope.filterable.show = false;
        $scope.tableParams.setFilter ($scope.filterable, $scope.filterable.filters);
        $scope.tableParams.reload();
    };
    $scope.onClearFilter = function() {
        $scope.filterable.show = false;
        $scope.tableParams.clearFilter ( $scope.filterable.field.name );
        $scope.tableParams.reload();
    };

    $scope.onFilterableCancel = function() {
        $scope.filterable.show = false;
    };
    $scope.dateFormat = function(date, defaultValue) {
        if (date && !_.startsWith(date, '0000-00-00'))
            return moment(date).format('MMM D, YYYY');
        return defaultValue;
    };
    $scope.isFiltered = function(column) {

        return $scope.tableParams.isFiltered($scope.parse(column.title));

    };
}];
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc directive
 * @name ngTable.directive:ngTable
 * @restrict A
 *
 * @description
 * Directive that instantiates {@link ngTable.directive:ngTable.ngTableController ngTableController}.
 */
app.directive('ngTable', ['$compile', '$q', '$parse', '$templateCache',
    function ($compile, $q, $parse, $templateCache) {
        'use strict';

        return {
            restrict: 'A',
            priority: 1001,
            scope: true,
            controller: ngTableController,
            compile: function (element) {
                var columns = [], i = 0, row = null;

                // custom header
                var thead = element.find('thead');

                // IE 8 fix :not(.ng-table-group) selector
                angular.forEach(angular.element(element.find('tr')), function (tr) {
                    tr = angular.element(tr);
                    if (!tr.hasClass('ng-table-group') && !row) {
                        row = tr;
                    }
                });
                if (!row) {
                    return;
                }
                angular.forEach(row.find('td'), function (item) {
                    var el = angular.element(item);
                    if (el.attr('ignore-cell') && 'true' === el.attr('ignore-cell')) {
                        return;
                    }
                    var parsedAttribute = function (attr, defaultValue) {
                        return function (scope) {
                            return $parse(el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr))(scope, {
                                $columns: columns
                            }) || defaultValue;
                        };
                    };

                    var parsedTitle = parsedAttribute('title', ' '),
                        headerTemplateURL = parsedAttribute('header', false),
                        filter = parsedAttribute('filter', false)(),
                        filterTemplateURL = false,
                        filterName = false;

                    if (filter && filter.$$name) {
                        filterName = filter.$$name;
                        delete filter.$$name;
                    }
                    if (filter && filter.templateURL) {
                        filterTemplateURL = filter.templateURL;
                        delete filter.templateURL;
                    }

                    el.attr('data-title-text', parsedTitle()); // this used in responsive table
                    columns.push({
                        id: i++,
                        title: parsedTitle,
                        sortable: parsedAttribute('sortable', false),
                        filterable: parsedAttribute('filterable', false),
                        'class': el.attr('x-data-header-class') || el.attr('data-header-class') || el.attr('header-class'),
                        filter: filter,
                        filterTemplateURL: filterTemplateURL,
                        filterName: filterName,
                        headerTemplateURL: headerTemplateURL,
                        filterData: (el.attr("filter-data") ? el.attr("filter-data") : null),
                        show: (el.attr("ng-show") ? function (scope) {
                            return $parse(el.attr("ng-show"))(scope);
                        } : function () {
                            return true;
                        })
                    });
                });
                return function (scope, element, attrs) {
                    scope.$loading = false;
                    scope.$columns = columns;
                    scope.filterable = {
                        show: false,
                        style: {},
                        items: [],
                        filters: [] ,
                        options: {}
                    };

                    scope.$watch(attrs.ngTable, (function (params) {
                        if (angular.isUndefined(params)) {
                            return;
                        }
                        scope.paramsModel = $parse(attrs.ngTable);
                        scope.params = params;
                    }), true);
                    scope.parse = function (text) {
                        return angular.isDefined(text) ? text(scope) : '';
                    };
                    if (attrs.showFilter) {
                        scope.$parent.$watch(attrs.showFilter, function (value) {
                            scope.show_filter = value;
                        });
                    }
                    angular.forEach(columns, function (column) {
                        var def;
                        if (!column.filterData) {
                            return;
                        }
                        def = $parse(column.filterData)(scope, {
                            $column: column
                        });
                        if (!(angular.isObject(def) && angular.isObject(def.promise))) {
                            throw new Error('Function ' + column.filterData + ' must be instance of $q.defer()');
                        }
                        delete column.filterData;
                        return def.promise.then(function (data) {
                            if (!angular.isArray(data)) {
                                data = [];
                            }
                            data.unshift({
                                title: '-',
                                id: ''
                            });
                            column.data = data;
                        });
                    });
                    if (!element.hasClass('ng-table')) {
                        scope.templates = {
                            header: (attrs.templateHeader ? attrs.templateHeader : 'ng-table/header.html'),
                            pagination: (attrs.templatePagination ? attrs.templatePagination : 'ng-table/pager.html'),
                            filterable: 'ng-table/filterable.html'
                        };
                        var headerTemplate = thead.length > 0 ? thead : angular.element(document.createElement('thead')).attr('ng-include', 'templates.header');
                        var paginationTemplate = angular.element(document.createElement('div')).attr({
                            'ng-table-pagination': 'params',
                            'template-url': 'templates.pagination'
                        });
                        var filterableTemplate = $compile ( $templateCache.get(scope.templates.filterable) ) (scope);

                        element.find('thead').remove();

                        element.addClass('ng-table')
                            .prepend(headerTemplate)
                            .prepend(filterableTemplate)
                            .after(paginationTemplate);

                        $compile(headerTemplate)(scope);
                        $compile(paginationTemplate)(scope);
                    }
                };
            }
        }
    }
]);

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc directive
 * @name ngTable.directive:ngTablePagination
 * @restrict A
 */
app.directive('ngTablePagination', ['$compile',
    function ($compile) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                'params': '=ngTablePagination',
                'templateUrl': '='
            },
            replace: false,
            link: function (scope, element, attrs) {

                scope.params.settings().$scope.$on('ngTableAfterReloadData', function () {
                    scope.pages = scope.params.generatePagesArray(scope.params.page(), scope.params.total(), scope.params.count());
                }, true);

                scope.$watch('templateUrl', function(templateUrl) {
                    if (angular.isUndefined(templateUrl)) {
                        return;
                    }
                    var template = angular.element(document.createElement('div'))
                    template.attr({
                        'ng-include': 'templateUrl'
                    });
                    element.append(template);
                    $compile(template)(scope);
                });
            }
        };
    }
]);

angular.module('newhomezapp.module').run(['$templateCache', function ($templateCache) {
	$templateCache.put('ng-table/filters/select-multiple.html', '<select ng-options="data.id as data.title for data in column.data" multiple ng-multiple="true" ng-model="params.filter()[name]" ng-show="filter==\'select-multiple\'" class="filter filter-select-multiple form-control" name="{{column.filterName}}"> </select>');
	$templateCache.put('ng-table/filters/select.html', '<select ng-options="data.id as data.title for data in column.data" ng-model="params.filter()[name]" ng-show="filter==\'select\'" class="filter filter-select form-control" name="{{column.filterName}}"> </select>');
	$templateCache.put('ng-table/filters/text.html', '<input type="text" name="{{column.filterName}}" ng-model="params.filter()[name]" ng-if="filter==\'text\'" class="input-filter form-control"/>');
    $templateCache.put('ng-table/filterable.html', '<ul class="ng-table-filterable" ng-class="{dropdown: filterable.field.type == \'dropdown\',text: filterable.field.type == \'text\',date_range: filterable.field.type == \'date_range\',number_range: filterable.field.type == \'number_range\'}" ng-show="filterable.show" ng-style="filterable.style"><li><a href="" ng-click="onFilterableSort(\'asc\', $event)">Sort A-Z</a></li><li><a href="" ng-click="onFilterableSort(\'desc\', $event)">Sort Z-A</a></li><li><a href="" ng-click="onClearFilter()">Clear Filter</a></li><li>Filter</li><li><div class="filter"><ul ng-if="filterable.field.type == \'dropdown\'"><li><input type="checkbox" ng-model="filterable.selectall" ng-click="onSelectAll()" /><span>(Select all)</span></li><li ng-repeat="filter_item in filterable.items"><input type="checkbox" checklist-model="filterable.filters" checklist-value="filter_item.value" /><span ng-bind-html="filter_item.text"></span></li></ul><input type="text" ng-model="filterable.filters" ng-if="filterable.field.type == \'text\'" /><div ng-if="filterable.field.type == \'date_range\'" ng-if="filterable.field.type == \'date_range\'"><span class="label-date-range">From: </span><button type="button" class="btn btn-default btn-date-range" ng-bind="dateFormat(filterable.filters.start, \'From\' )" datepicker-popup ng-model="filterable.filters.start" is-open="isOpenDR_start" ng-mousedown="isOpenDR_start=!isOpenDR_start"></button><br /><span class="label-date-range">End: </span><button type="button" class="btn btn-default btn-date-range" ng-bind="dateFormat(filterable.filters.end, \'To\' )" datepicker-popup ng-model="filterable.filters.end" is-open="isOpenDR_end" ng-mousedown="isOpenDR_end=!isOpenDR_end"></button></div><div ng-if="filterable.field.type == \'number_range\'" range-slider min="filterable.field.options.min" max="filterable.field.options.max" model-min="filterable.filters.start" model-max="filterable.filters.end" attach-handle-values="true" show-values="true"></div></div></li><li class="buttons"><button class="btn btn-sm pull-right" ng-click="onFilterableCancel()">Cancel</button><button class="btn btn-success btn-sm pull-right ng-click-active" ng-click="onFilterableOK()"><i class="fa fa-check"></i> Done</button></li></ul>');
	$templateCache.put('ng-table/header.html', '<tr> <th ng-repeat="column in $columns" ng-class="{ \'sortable\': parse(column.sortable), \'sort-asc\': params.sorting()[parse(column.sortable)]==\'asc\', \'sort-desc\': params.sorting()[parse(column.sortable)]==\'desc\', \'filtered\': isFiltered(column) }" ng-click="onColumnHeaderClick(column, $event)" ng-show="column.show(this)" ng-init="template=column.headerTemplateURL(this)" class="header {{column.class}}"> <div ng-if="!template" ng-show="!template" ng-bind="parse(column.title)"></div> <div ng-if="template" ng-show="template"><div ng-include="template"></div></div> </th> </tr> <tr ng-show="show_filter" class="ng-table-filters"> <th ng-repeat="column in $columns" ng-show="column.show(this)" class="filter"> <div ng-repeat="(name, filter) in column.filter"> <div ng-if="column.filterTemplateURL" ng-show="column.filterTemplateURL"> <div ng-include="column.filterTemplateURL"></div> </div> <div ng-if="!column.filterTemplateURL" ng-show="!column.filterTemplateURL"> <div ng-include="\'ng-table/filters/\' + filter + \'.html\'"></div> </div> </div> </th> </tr>');
	$templateCache.put('ng-table/pager.html', '<div class="ng-cloak ng-table-pager"> <div ng-if="params.settings().counts.length" class="ng-table-counts btn-group pull-right"> <button ng-repeat="count in params.settings().counts" type="button" ng-class="{\'active\':params.count()==count}" ng-click="params.count(count)" class="btn btn-default"> <span ng-bind="count"></span> </button> </div> <ul class="pagination ng-table-pagination"> <li ng-class="{\'disabled\': !page.active}" ng-repeat="page in pages" ng-switch="page.type"> <a ng-switch-when="prev" ng-click="params.page(page.number)" href="">&laquo;</a> <a ng-switch-when="first" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="page" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="more" ng-click="params.page(page.number)" href="">&#8230;</a> <a ng-switch-when="last" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="next" ng-click="params.page(page.number)" href="">&raquo;</a> </li> </ul> </div> ');
}]);
    return app;
}));