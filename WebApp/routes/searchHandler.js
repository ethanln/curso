'use strict';

var express = require('express');
var router = express.Router();
var Review = require('../models/review');
var Course = require('../models/course');

router.get('/', search)


function search(req, res){

	var searchValues = {};
	
	if(req.query.course){
		searchValues.course = req.query.course;
	}
	if(req.query.professor){
		searchValues.professor = req.query.professor;
	}
	if(req.query.school){
		searchValues.school = req.query.school;
	}
	
	Course.find(searchValues, function (err, courses) {	
		res.json(courses);
	});
};

module.exports = router;
