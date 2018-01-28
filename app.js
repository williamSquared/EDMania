require('dotenv').config();
var http = require("http");
var _ = require("underscore");
var bodyParser = require('body-parser');
var consolidate = require("consolidate");
var PythonShell = require('python-shell');
var CronJob = require('cron').CronJob;

var routes = require('./routes');
var mongoClient = require("mongodb").MongoClient;
var express = require("express");

setupCronJobs();

var app = express();
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json({
  limit: '5mb'
}));

app.set('views', 'views');
app.use(express.static('./public'));

app.set('view engine', 'html');
app.engine('html', consolidate.underscore);

var port = process.env.PORT || 8000;
http.createServer(app).listen(port, function() {
  console.log('Server listening at port ' + port);

  var url = process.env.MLAB_URI;
  mongoClient.connect(url, function(err, db) {
    console.log("Connected to MLAB EDMania database");
    routes.initialize(app, db);
  });
});

function downloadSetData() {
	console.log('Attempting to download set data...');
	PythonShell.run('./public/scripts/set_data_download_script.py', function (err) {
	if (err) return err;
	console.log('Finished downloading set data.');
	});
}

function setupCronJobs() {
	new CronJob({
		cronTime: '00 00 6 * * *',
		onTick: function() {
		  downloadSetData();
		},
		runOnInit: true,
		timeZone: 'America/Phoenix'
	});

	new CronJob({
		cronTime: '00 00 13 * * *',
		onTick: function() {
		  downloadSetData();
		},
		runOnInit: false,
		timeZone: 'America/Phoenix'
	});
}