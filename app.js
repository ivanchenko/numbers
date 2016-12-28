require('babel-core/register');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var config = require('./config');
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var http = require('http');
var MongoStore = require('connect-mongo')(session);
var app = express();

var dbUri = config.get('mongoose:uri');
var dbOptions = config.get('mongoose:options');
var serverPort = config.get('port');

/** MongoDB connect **/

mongoose.Promise = require('bluebird');

mongoose.connect(dbUri, dbOptions, function (err) {
	if (err) {
		console.error('Error connecting to:', dbUri);
		console.error(err);
		process.exit(1);
	} else {
		console.log('Succeeded connect to:', dbUri);
	}
});

app.engine('html', require('ejs-locals'));
app.set('views', path.join(__dirname, './html'));
app.set('view engine', 'html');

app.use(favicon(path.join(__dirname, './img/favicon.png')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
	secret: config.get('session:secret'),
	cookie: config.get('session:cookie'),
	key: config.get('session:key'),
	store: new MongoStore({mongooseConnection: mongoose.connection}),
	resave: true,
	saveUninitialized: true
}));

app.use('/img', express.static(path.join(__dirname, './img')));
app.use('/static', express.static(path.join(__dirname, './static')));

app.use(require('./routes/checkAuth'));
app.use(require('./routes/index'));
app.use(require('./routes/notFound'));


/** Server start **/

app.server = http.createServer(app);
app.server.listen(serverPort, function () {
	console.log('Numbers now running at port:', serverPort);
});

require('./routes/socketHandler')(app.server);


module.exports = app;