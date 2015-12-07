'use strict';
var express    = require('express');
var path       = require('path');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var routes     = require('./routes');

// instantiate express
var app = express();

//instantiate customizeResponse object
app.use(require('./utility/customizeResponse'));

// will need to change database domain name/////
var dbPath = 'mongodb://localhost/test'

// Removing this line will drop the entire production database, so probably ought not do that.
if (!isUndefined(global.TESTING_DB)) {
	dbPath = global.TESTING_DB;
}

// connect to database
mongoose.connect(dbPath);
app.connection = mongoose.connection;
app.connection.on('error', handleDBError);

// setup static path files
app.use(express.static(path.join(__dirname, 'clientSide')));
app.use('/api', express.static(path.join(__dirname, 'ApiUI')));

// setup static path to uploaded files
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//instantiate multi-parser object
app.use(require('./utility/multipart-parser'));

//set url encoded format
app.use(bodyParser.urlencoded({type: 'application/x-www-form-urlencoded', extended: true}));

app.use('/register', 		  routes.registrationHandler);
app.use('/login', 			  routes.loginHandler);
app.use('/review', 			  routes.reviewHandler);
app.use('/search', 			  routes.searchHandler);
app.use('/stats',			  routes.statHandler);
app.use('/authenticate',	  routes.authenticationHandler);

//handle 404 response errors
app.use(function return404(req, res) {
    res.status(404).send({
    	code: 404,
    	description: 'Page not found.'
    });
});

module.exports = app;


//handle database connection errors
function handleDBError(error) {
	console.log(error);
    console.log('Error connecting to DB. Is MongoDB running? Try "sudo service mongod start". If mongod is an unrecognized service, you will need to install MongoDB.');
}
