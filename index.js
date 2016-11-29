function removeClass(object, clName) {
	var regex = new RegExp(clName, "g");
	object.className = object.className.replace(regex, '');
}

function addClass(object, clName) {
	if(object.className.search(new RegExp(clName, "g")) != -1) {
		return;
	}
	object.className += ' ' + clName;
}

function getFields() {
	var fields = {};
	fields['name'] = document.getElementById("form-name");
	fields['email'] = document.getElementById("form-email");
	fields['message'] = document.getElementById("form-message");
	return fields;
}

function getNotifications() {
	var notifications = {};
	notifications['name'] = document.getElementById("form-wrong-name");
	notifications['email'] = document.getElementById("form-wrong-email");
	notifications['message'] = document.getElementById("form-wrong-message");
	notifications['sending'] = document.getElementById("form-sending");
	notifications['success'] = document.getElementById("form-success");
	notifications['error'] = document.getElementById("form-error");
	return notifications;
}

function resetFields() {
	fields = getFields();
	fields['name'].value = '';
	fields['email'].value = '';
	fields['message'].value = '';
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function sendmail(name, email, message) {
	var fields = getFields();
	var notifications = getNotifications();
	var request = new XMLHttpRequest();
	request.open("GET","/contact-inquiry?name=" + fields['name'].value + '&email=' + fields['email'].value + '&message=' + fields['message'].value);
	removeClass(notifications['sending'], 'hidden');
	request.addEventListener('load', function(event) {
		addClass(notifications['sending'], 'hidden');
		if(request.status == 201) {
			//sent
			resetFields();
			removeClass(notifications['success'], 'hidden');
		} else {
			//could not send inquiry
			removeClass(notifications['error'], 'hidden');
		}
	});
	request.send();
}

function send() {
	var fields = getFields();
	var notifications = getNotifications();
	var error = false;
	//verify name
	if(fields['name'].value.length < 1) {
		removeClass(notifications['name'], 'hidden');
		error = true;
	} else {
		addClass(notifications['name'], 'hidden');
	}

	//verify email
	if(!validateEmail(fields['email'].value)) {
		removeClass(notifications['email'], 'hidden');
		error = true;
	} else {
		addClass(notifications['email'], 'hidden');
	}

	//verify message
	if(fields['message'].value.length < 1) {
		removeClass(notifications['message'], 'hidden');
		error = true;
	} else {
		addClass(notifications['message'], 'hidden');
	}

	if(!error) {
		sendmail();
	}
}