require('dotenv').config();
var http = require("http");
var _ = require("underscore");
var bodyParser = require('body-parser');
var consolidate = require("consolidate");

var routes = require('./routes');
var mongoClient = require("mongodb").MongoClient;
var express = require("express");

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