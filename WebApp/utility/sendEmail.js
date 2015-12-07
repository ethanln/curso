'use strict';

// not in use as of 6/16/15


var config = require('../config');
var nodemailer = require('nodemailer');
var auth = {
	user: config.emailAddress,
	pass: config.emailPassword
}

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: auth
});

var sendEmail = function(serviceRequest, callback){
	var mailOptions = {
		from: 'someemail@gmail.com',
		to: serviceRequest.email,
		subject: 'Curso registration success',
		text: 'You received an email!'
	}

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			callback(error);
		} else {
			callback(info);
		}
	});
};

module.exports = sendEmail;
