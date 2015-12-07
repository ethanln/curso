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
        return {
	        // the user is logged in
            loggedIn: false,
            error: false
        };
    },
    
    login: function() {
		var _username = this.refs.username.getDOMNode().value;
        var _password = this.refs.password.getDOMNode().value;
        
        auth.authenticate({username: _username, password: _password}, function(result, res){
			if(!result){
				return this.setState({
					error: true
				});
			}
			
			if(!res.authenticated){
				return this.setState({
					error: true
				});
			}
			this.setState({loggedIn : true});
			this.context.router.transitionTo('/apiList');
		}.bind(this));
		
		return false;
    },
    // show the navigation bar
    // the route handler replaces the RouteHandler element with the current page
    render: function() {
		
        return (
            <div>
            {!this.state.loggedIn ? (
				<center>
					<div className="dialog dialog-login" role="dialog">
						<div className="modal-body">
							<label className="dialog-label">AUTHENTICATE</label>
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
									<Link  className="btn btn-lg dialog-button" to="/">Close</Link>
								</div>
								{this.state.error ? (
									<div className="alert">Invalid username or password.</div>
									) : null}
							</form>
						</div>
					</div>
					
				</center>) : (null)}
				<div>
					<RouteHandler />
				</div>
			</div>
		);
	}
});


var ApiList = React.createClass({
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
		delete localStorage.token
        return {
	        // the user is logged in
            loggedIn: false
        };
    },
    // show the navigation bar
    // the route handler replaces the RouteHandler element with the current page
    render: function() {
		var APIMethods = [{url: "/login", method: "POST", schema: "{username: '[username]', password: '[password]'}"},
				  {url: "/register", method: "POST", schema: "{name: '[name]', username: '[username]', password: '[password]'}"},
				  {url: "/review", method: "POST", schema: "{course:  '[course]', professor:  '[professor]', school:  '[school]', hours: '[hours]', difficulty: '[difficulty]', grade: '[grade]', review: '[review]'}"},
				  {url: "/search", method: "GET", schema: "{course: '[course]', professor: '[professor]', school: '[school]'}"},
				  {url: "/stats", method: "GET", schema: "{course_id: '[course_id]'}"},
				  {url: "/review", method: "GET", schema: "{course_id: '[course_id]'}"},
				  {url: "/logout", method: "GET", schema: ""}
			  ];
		
		var list = [];
		for(var i = 0; i < APIMethods.length; i++){
			list.push(<ApiBox url={APIMethods[i].url} method={APIMethods[i].method} schema={APIMethods[i].schema} />);
		}
		
        return (
            <div>
				<label className="page-title"> CURSO API </label>
				{list}
			</div>
		);
	}
});

// Login page - shows the login form and redirects to the list if login is successful
var ApiBox = React.createClass({
    // context so the component can access the router
    contextTypes: {
        router: React.PropTypes.func
    },

    // initial state
    getInitialState: function() {
        return {
            error: false,
            requestSchema: "",
            responseMessage: ""
        };

    },

    // handle login button submit
    doMethod: function(event) {
		var json = {};
		if(this.props.url != "/logout"){
			try{
				json = eval("(" + this.refs.data.getDOMNode().value + ")");
			}
			catch(err){
				console.log(err);
				return false;
			}
		}
            
		if(this.props.url == "/login"){
			auth.login(json, function(result, res){
				this.setState({responseMessage: JSON.stringify(res,null,2)});
				return false;
			}.bind(this));
		}
		else if(this.props.url == "/register"){
			auth.register(json, function(result, res){
				this.setState({responseMessage: JSON.stringify(res,null,2)});
				return false;
			}.bind(this));
		}
		else if(this.props.url == "/logout"){
			auth.logout(function(){
				this.setState({responseMessage: "logged out"});
				return false;
			}.bind(this));
		}
		else if(this.props.method == "POST" && this.props.url == "/review"){
			api.doApiWithToken(this.props.method, this.props.url, json, function(result, res){
				this.setState({responseMessage: JSON.stringify(res,null,2)});
				return false;
			}.bind(this));
		}
		else{
			api.doApi(this.props.method, this.props.url, json, function(result, res){		
				this.setState({responseMessage: JSON.stringify(res,null,2)});
				return false;
			}.bind(this));
		}
		
		return false;
    },
    
    printSchema: function(){
		json = eval("(" + this.props.schema + ")");
		this.refs.data.getDOMNode().value = JSON.stringify(json,null,2);
		return false;
	},
	
    // show the login form
    render: function() {
        return (
			<center>
				<div>
					<div className="modal-body">
						<label className="method-label">{this.props.method} {this.props.url}</label><br />
						<div className="request-box">
							<label className="dialog-label-request">REQUEST DATA</label>
							<form id="credential-form" className="form-vertical" onSubmit={this.doMethod}>
								<textarea style={{resize: 'none'}} ref="data" cols="50" rows="5">  </textarea> <br />
								<div className="buttons-box-api">
									<input className="btn btn-lg data-button data-button-submit" type="submit" value="Submit" />
									<input className="btn btn-lg data-button data-button-submit" onClick={this.printSchema} type="button" value="Schema" />
								</div>
							</form>
							
						</div>
						<div className="response-box">
							<label className="dialog-label-response">RESPONSE DATA</label><br />
							<textarea className="data-box" style={{resize: 'none'}} ref="response" cols="50" rows="5" value={this.state.responseMessage} />
						</div>
					</div>
				</div>
			</center>
            
            );
    }
});

// API object
var api = {
	// write review api service
	doApi: function(_method, _url, _data, cb){
		var url = _url;
		var method = _method;
		var jsondata = _data;
		
		$.ajax({
			url: url,
            dataType: 'json',
            type: method,
            data: jsondata,
            success: function(res) {
                if (cb)
                    cb(true, res);
            },
            error: function(xhr, status, err) {
                // if there is an error, remove the login token
                delete localStorage.token;
                if (cb)
                    cb(false, xhr);
            }
		});
	},
	
	doApiWithToken: function(_method, _url, _data, cb){
		var url = _url;
		var method = _method;
		var jsondata = _data;
		
		$.ajax({
			url: url,
            dataType: 'json',
            type: method,
            data: jsondata,
            headers: {'Authorization': localStorage.token},
            success: function(res) {
                if (cb)
                    cb(true, res);
            },
            error: function(xhr, status, err) {
                // if there is an error, remove the login token
                delete localStorage.token;
                if (cb)
                    cb(false, xhr);
            }
		});
	},

};

// authentication object
var auth = {
	
	authenticate: function(data, cb){
		var url = "/authenticate";
        $.ajax({
			url: url,
			dataType: 'json',
			type: 'POST',
			data: data,
			success: function(res) {
				if (cb)
					cb(true, res);
			},
			error: function(xhr, status, err) {
				if (cb)
					cb(false, xhr);
			}
		});
	},
	
	// register user
    register: function(data, cb) {
        // submit request to server, call the callback when complete
        var url = "/register";
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: data,
            // on success, store a login token
            success: function(res) {
                localStorage.token = res.token;
                localStorage.name = res.username;
                if (cb)
                    cb(true, res);
                this.onChange(true);
            }.bind(this),
            error: function(xhr, status, err) {
                // if there is an error, remove any login token
                delete localStorage.token;
                if (cb)
                    cb(false, xhr);
                this.onChange(false);
            }.bind(this)
        });
    },
    
    // login the user
    login: function(data, cb) {
        // submit login request to server, call callback when complete
        cb = arguments[arguments.length - 1];
        // check if token in local storage
        if (localStorage.token) {
            if (cb)
                cb(true, "already logged in");
            this.onChange(true);
            return;
        }

        // submit request to server
        var url = "/login";
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function(res) {
                // on success, store a login token
                localStorage.token = res.token;
                localStorage.name = res.username;
                if (cb)
                    cb(true, res);
                this.onChange(true);
            }.bind(this),
            error: function(xhr, status, err) {
                // if there is an error, remove any login token
                delete localStorage.token;
                if (cb)
                    cb(false, xhr);
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
		<Route name="apiList" path="/apiList" handler={ApiList} />
    </Route>
    );

// Run the routes
Router.run(routes, function(Handler) {
    React.render(<Handler/>, document.body);
});

var courseInfo = [];
var selectedCourseInfo = {};
var reviewFieldValues = {};


				  
				  
				  

