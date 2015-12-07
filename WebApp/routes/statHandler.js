'use strict';

var express = require('express');
var router = express.Router();
var Review = require('../models/review');

router.get('/', getStats)

function getStats(req, res){
	
	if(!req.query.course_id){
		console.log("Improper Data Format");
		res.send500('Improper Data Format');
		return;
	}
	
	Review.find({course_id: req.query.course_id}, function (err, courses) {
		var totalGrade = 0;
		var totalDifficulty = 0;
		var totalHours = 0;
		
		for(var i = 0; i < courses.length; i++){
			totalGrade += parseInt(courses[i].grade);
			totalDifficulty += parseInt(courses[i].difficulty);
			totalHours += parseInt(courses[i].hours);
		}
		
		var averageGrade = gradeToString(Math.round(totalGrade / courses.length));
		var averageDifficulty = difficultyToString(Math.round(totalDifficulty / courses.length));
		var averageHours = Math.round(totalHours / courses.length);
		
		res.json({grade : averageGrade,
				  difficulty : averageDifficulty,
				  hours : averageHours});

	});
};

function difficultyToString (val) {
	switch(val){
		case 0:
			return "N/A";
		case 1: 
			return "Very Hard";
		case 2: 
			return "Hard";
		case 3: 
			return "Normal";
		case 4: 
			return "Easy";
		case 5: 
			return "Very Easy";
		default:
			return "N/A";
	}	
};

function gradeToString (val) {
	switch(val){
		case 0:
			return "N/A";
		case 1: 
			return "F";
		case 2: 
			return "D-";
		case 3: 
			return "D";
		case 4: 
			return "D+";
		case 5: 
			return "C-";
		case 6: 
			return "C";
		case 7: 
			return "C+";
		case 8: 
			return "B-";
		case 9:
			return "B";
		case 10:
			return "B+";
		case 11:
			return "A-";
		case 12:
			return "A";
		default:
			return "N/A";
	}		
};

module.exports = router;
