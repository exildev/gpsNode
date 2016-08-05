var express = require('express');    //Express Web Server 
var multer  = require('multer')
var bodyParser = require('body-parser');
var upload = multer({ dest: 'uploads/' });
var mongoose = require('mongoose');

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodie

mongoose.connect('mongodb://localhost/gps');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Point;
db.once('open', function (){
	var point = mongoose.Schema({
		'name': String,
		'lat': String,
		'lng': String,
		'foto': String,
	});
	Point = mongoose.model('points', point);
	console.log("configurated");
});

app.post('/upload', upload.single('foto'), function (req, res, next) {
   // req.file is the `avatar` file
   // req.body will hold the text fields, if there were any
   var p = new Point({'name': req.body.name,'lat': req.body.lat, 'lng': req.body.lng, 'foto': req.file.path});
   p.save();
   console.log("saved", p, req.file);
   res.redirect('back');
});

app.get('/search', function (req, res, next) {
	var name = req.body.name || '';
	Point.find({'name': {'$regex': '', "$options": "i"}}, function(err, docs){
		res.setHeader('Content-Type', 'application/json');
		console.log(docs, err, req.body.name);
    	res.send(JSON.stringify(docs));
	});
});


app.use(express.static('public'));

var server = app.listen(3030, function() {
    console.log('Listening on port %d', server.address().port);
});