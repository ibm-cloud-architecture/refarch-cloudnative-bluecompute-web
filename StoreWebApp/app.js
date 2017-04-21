if (process.env.NEW_RELIC_LICENSE_KEY) {
    var newrelic = require('newrelic');
}
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var catalog = require('./routes/catalog');
var review = require('./routes/review');
var customer = require('./routes/customer');
//var images = require('./routes/images');
var orders = require('./routes/orders');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

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
app.use('/catalog', catalog);
app.use('/customer', customer);
app.use('/review', review);
//app.use('/login', login);
//app.use('/image', images);
app.use('/order', orders);

app.use('/', express.static('public/resources'));
app.use('/', express.static('public/stylesheets'));


//Setup HealthCheck API
const healthchecks = require('./server/lib/healthchecks');
const CHECKS_FILE = __dirname+"/config/checks";
const healthcheck_options = {
  filename: CHECKS_FILE,
  timeout: '5s',
  returnJSON: true
};
app.use('/_healthchecks', healthchecks(healthcheck_options));


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
