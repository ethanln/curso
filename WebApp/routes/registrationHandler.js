'use strict';

var express = require('express');
var router  = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt');  
var SALT = bcrypt.genSaltSync();
var jwt = require('jwt-simple');
var config = require('../config');

router.post('/', validateUser, registerUser);

function validateUser (req, res, next) {
	
	if(!req.body.name || !req.body.username || !req.body.password){
		console.log("Improper Data Format");
		res.send500('Improper Data Format');
		return;
	}
	
	User.count({username:req.body.username.toLowerCase()}, function (err, count) {
		if (count > 0) {
			res.send('Username already in use.');
		} else {
			console.log('is valid user');
			next();
		}
	});
}

function registerUser (req, res) {
	// 10 rounds: ~10 hashes/sec. Duration doubles for every extra round.
	bcrypt.hash(req.body.password, SALT, function(err, hash) {
		req.body.passwordHash = hash;

		var user = new User(req.body);
		user.name = user.name.toLowerCase();
		user.username = user.username.toLowerCase();

		user.save(function userSaved (error, user, numberAffected){
			delete user.passwordHash;
			var token = jwt.encode(user, config.key);

			if (error) {
				res.send500('There was an error saving this user');
			} else if (numberAffected > 0) {
				res.json({
					username: user.username,
					token: token
				});
			}
		});
	});
}

module.exports = router;

 
