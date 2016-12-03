function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

var qbeon = angular.module('qbeon', ['duScroll']);
qbeon.controller('MainController', function(
	$scope,
	$window
) {
	$scope.locale = 'de_DE';
})

qbeon.controller('ArticleController', function(
	$scope,
	$window
) {
	$scope.formName = '';
	$scope.formEmail = '';
	$scope.formMessage = '';
	$scope.notificationNameWrong = false;
	$scope.notificationEmailWrong = false;
	$scope.notificationMessageWrong = false;
	$scope.notificationSending = false;
	$scope.notificationSuccess = false;
	$scope.notificationFailure = false;

	$scope.resetFields = function() {
		$scope.formName = '';
		$scope.formEmail = '';
		$scope.formMessage = '';
	}

	$scope.sendMessage = function() {
		var error = false;
		//verify name
		if($scope.formName.length < 1) {
			$scope.notificationNameWrong = true;
			error = true;
		} else {
			$scope.notificationNameWrong = false;
		}


		//verify email
		if(!validateEmail($scope.formEmail)) {
			$scope.notificationEmailWrong = true;
			error = true;
		} else {
			$scope.notificationEmailWrong = false;
		}

		//verify message
		if($scope.formMessage.length < 1) {
			$scope.notificationMessageWrong = true;
			error = true;
		} else {
			$scope.notificationMessageWrong = false;
		}

		if(!error) {
			var request = new XMLHttpRequest();
			$scope.notificationSending = true;
			request.onreadystatechange = function() {
				$scope.notificationSending = false;
				if(request.status == 201) {
					$scope.resetFields();
					$scope.notificationSuccess = true;
				} else {
					$scope.notificationFailure = true;
				}
			};
			request.open('GET', 'contact-inquiry?name=' + $scope.formName + '&email=' + $scope.formEmail + '&message=' + $scope.formMessage);
		}
	}
})