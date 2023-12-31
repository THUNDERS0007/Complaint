
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var complaintRouter = require('./routes/complaint');
var signRouter = require('./routes/sign');
var homeRouter = require('./routes/home');
var solverRouter = require('./routes/solver');
var historyRouter = require('./routes/complainthistory');

var app = express();

app.use(session({
  secret : 'webslesson',
  resave : false,
  saveUninitialized : false
  
}));
app.use(function(req,res,next)
{
  res.locals.role = req.session.Role;
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + 'public/css'))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/complaint', complaintRouter);
app.use('/sign',signRouter);
app.use('/home',homeRouter);
app.use('/solver',solverRouter);
app.use('/history',historyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
