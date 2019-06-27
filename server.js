var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');


mongoose.connect('mongodb://localhost/test');
require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));

app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash());

// app.all("*", passport.authenticate("WindowsAuthentication"), function (request,response,next){
//     next();
// });



app.set('view engine', 'ejs');


require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Server running on port: ' + port);




