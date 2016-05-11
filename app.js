
var express = require('express');

var cfenv = require('cfenv');

var app = express();
var bodyParser = require('body-parser');
var watson = require('watson-developer-cloud');

app.use(bodyParser.urlencoded({
	extended: true
	})
);
app.use(bodyParser.json());


app.use(express.static(__dirname + '/public'));


var appEnv = cfenv.getAppEnv();

var qa = require('./watsonqa');

app.get('/', function(req, res){
	res.render('index');
});

// Post question
app.post('/ask', function(req,res) {
	qa.ask(req, function(response) {
		res.send(response);
	});
});

// Access Translate module
var tr = require('./watsontr');

app.post('/translate',tr.analyzeText);

//Acces Text-to-Speech module
var sp = require('./watsonsp');

app.get('/read', sp.readText);

app.listen(appEnv.port, "0.0.0.0", function() {
  console.log("server starting on " + appEnv.url);
});
