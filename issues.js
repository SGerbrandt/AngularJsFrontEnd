angular.module('AngularIssues', [])
.controller('Issues', function($scope, $http) {
	$scope.issues = [];
	$scope.pageCount = 0;
	$scope.pages = [];
	$scope.currPageNum = 1;
	
	// get date from 7 days ago and convert to ISO format
	var d = new Date();
    d.setDate(d.getDate()-7);
    var isoDate = d.toISOString();
    var addr = 'https://api.github.com/repos/angular/angular/issues';

    //called whenever the user selects a page # from the dropdown list
    $scope.getSpecificPage = function (pageNum) {
    	$scope.currPageNum = pageNum;
    	$http.get(addr + '?since=' + isoDate + '&page=' + $scope.currPageNum).
	    	then(function (response) {
	    		$scope.issues = response.data;
    	});
    }

    //initial get of the header info and the total number of pages plus displays the first page for us.
	$http.get(addr + '?since=' + isoDate + '&page=' + $scope.currPageNum).
		then(function (response) {
			console.log(response.headers('link'))
    		var linkData = response.headers('link');
    		var startIdx = linkData.search('rel="last"');
    		$scope.pageCount = linkData.charAt(startIdx-4); //sort of the worst way to get the total page count since if the format changes it breaks, but it was quick
    		for (var i = 1; i <= $scope.pageCount; i++) {
        			$scope.pages.push(i);
    		}
			$scope.issues = response.data;
	});
});