// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
//maybe will change
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
var passport = require('passport');
var flash    = require('connect-flash');
// shows you what error message is 

var morgan       = require('morgan');
// logger what's happening in app
var cookieParser = require('cookie-parser');
// helps look @ cookies, files that are on ur computer that stays 
var bodyParser   = require('body-parser');
// request bodies (bodyParser) to see what's in a form
var session      = require('express-session');
// once user logs in, has a "session". when the user logs out, the session is terminated 

var configDB = require('./config/database.js');
// same as a function call. calling configDB, it's the url + db property in database.js
// require is a function. when functions return, they return to where the func was called

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database
// spits out a function that is then called 
// app, passport, db are arguments

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
