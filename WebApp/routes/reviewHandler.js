'use strict';

var express = require('express');
var router = express.Router();
var Review = require('../models/review');
var Course = require('../models/course');

var jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../config');

router.post('/', authenticate, writeReview)
router.get('/', getReviews)

function authenticate (req, res, next) {
	
	if(!req.headers.authorization){
		console.log('Improper Data Format');
		res.send500('Improper Data Format');
		return;
	}
	
	var decodedUser = jwt.decode(req.headers.authorization, config.key);
	
	if (decodedUser) {
		User.count({username: decodedUser.username}, function (error, count) {
			if (count > 0) {
				console.log("success");
				next();
			} else {
				console.log("there are no users by that name");
				res.send({authenticated: false});
			}
		})
	} else {
		console.log("failed to decode token");
		res.send({authenticated: false});
	}
}

function writeReview(req, res){
	
	if(!req.body.course ||
	   !req.body.professor ||
	   !req.body.school ||
	   !req.body.hours ||
	   !req.body.difficulty ||
	   !req.body.grade ||
	   !req.body.review){
		console.log('Improper Data Format');
		res.send500('Improper Data Format');
		return;
	}

	Course.find({course: req.body.course.toLowerCase(), professor: req.body.professor.toLowerCase(), school: req.body.school.toLowerCase()}, function (err, courses) {
		var id = "";
		if (courses.length > 0) {
			id = courses[0]._id;
			console.log('course exists');
		} 
		else {
			
			var course = new Course();
			course.course = req.body.course.toLowerCase();
			course.professor = req.body.professor.toLowerCase();
			course.school = req.body.school.toLowerCase();
			
			course.save(function courseSaved (error, course, numberAffected){

				if (error) {
					console.log('There was an error writing the course');
					res.send500('There was an error writing the course');
				} 
				else if (numberAffected < 1) {
					console.log('Could not write course');
					res.send('Could not write course');
				}
			});
			
			id = course._id;
		}
		
		var review = new Review();
		review.course_id = id;
		review.hours = req.body.hours;
		review.difficulty = req.body.difficulty;
		review.grade = req.body.grade;
		review.review = req.body.review;
		
		var dd = review.date.getDate();
		var mm = review.date.getMonth() + 1;
		var yyyy = review.date.getFullYear();
		review.formattedDate = mm + "/" + dd + "/" + yyyy;
		
		review.save(function reviewSaved (error, course, numberAffected){
			if (error) {
				console.log('There was an error writing the review');
				res.send500('There was an error writing the review');
			} 
			else if (numberAffected > 0) {
				res.send(review);
			}

		});
	});
};


function getReviews(req, res){
	
	if(!req.query.course_id){
		console.log('Improper Data Format');
		res.send500('Improper Data Format');
		return;
	}

	Review.find({course_id: req.query.course_id}, function (err, reviews) {		

		for(var i = 0; i < reviews.length; i++){
			reviews[i].difficulty = difficultyToString(Math.round(reviews[i].difficulty));
			reviews[i].grade = gradeToString(Math.round(reviews[i].grade));
		}

		res.json(reviews);
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
