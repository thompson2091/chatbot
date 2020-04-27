var createError = require('http-errors');
var express 	= require('express');
var path 		= require('path');
var logger 		= require('morgan');
var app 		= express();
var server 		= require('http').Server(app);
var io 			= require('socket.io').listen(server);

require('dotenv').config();
app.use(logger('dev'));

// setup public dir
app.use(express.static(path.join(__dirname + '/../', 'public'))); 

// setup view engine
app.set('views',path.join(__dirname + '/', 'views'));
app.set('view engine', 'ejs');

//app.use('/bots/slack', require('./controllers/slack2.js'));	// setup slack
app.use('/', require('./routes')(io));
 
// Don't create an error if favicon is requested
app.use((req, res, next) => {
	if (req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
		return res.sendStatus(204);
	}
	return next();
});

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
 
// Start the server
app.set('port', process.env.PORT || 3000);


server.listen(app.get('port'));




