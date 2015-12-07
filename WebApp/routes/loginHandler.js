'use strict';

var express = require('express');
var router  = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt');

var jwt = require('jwt-simple');
var config = require('../config');

router.post('/', loginUser);

function loginUser (req, res) {
	
	if(!req.body.username || !req.body.password){
		console.log('Improper Data Format');
		res.send500('Improper Data Format');
		return;
	}
	
	User.findOne({username: req.body.username.toLowerCase()}, function userFound(err, user) {
		if (err) {
			console.log('There was an error finding a user');
			res.send500('There was an error finding a user');
			return;
		}

		if (!user) {
			console.log('That user does not exist');
			res.send('That user does not exist');
			return;
		}

		bcrypt.compare(req.body.password, user.passwordHash, function(err, response) {
			var token = jwt.encode(user, config.key);

			if (response === true) {
				res.json({
					username: user.username,
					token: token
				});
			} else {
				console.log('Incorrect password');
				res.send('Incorrect password');
			}
		})
	})
}

module.exports = router;

