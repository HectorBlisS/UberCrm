var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./helpers/passport');
require("dotenv").config();


var index = require('./routes/index');
var users = require('./routes/users');

//helpers
const moment = require('moment');
moment.locale('es');
const hbs = require('hbs');
hbs.registerHelper('date', (content)=>moment(content).format("LL"));
hbs.registerHelper('fromNow', (content)=>moment(content).fromNow());
hbs.registerHelper('inc', (content)=>Number(content)+1);
hbs.registerHelper('dec', (content)=>Number(content)-1);


//helpers


var app = express();
const cors = require("cors");
app.use(cors());

//session
app.use(session({
  resave:false,
  secret:"blisS",
  saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, ()=>console.log("Conectado a la BD"))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const auth = require('./routes/auth');
const admin = require('./routes/admin');

app.use('/auth', auth);
app.use('/admin', admin);
app.use('/uber', (req,res)=>{
	res.sendFile(path.join(__dirname, '/public', 'uber.html'));
});
app.use('/', users);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
