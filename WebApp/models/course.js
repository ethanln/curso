var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var courseSchema = new Schema({
	course: String,
    professor: String,
    school: String
});

module.exports = mongoose.model('Course', courseSchema);
