var app = angular.module(`myApp`, []);
const {ipcRenderer} = require(`electron`);

app.controller(`mainCtrl`, function ($scope, $http) {
	// array of people used to display queue
	$scope.people = [];
	// list of units to populate dropdown list
	$scope.units =
	[
		`Introduction to Programming`,
		`Object Oriented Programming`,
		`Creating Web Applications`,
		`Other`
	];
	$scope.error = null;
  $scope.addPerson = function() {
		// adds person to queue and logs the request in json file
		var name = $scope.pname;
		var unit = $scope.punit;
		var desc = $scope.pdesc;
		// validates fields
		if (name != null && name != `` && unit != null && unit != `` && desc != null && unit != ``) {
			// adds user to queue
			$scope.people.push({name: name, unit: unit, desc: desc});
			var ts = new Date().getTime();
			var data = {time: ts, unit: unit, desc: desc};
			// sends a request to main.js to log request in json file
			ipcRenderer.send(`add_person`, data);
			// listens and logs reply
			ipcRenderer.on(`add_person_reply`, function(event, arg) {
				console.log(arg);
			});
			//clears fields
			$scope.pname = null;
			$scope.punit = null;
			$scope.pdesc = null;
			$scope.error = null;
		} else {
			// outputs an error message if field is left blank
			$scope.error = `please complete all fields`;
		}
  }
  $scope.removePerson = function(item) {
		// removes person from queue
    $scope.people.splice(item, 1);
  }
	$scope.isEnter = function(event) {
		// event listener for enter key to add person
    if (event.charCode == 13)
        $scope.addPerson();
	}
});
