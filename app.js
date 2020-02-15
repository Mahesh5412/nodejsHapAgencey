var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var driverRegistrationRouter = require('./routes/driverRegistration');
var activeDriverRouter = require('./routes/activeDrivers');
var driverRegistrationUploadsRouter = require('./routes/driverRegistrationUploads');
var dashboardRouter = require('./routes/dashboard');
var forgetPasswordRouter = require('./routes/forgetPasswordOtp');
var updatePasswordRouter = require('./routes/updatePassword');
var profileRouter = require('./routes/profile');
var getDocumnetRouter = require('./routes/getDocuments');
var historyDetailsRouter = require('./routes/historyDetails');
var pendingsDocumentsRouter = require('./routes/pendingDocuments');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/login',loginRouter);
app.use('/driverRegistration',driverRegistrationRouter);
app.use('/activeDrivers',activeDriverRouter);
app.use('/driverRegistrationUploads',driverRegistrationUploadsRouter);
app.use('/dashboard',dashboardRouter);
app.use('/forgotPasswordOtp',forgetPasswordRouter);
app.use('/updatePassword',updatePasswordRouter);
app.use('/profile',profileRouter);
app.use('/getDocuments',getDocumnetRouter);
app.use('/historyDetails',historyDetailsRouter);
app.use('/pendingDocuments',pendingsDocumentsRouter);




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
