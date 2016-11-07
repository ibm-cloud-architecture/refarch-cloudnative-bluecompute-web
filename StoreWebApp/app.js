var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var index = require('./routes/index');
var inventory = require('./routes/inventory');
var item = require('./routes/item');
var login = require('./routes/login');
var logistics = require('./routes/logistics');
var financing = require('./routes/financing');
var MCAWebSiteStrategy = require('bms-mca-token-validation-strategy').MCAWebSiteStrategy;

var options = {
    callbackUrl: "https://jkwong-bluecompute-webapp-qa.mybluemix.net/authenticated"
};

passport.use(new MCAWebSiteStrategy(options));

var app = express();
app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'ibmApiConnect4me2',
  resave: false,
  saveUninitialized: true
}));

app.use('/', index);
app.use('/inventory', inventory);
app.use('/item', item);
app.use('/login', login);
app.use('/logistics', logistics);
app.use('/financing', financing);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
