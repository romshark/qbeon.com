function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

var qbeon = angular.module('qbeon', ['duScroll', 'ngAnimate', 'ngTouch', 'ngCookies', 'slickCarousel']);

qbeon.run([
'$rootScope',
function(
	$rootScope
) {
}])


qbeon.controller('MainController', function(
	$scope,
	$window,
	$cookies,
	$interval
) {
	window.scrollTo(0,0);
	$scope.locales = {
		'en_US': 'English',
		'de_DE': 'Deutsch',
		'ru_RU': 'Русский'
	}
	
	$scope.locale = $cookies.get('lang');
	if($scope.locale == null) {
		$scope.locale = 'en_US';
		$scope.langSelector = true;
		$scope.modalOpen = true;
	} else {
		$scope.langSelector = false;
		$scope.modalOpen = false;
	}

	$scope.showLangSelector = function() {
		$scope.langSelector = true;
		$scope.modalOpen = true;
		window.scrollTo(0,0);
	}

	$scope.selectLanguage = function(locale) {
		if(!(locale in $scope.locales)) {
			return;
		}
		$scope.langSelector = false;
		$scope.locale = locale;
		$scope.modalOpen = false;
		$cookies.put('lang', locale);
	}

	$scope.layer = 'apps';
	$scope.layerAutoplay = true;
	$scope.layerIntervalDuration = 6000;
	
	$scope.toNextLayer = function(stopAutoplay) {
		if(stopAutoplay) {
			$scope.layerAutoplay = false;
		}
		switch($scope.layer) {
			case 'apps':
				$scope.layer = 'qubeos';
				break;
			case 'qubeos':
				$scope.layer = 'middleware';
				break;
			case 'middleware':
				$scope.layer = 'hypervisor';
				break;
			case 'hypervisor':
				$scope.layer = 'machines';
				break;
			case 'machines':
				$scope.layer = 'apps';
				break;
		}
	}

	$scope.toPreviousLayer = function(stopAutoplay) {
		if(stopAutoplay) {
			$scope.layerAutoplay = false;
		}
		switch($scope.layer) {
			case 'qubeos':
				$scope.layer = 'apps';
				break;
			case 'middleware':
				$scope.layer = 'qubeos';
				break;
			case 'hypervisor':
				$scope.layer = 'middleware';
				break;
			case 'machines':
				$scope.layer = 'hypervisor';
				break;
			case 'apps':
				$scope.layer = 'machines';
				break;
		}
	}

	$scope.toLayer = function(layerName, stopAutoplay) {
		if(stopAutoplay) {
			$scope.layerAutoplay = false;
		}
		$scope.layer = layerName;
	}

	$scope.layerInterval = $interval(function() {
		if($scope.layerAutoplay) {
			$scope.toNextLayer(false);
		}
	}, $scope.layerIntervalDuration);
})

qbeon.controller('ArticleController', function(
	$scope,
	$window
) {
	$scope.curAppInSlider = 0;
	$scope.appSlider = {
		enabled: true,
		draggable: true,
		autoplay: true,
		autoplaySpeed: 4000,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		method: {},
		event: {
			afterChange: function (event, slick, currentSlide, nextSlide) {
				$scope.curAppInSlider = currentSlide;
			},
			init: function (event, slick) {
				slick.slickGoTo($scope.curAppInSlider);
			},
		}
	}

	$scope.goToAppSlide = function(slideNumber) {
		$scope.appSlider.method.slickGoTo(slideNumber);
		$scope.appSlider.method.slickPause();
	}

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
				switch(request.readyState) {
					case 0:
					case 1:
					case 2:
					case 3:
						break;
					case 4:
						$scope.resetFields();
						$scope.notificationSending = false;
						$scope.notificationSuccess = true;
						break;
					default:
						$scope.notificationFailure = true;
				}
			};
			request.open('GET', '/contact-inquiry?name=' + $scope.formName + '&email=' + $scope.formEmail + '&message=' + $scope.formMessage, true);
			request.send(null);
		}
	}
})