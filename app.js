var express = require('express'),
	app = express(),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	config = require('./config/config.js'),
	ConnectMongo = require('connect-mongo')(session),
	mongoose = require('mongoose').connect(config.dbURL),
	passport = require('passport'),
	// calling passport's facebook strategy
	FacebookStrategy = require('passport-facebook').Strategy,
	rooms = []



// setting view template path
app.set('views', path.join(__dirname, 'views'));

// setting templating engine
app.engine('html', require('hogan-express'));

// setting view engine as HTML
app.set('view engine', 'html');

// setting up static files
app.use(express.static(path.join(__dirname, 'views')));
app.use(cookieParser());


var env = process.env.NODE_ENV || 'development'
if(env === 'development') {
	// development specific
	app.use(session({
		secret: config.sessionSecret,
		resave: true,
    	saveUninitialized: true,
    })
);
} else {
	// production specific
	app.use(session({
		secret: config.sessionSecret,
		store: new ConnectMongo({
			url : config.dbURL,
			stringify : true
		}),
		resave: true,
    	saveUninitialized: true,
    }))
}

// initializing passport and enabling session in passport
app.use(passport.initialize());
app.use(passport.session());


// adding passport
require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);

// using of our Route Module
require('./routes/routes.js')(express, app, passport, config, rooms); 



/*app.listen(3000, function() {
	console.log("Listing on port 3000");
	console.log('Mode : ' + env)
});*/
app.set('port', process.env.PORT || 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

require('./socket/socket.js')(io, rooms);

server.listen(app.get('port'), function(){
	console.log("Chatcat on Port :" + app.get('port'));
})

