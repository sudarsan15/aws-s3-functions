/*

Author Name  : Sudarsan PS 
website      : www.sudarsanps.com
Description  : This is for implementing the dynamic upload of files to S3 bucket    
Date         : 4th April 2018 

*/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var helmet = require('helmet');
var csrf = require('csurf');

var index = require('./routes/index');
var static = require('./routes/static');
var fetch = require('./routes/fetch');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('trust proxy', 1) // trust first proxy 
app.use(session({
  secret  : 'epkbqGF9qNp4QqgyRuJX4bKjtwqdg',
  expires : new Date(Date.now() + 3600000),
  resave  : false,
  saveUninitialized : true,
}));
app.use(flash());

//To disable x-powered-by details in header
app.disable('x-powered-by');
app.use(helmet());
app.use(helmet.noCache())
app.use(helmet.frameguard())
app.use(csrf());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/static', static);
app.use('/fetch', fetch);


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
