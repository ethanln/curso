// React Router
// http://rackt.github.io/react-router/
var Router = ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Redirect = Router.Redirect;


// Top-level component for the app
var App = React.createClass({
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
		// set current page to home
		currentPage = "home_redirect";
        return {
	        // the user is logged in
            loggedIn: auth.loggedIn()
        };
    },

    // callback when user is logged in
    setStateOnAuth: function(loggedIn) {
        this.state.loggedIn = loggedIn;
    },

    // when the component loads, setup the callback
    componentWillMount: function() {
        auth.onChange = this.setStateOnAuth;
    },

    // logout the user and redirect to home page
    logout: function(event) {
        auth.logout();
        // refresh navigation bar
        if(currentPage == "write_review"){
			this.context.router.replaceWith('/home');
		}
		else{
			this.forceUpdate();
		}
    },

    // show the navigation bar
    // the route handler replaces the RouteHandler element with the current page
    render: function() {
        return (
            <div>
				<nav className="navbar navbar-default" role="navigation">
					<div className="container">
					{this.state.loggedIn ? (
						<div id="login-register-logout">
							<button id="loginBtn" className="btn btn-lg" onClick={this.logout}>Logout</button>
						</div>):
						(<div id="login-register-logout">
							<Link id="loginBtn" className="btn btn-lg" to="login">Login</Link> or <Link id="registerBtn" className="btn btn-lg" to="register">Register</Link>
						</div>)
					}
						<div className="navbar-header">
							<a className="navbar-brand" href="/">Curso</a>
						</div>
					</div>
					<div className="navbar-custom">
						<div id="menu">
							<ul>
								<li><a href="/">HOME</a></li> 
								<li><Link to="search">SEARCH</Link></li>								
								{this.state.loggedIn ? (
									<li><Link to="write_review">WRITE REVIEW</Link></li> 
								):(
									<li></li>
								)}
								
							</ul>
						</div>
					</div>
				</nav>
            <div className="container main-container">
				<RouteHandler/>
            </div>
		</div>
		);
	}
});

//--***********************************--
//			     HOME PAGE
//--***********************************--
// Home page - which shows Login and Register buttons
var Home = React.createClass({
	
	// initial state
    getInitialState: function() {
		currentPage = "/";
        return {
	        // the user is logged in
            error: false
        };
    },
    
    render: function() {
        return (
        
		<center>
			<Link id="start-search-link" to="search">
				<div id="search-home">
					<div className="exterior">
						
							<div className="search-text">Search Course</div>
						
					</div>
				</div>
			</Link>
		</center>

            );
    }
});


//--***********************************--
//			     ERROR BOX
//--***********************************--
// error container - any error that occurs on the app will redirect to this page
var ErrorBox = React.createClass({
    render: function() {
        return (
			<center>
				<div className="error-box">
					<div className="exterior">
						<center>
							<p className="error-text">Error: {errorMessage.getErrorMessage()}</p>
						</center>
						<div className="exit-button-box">
							<Link id="exitBtn" className="btn btn-lg" to="home_redirect">Exit</Link>
						</div>
					</div>
				</div>
			</center>
			
            );
    }
});

//--***********************************--
//				   LOGIN
//--***********************************--
// Login page - shows the login form and redirects to the list if login is successful
var Login = React.createClass({
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
        return {
            // there was an error on logging in
            error: false
        };

    },

    // handle login button submit
    login: function(event) {
        // prevent default browser submit
        event.preventDefault();
        // get data from form
        var username = this.refs.username.getDOMNode().value;
        var password = this.refs.password.getDOMNode().value;

        if (!username || !password) {
            return this.setState({
				error: true
            });
        }
        // login via API
        auth.login(username, password, function(loggedIn) {
            // login callback
            if (!loggedIn)
                return this.setState({
                    error: true
                });
            // redirect to the previous page
            this.context.router.transitionTo(currentPage);
            //this.context.router.replaceWith('/');
        }.bind(this));
    },
	
    // show the login form
    render: function() {
        return (
			<center>
				<div className="dialog dialog-login" role="dialog">
					<div className="modal-body">
						<label className="dialog-label">LOGIN</label>
						<form id="credential-form" className="form-vertical" onSubmit={this.login}>
							<table className="dialog-table">
								<tr>
									<td>
										<label className="dialog-label-box">USERNAME</label>
									</td>
									<td>
										<input className="dialog-text-box" type="text" placeholder="Username" ref="username" autoFocus={true} />
									</td>
								</tr>
								<tr>
									<td>
										<label className="dialog-label-box">PASSWORD</label>
									</td>
									<td>
										<input className="dialog-text-box" type="password" placeholder="Password" ref="password"/>
									</td>
								</tr>
							</table>
							
							<div className="buttons-box">
								<input className="btn btn-lg dialog-button" type="submit" value="Submit" />
								<Link  className="btn btn-lg dialog-button" to={currentPage}>Close</Link>
							</div>
							{this.state.error ? (
								<div className="alert">Invalid username or password.</div>
								) : null}
						</form>
					</div>
				</div>
			</center>
            
            );
    }
});

//--***********************************--
//				REGISTER
//--***********************************--
// Register page, shows the registration form and redirects to the list if login is successful
var Register = React.createClass({
	
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
        return {
            // there was an error registering
            error: false
        };
    },

    // handle regiser button submit
    register: function(event) {
        // prevent default browser submit
        event.preventDefault();
        
        // get data from form
        var name = this.refs.name.getDOMNode().value.toLowerCase();
        var username = this.refs.username.getDOMNode().value.toLowerCase();
        var password = this.refs.password.getDOMNode().value;
        if (!name || !username || !password) {
            return this.setState({
				error: true
			});
        }
        // register via the API
        auth.register(name, username, password, function(loggedIn) {
            // register callback
            if (!loggedIn)
                return this.setState({
                    error: true
                });
            // redirect to the previous page
            this.context.router.transitionTo(currentPage);
            //this.context.router.replaceWith('/');
        }.bind(this));
    },

    // show the registration form
    render: function() {
        return (
			<center>
				<div className="dialog dialog-register" role="dialog">
					<div>
					<label className="dialog-label">REGISTER</label>
					<form className="credential-form" onSubmit={this.register}>
						<table className="dialog-table">
							<tr>
								<td>
									<label className="dialog-label-box">FULL NAME</label>
								</td>
								<td>
									<input className="dialog-text-box" type="text" placeholder="Name" ref="name" autoFocus={true} />
								</td>
							</tr>
							<tr>
								<td>
									<label className="dialog-label-box">USERNAME</label>
								</td>
								<td>
									<input className="dialog-text-box" type="text" placeholder="Username" ref="username"/>
								</td>
							</tr>							
							<tr>
								<td>
									<label className="dialog-label-box">PASSWORD</label>
								</td>
								<td>
									<input className="dialog-text-box" type="password" placeholder="Password" ref="password"/>
								</td>
							</tr>
						</table>
						<div className="buttons-box">
							<input className="btn btn-lg dialog-button" type="submit" value="Register" />
							<Link  className="btn btn-lg dialog-button" to={currentPage}>Close</Link>
						</div>
						{this.state.error ? (
							<div className="alert">Invalid username or password.</div>
							) : null }
					</form>
					</div>
				</div>
			</center>
            );
    }
});

//--***********************************--
//			    WRITE REVIEW
//--***********************************--
// write review component - logged in users can write a review using this form
var WriteReview = React.createClass({
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
		// set current page to review form page
		currentPage = "write_review";
		
		var course = reviewFieldValues.course;
		var professor = reviewFieldValues.professor;
		var school = reviewFieldValues.school;
		
		reviewFieldValues = {};
		
        return {
            loggedIn: auth.loggedIn(),
            course: course,
            professor: professor,
            school: school,
            error: false
        };
    },
	
	// be sure that all field values are filled in the form
	checkForErrors: function(review) {
		return review.course == "" ||
			review.professor == "" ||
			review.school == "" ||
			review.hours == "" ||
			review.difficulty == "" ||
			review.grade == "" ||
			review.review == "";
	},
	
    // handle write review button submit
    writeReview: function(event) {
		
		var review = {
			course: this.refs.course.getDOMNode().value.toLowerCase(),
			professor: this.refs.professor.getDOMNode().value.toLowerCase(),
			school: this.refs.school.getDOMNode().value.toLowerCase(),
			hours: this.refs.hours.getDOMNode().value,
			difficulty: this.refs.difficulty.getDOMNode().value,
			grade: this.refs.grade.getDOMNode().value,
			review: this.refs.review.getDOMNode().value			
		};
		
		var isError = this.checkForErrors(review);
		
		if(isError){
			this.setState({
                    error: true
            });
            return false;
		}
		
		api.writeReview(review, function(result, message) {
			if (!result){
				auth.logout();
				errorMessage.setErrorMessage("You were logged out");
                return this.setState({
                    loggedIn: auth.loggedIn()
				});
			}
			else{
				this.context.router.transitionTo('/');
			}

		}.bind(this));
		
		return false;
    },

    // show the write review form
    render: function() {
		if(!this.state.loggedIn){
			this.context.router.transitionTo('error');
		}
		
        return (
			<center>
				<div className="dialog dialog-review" role="dialog">
					<div>
					<label className="dialog-label">WRITE REVIEW</label>
					<form className="credential-form">
						<table className="dialog-table">
							<tr>
								<td>
									<label className="dialog-label-box">COURSE NAME</label>
								</td>
								<td>
									<input className="dialog-text-box" type="text" value={this.state.course} placeholder="CourseName" ref="course" autoFocus={true} />
								</td>
							</tr>
							<tr>
								<td>
									<label className="dialog-label-box">PROFESSOR</label>
								</td>
								<td>
									<input className="dialog-text-box" type="text" value={this.state.professor} placeholder="Professor" ref="professor"/>
								</td>
							</tr>
							<tr>
								<td>
									<label className="dialog-label-box">SCHOOL</label>
								</td>
								<td>
									<input className="dialog-text-box" type="text" value={this.state.school} placeholder="School" ref="school"/>
								</td>
							</tr>
							<tr>
								<td>
									<label className="dialog-label-box">HOURS PER WEEK</label>
								</td>
								<td>
									<select ref="hours" className="dialog-dropdown">
										<option value="" selected="selected">Please select one</option>
										<option value="0">0-2</option>
										<option value="2">2-4</option>
										<option value="4">4-6</option>
										<option value="6">6-8</option>
										<option value="8">8-10</option>
										<option value="10">10+</option>
									</select>
								</td>
							</tr>
							<tr>
								<td>
									<label className="dialog-label-box">DIFFICULTY</label>
								</td>
								<td>
									<select ref="difficulty" className="dialog-dropdown">
										<option value="" selected="selected">Please select one</option>
										<option value="5">Very Easy</option>
										<option value="4">Easy</option>
										<option value="3">Normal</option>
										<option value="2">Hard</option>
										<option value="1">Very Hard</option>
									</select>
								</td>
							</tr>
							<tr>
								<td>
									<label className="dialog-label-box">GRADE</label>
								</td>
								<td>
									<select ref="grade" className="dialog-dropdown">
										<option value="" selected="selected">Please select one</option>
										<option value="12">A</option>
										<option value="11">A-</option>
										<option value="10">B+</option>
										<option value="9">B</option>
										<option value="8">B-</option>
										<option value="7">C+</option>
										<option value="6">C</option>
										<option value="5">C-</option>
										<option value="4">D+</option>
										<option value="3">D</option>
										<option value="2">D-</option>
										<option value="1">F</option>
									</select>
								</td>
							</tr>
							<tr>
								<td>
									<label className="dialog-label-box">REVIEW</label>
								</td>
							</tr>
						</table>
						<div>
							<textarea className="review-sheet" placeholder="Write a Review..." cols="50" maxlength="200" ref="review" rows="5">
								
							</textarea>
						</div>
						<br />
						<div className="buttons-box">
							<button className="btn btn-lg dialog-button" onClick={this.writeReview}>Write</button>
							<Link  className="btn btn-lg dialog-button" to="/">Close</Link>
							{this.state.error ? (
								<div className="alert"> You are missing some field values </div>
							) : null}
						</div>
					</form>
					</div>
				</div>
			</center>
            );
    }
});

//--***********************************--
//				SEARCH
//--***********************************--
//search page - users can search by either professor, school, or course, or all of them.
var Search = React.createClass({
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
		// set current page to the search form page
		currentPage = "search";
        return {
            // there was an error searching
            error: false
        };
    },

    // handle search button submit
    search: function(event) {
		var searchValues = { course: this.refs.course_name.getDOMNode().value.toLowerCase(),
							 professor: this.refs.professor.getDOMNode().value.toLowerCase(),
							 school: this.refs.school.getDOMNode().value.toLowerCase()
						};
        // There must be at least one field filled in the search form
        if(!searchValues.course && !searchValues.professor && !searchValues.school){
			this.setState({
				error: true
			});
			return false;
		}
		
		api.searchCourse(searchValues, function(result, response) {
			// if error occurs, redirect to error page
			if (!result){
				// set some error from the response if it fails
				errorMessage.setErrorMessage("Your search failed");
				this.context.router.transitionTo('error');
				return false;
			}
			
			courseInfo = [];
			
			for(var i = 0; i < response.length; i++){
				courseInfo.push(response[i]);
			}
			
			this.context.router.transitionTo('courses');
			return false;

		}.bind(this));
		
		
		return false;
    },

    // show the search form
    render: function() {
        return (
			<center>
				<div className="dialog dialog-search" role="dialog">
					<div>
					<label className="dialog-label">SEARCH</label>
					<form className="credential-form" onSubmit={this.search}>
						<table className="dialog-table">
							<tr>
								<td>
									<label className="dialog-label-box">COURSE NAME</label>
								</td>
								<td>
									<input className="dialog-text-box" type="text" placeholder="CourseName" ref="course_name" autoFocus={true} />
								</td>
							</tr>
							<tr>
								<td>
									<label className="dialog-label-box">PROFESSOR</label>
								</td>
								<td>
									<input className="dialog-text-box" type="text" placeholder="Professor" ref="professor"/>
								</td>
							</tr>
							<tr>
								<td>
									<label className="dialog-label-box">SCHOOL</label>
								</td>
								<td>
									<input className="dialog-text-box" type="text" placeholder="School" ref="school"/>
								</td>
							</tr>
						</table>
						<div className="buttons-box">
							<input className="btn btn-lg dialog-button" type="submit" value="Search" />
							<Link  className="btn btn-lg dialog-button" to="/">Close</Link>
						</div>
						{this.state.error ? (
							<div className="alert">You must fill in one of the fields.</div>
							) : null }
					</form>
					</div>
				</div>
			</center>
		);
    }
});

//--***********************************--
//				COURSES
//--***********************************--
// Course container component - displays results of search as courses
var Courses = React.createClass({
	
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
		//set current page to the courses page
		currentPage = "courses";
        return {
            error: false
        };
    },
    
    // if error occurs, redirect to error page
    handleError: function(event) {
		console.log("ERROR");
		// set some error from the response if it fails
		errorMessage.setErrorMessage("Could Not Query Courses");
		this.context.router.transitionTo('error');
		return false;
	},

    render: function() {
		var list = [];
		for(var i = 0; i < courseInfo.length; i++){
			list.push(<Course id={courseInfo[i]._id} callback={this.handleError} courseName={courseInfo[i].course} professor={courseInfo[i].professor} school={courseInfo[i].school} />);
		}
		
		if(list.length > 0){
			return (
				<div>
					<div className="page-title-box">
						<label className="page-title"> RESULTS </label>
					</div>
					<center>
						<div className="course-container">
							{list}
						</div>
					</center>
				</div>
				);
		}
		else{
			return (
				<div>
					<div className="page-title-box">
						<label className="page-title"> RESULTS </label>
					</div>
					<center>
						<div className="course-container no-result">
							The Search Values We're Not Found
						</div>
					</center>
				</div>
				);
		}
    }
});

//--***********************************--
//				COURSE
//--***********************************--
// Course component - holds all information for a particular course all in a component
var Course = React.createClass({
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
		var id = {course_id : this.props.id};
		api.getStats(id, function(result, res){
			if(!result){
				this.setState({error: true});
				this.props.callback(res);
			}
			else{
				this.setState({ error: false,
					averageGrade: res.grade,
					averageDifficulty: res.difficulty,
					averageHours: res.hours });
			}
			
		}.bind(this));
		
		
        return {
            error: false
        };
    },
    
    // store selected course in a global variable 
    getCourse: function(){
		selectedCourseInfo = {id: this.props.id,
							  course: this.props.courseName,
							  professor: this.props.professor,
							  school: this.props.school,
							  grade: this.state.averageGrade,
							  difficulty: this.state.averageDifficulty,
							  hours: this.state.averageHours
							  };
	},
	
    render: function() {
        return (
			<div className="course-box">
				<div className="course-box-header">
					<Link onClick={this.getCourse} to="course_info" className="course-box-link">Course: {this.props.courseName.toUpperCase()} </Link>
				</div>
				<div className="course-box-body">
					<table className="course-detail-table-leftside">
						<tr>
							<td>
								Professor: 
							</td>
							<td className="course-detail-table-right">
								{this.props.professor}
							</td>
						</tr>
						<tr>
							<td>
								School: 
							</td>
							<td className="course-detail-table-right">
								{this.props.school}
							</td>
						</tr>
						<tr>
							<td>
								Average Grade: 
							</td>
							<td className="course-detail-table-right">
								{this.state.averageGrade}
							</td>
						</tr>
						<tr>
							<td>
								Average Difficulty: 
							</td>
							<td className="course-detail-table-right">
								{this.state.averageDifficulty}
							</td>
						</tr>
						<tr>
							<td>
								Average Hours: 
							</td>
							<td className="course-detail-table-right">
								{this.state.averageHours}
							</td>
						</tr>
					</table>
				</div>
			</div>
            
            );
    }
});

//--***********************************--
//		       COURSE INFO
//--***********************************--
// Course Information component that holds all reviews for of the currently selected course
var CourseInfo = React.createClass({
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
		// set current page to the course info page
		currentPage = "course_info";
		if(!selectedCourseInfo){
			return {
				error: true
			};
		}
		
		// get course reviews
		api.getCourseInfo({course_id : selectedCourseInfo.id}, function(result, res){
			
			// if error occurs, redirect to error page
			if(!result){
				console.log("ERROR");
				// set some error from the response if it fails
				errorMessage.setErrorMessage("Could Not Query Course Reviews");
				this.context.router.transitionTo('error');
				return false;
			}
			else{
				var reviews = res;
				var list = [];
				
				// store Review components in list
				for(var i = 0; i < reviews.length; i++){
					list.push(<Review date={reviews[i].formattedDate} hours={reviews[i].hours} difficulty={reviews[i].difficulty} grade={reviews[i].grade} review={reviews[i].review} />);
				}
				
				this.setState({ error: false,
								reviews: list});
				return false;
			}	
		}.bind(this));
		
		return {
			error: false,
			loggedIn: auth.loggedIn(),
			course: selectedCourseInfo
		};
    },
      
    fillReviewFormValues: function() {
		// fill pre review form values in global variable
		reviewFieldValues = {
								professor: this.state.course.professor,
								school: this.state.course.school,
								course: this.state.course.course
							};
	},
 
    render: function() {

        return (
			<div>
				<div className="selected-course-box">
					<div className="header-selected-course-box">
						<p className="selected-course-box-title"> Course: {this.state.course.course.toUpperCase()}</p>
					</div>
					<div>
						<table className="course-detail-table-info">
							<tr>
								<td>
									Professor: 
								</td>
								<td className="course-detail-table-right">
									{this.state.course.professor}
								</td>
							</tr>
							<tr>
								<td>
									School: 
								</td>
								<td className="course-detail-table-right">
									{this.state.course.school}
								</td>
							</tr>
							<tr>
								<td>
									Average Grade: 
								</td>
								<td className="course-detail-table-right">
									{this.state.course.grade}
								</td>
							</tr>
							<tr>
								<td>
									Average Difficulty: 
								</td>
								<td className="course-detail-table-right">
									{this.state.course.difficulty}
								</td>
							</tr>
							<tr>
								<td>
									Average Hours: 
								</td>
								<td className="course-detail-table-right">
									{this.state.course.hours}
								</td>
							</tr>
						</table>
						{this.state.loggedIn ? (
							<Link onClick={this.fillReviewFormValues} className="write-immediate-review" to="write_review"> Write a review for this class</Link>
							):(null)
						}
					</div>
				</div>
				<div className="page-title-review-border">
					<p className="page-title page-title-review">
						Reviews
					</p>
				</div>
				<div className="selected-course-review-container">
					{this.state.reviews}
				</div>
			</div>
            
            );
    }
});

//--***********************************--
//				  REVIEW
//--***********************************--
// Review Component - contains all review information of a particular course
var Review = React.createClass({
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
        return {
            // there was an error on logging in
            error: false
        };

    },
	
    render: function() {
        return (
			<div className="course-review-box">
				<div className="review-header">
				
				</div>
				<div className="course-review-left">
					<table className="review-detail-table-info">
						<tr>
							<td>
								Date: 
							</td>
							<td className="course-detail-table-right">
								{this.props.date}
							</td>
						</tr>
						<tr>
							<td>
								Difficulty: 
							</td>
							<td className="course-detail-table-right">
								{this.props.difficulty}
							</td>
						</tr>
						<tr>
							<td>
								Grade Received: 
							</td>
							<td className="course-detail-table-right">
								{this.props.grade}
							</td>
						</tr>
						<tr>
							<td>
								Hours Per Week: 
							</td>
							<td className="course-detail-table-right">
								{this.props.hours}
							</td>
						</tr>
					</table>
				</div>
				<div className="review-text">
					<p>
						{this.props.review}
					</p>
				</div>
			</div>
            
            );
    }
});


//--***********************************--
//				API
//--***********************************--
// API object
var api = {
	// write review api service
    writeReview: function(reviewValues, cb){
		var url = "/review";
		
		$.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: reviewValues,
            headers: {'Authorization': localStorage.token},
            success: function(res) {
                if (cb)
                    cb(true, res);
            },
            error: function(xhr, status, err) {
                // if there is an error, remove the login token
                delete localStorage.token;
                if (cb)
                    cb(false, status);
            }
        });
	},
	
	// search course api service
	searchCourse: function(searchValues, cb){
		var url = "/search";
		
		$.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            data: searchValues,
            success: function(res) {
                if (cb)
                    cb(true, res);
            },
            error: function(xhr, status, err) {
                if (cb)
                    cb(false, status);
            }
        });
	},
	
	// get course average stats api service
	getStats: function(courseId, cb){
		var url = "/stats";
		
		$.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            data: courseId,
            success: function(res) {
                if (cb)
                    cb(true, res);
            },
            error: function(xhr, status, err) {
                if (cb)
                    cb(false, status);
            }
        });
	},
	
	// get course reviews api service
	getCourseInfo: function(courseId, cb){
		var url = "/review";
		
		$.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            data: courseId,
            success: function(res) {
                if (cb)
                    cb(true, res);
            },
            error: function(xhr, status, err) {
                if (cb)
                    cb(false, status);
            }
        });
	}

};

// Error model use to error messages
var errorMessage = {
	getErrorMessage: function(){
		var message = localStorage.errorMessage;
		this.resetErrorMessage();
		return message;
	},
	
	setErrorMessage: function(message){
		localStorage.errorMessage = message;
	},
	
	resetErrorMessage: function(){
		localStorage.errorMessage = "";
	}
};

//--***********************************--
//				   AUTH
//--***********************************--
// authentication object
var auth = {
	// register user
    register: function(name, username, password, cb) {
        // submit request to server, call the callback when complete
        var url = "/register";
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: {
                name: name,
                username: username,
                password: password
            },
            // on success, store a login token
            success: function(res) {
                localStorage.token = res.token;
                localStorage.name = res.username;
                if (cb)
                    cb(true);
                this.onChange(true);
            }.bind(this),
            error: function(xhr, status, err) {
                // if there is an error, remove any login token
                delete localStorage.token;
                if (cb)
                    cb(false);
                this.onChange(false);
            }.bind(this)
        });
    },
    
    // login the user
    login: function(username, password, cb) {
        // submit login request to server, call callback when complete
        cb = arguments[arguments.length - 1];
        // check if token in local storage
        if (localStorage.token) {
            if (cb)
                cb(true);
            this.onChange(true);
            return;
        }

        // submit request to server
        var url = "/login";
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            success: function(res) {
                // on success, store a login token
                localStorage.token = res.token;
                localStorage.name = res.username;
                if (cb)
                    cb(true);
                this.onChange(true);
            }.bind(this),
            error: function(xhr, status, err) {
                // if there is an error, remove any login token
                delete localStorage.token;
                if (cb)
                    cb(false);
                this.onChange(false);
            }.bind(this)
        });
    },
	
    // get the token from local storage
    getToken: function() {
        return localStorage.token;
    },
    // get the name from local storage
    getName: function() {
        return localStorage.name;
    },
    // logout the user, call the callback when complete
    logout: function(cb) {
        delete localStorage.token;
        if (cb) cb();
        this.onChange(false);
    },
    // check if user is logged in
    loggedIn: function() {
        return !!localStorage.token;
    },
    // default onChange function
    onChange: function() {},
};

// routes for the app
var routes = (
    <Route name="app" path="/" handler={App}>
		<Route name="home_redirect" path="/home" handler={Home}/>
		<Route name="courses" path="/courses" handler={Courses}/>
		<Route name="course_info" path="/course_info" handler={CourseInfo}/>
		<Route name="search" path="/search" handler={Search}/>
		<Route name="write_review" path="/review/write" handler={WriteReview}/>
		<Route name="login" handler={Login}>
			<Route name="home" handler={Home}/>
		</Route>
		<Route name="error" path="/error" handler={ErrorBox}/>
		<Route name="register" handler={Register}/>
		<DefaultRoute handler={Home}/>
    </Route>
    );

// Run the routes
Router.run(routes, function(Handler) {
    React.render(<Handler/>, document.body);
});

//global variables
var courseInfo = [];
var selectedCourseInfo = {};
var reviewFieldValues = {};
var currentPage = "/";
