'use strict';

var express = require('express');
var config = require('../config');
var router  = express.Router();

router.post('/', authenticate);

function authenticate (req, res) {

	if(!req.body.username || !req.body.password){
		res.send500("Improper Data Format");
		return;
	} 

	if(req.body.username == config.admin && req.body.password == config.password){
		res.send({authenticated: true});
	}
	else {
		res.send({authenticated: false});
	}
}

module.exports = router;

