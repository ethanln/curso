var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var reviewSchema = new Schema({
	course_id: String,
    hours: String,
    difficulty: String,
    grade: String,
    review: String,	
    date: { type: Date, default: Date.now },
    formattedDate: String
});

module.exports = mongoose.model('Review', reviewSchema);
