var app = angular.module('App', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'index-tmpl',
			controller: 'SheetListController'
		})
		.when('/new', {
			templateUrl: 'new-tmpl',
			controller: 'CreationController'
		})
		.when('/sheet/:id', {
			templateUrl: 'sheet-tmpl',
			controller: 'SheetController'
		})
		.otherwise({
			redirectTo: '/'
		});	
}]);

app.controller('SheetListController', ['$scope', 'sheets', function SheetListController($scope, sheets) {
	$scope.list = sheets.list;
	console.log(JSON.stringify(sheets.list[0]));
}]);

app.controller('CreationController', ['$scope', '$location', 'sheets', function CreationController($scope, $location, sheets) {
	function createOrderLine() {
		return {
			productName: '',
			unitPrice: 0,
			count: 0
		};
	}

	$scope.lines = [createOrderLine()];

	$scope.initialize = function () {
		$scope.lines = [createOrderLine()];
	};

	$scope.addLine = function () {
		$scope.lines.push(createOrderLine());
	};

	$scope.save = function () {
		sheets.add($scope.lines);
		$location.path('/');
	};

	$scope.removeLine = function (target) {
		var lines = $scope.lines;
		var index = lines.indexOf(target);

		if (index !==  -1) {
			lines.splice(index, 1);
		}
	};

	$scope.getSubtotal = function (orderLine) {
		return orderLine.unitPrice * orderLine.count;
	};

	$scope.getTotalAmount = function (lines) {
		var totalAmount = 0;

		angular.forEach(lines, function (orderLine) {
			totalAmount += $scope.getSubtotal(orderLine);
		});

		return totalAmount;
	};
}]);

app.controller('SheetController', ['$scope', '$routeParams', 'sheets', function SheetController($scope, $routeParams, sheets) {
	var sheet = sheets.get($routeParams.id);

	angular.extend($scope, sheet);

	$scope.getSubtotal = function(orderline) {
	};

	$scope.getTotalAmount = function(lines) {
	};
}]);

app.service('sheets', [function () {
	this.list = []; // Ģɼ�ꥹ��

	// ���ٹԥꥹ�Ȥ������꿷����Ģɼ���������Ģɼ�ꥹ�Ȥ˲ä���
	this.add = function (lines) {
		this.list.push({
			id: String(this.list.length + 1),
			createdAt: Date.now(),
			lines: lines
		});

		console.log(this.list);
	};

	// Ǥ�դ� id ����ä�Ģɼ���֤�
	this.get = function (id) {
		var list = this.list;
		var index = list.length;
		var sheet;

		while (index--) {
			sheet = list[index];
			if (sheet.id === id) {
				return sheet;
			}
		}
		return null;
	};
}]);
