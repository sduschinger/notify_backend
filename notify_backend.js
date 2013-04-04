// Setup mongoose and the database
// Check out ./config-sample to configure your MongoDb, rename it to config.js
var mongoose = require('mongoose/');
var config = require('./config'); // Local congig file to hide creds
db = mongoose.connect(config.creds.mongoose_auth),
Schema = mongoose.Schema; 

var UserSchema = new Schema ( {
	userid: String,
	email: String,
	albums: [{artist: String, albumtitle: String, available: Boolean}]
}, {_id: false, id:false});

// Use the schema to register a model
var User = mongoose.model('User', UserSchema);

// require restify and bodyParser to read Backbone.js syncs
var restify = require('restify');  
var server = restify.createServer();


function getUser(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); 
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	User.find({userid:req.params.userid}).limit(20).execFind(function (arr, data) {
		res.send(data);
	});
}

function getUsers(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); 
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	User.find().limit(20).execFind(function (arr, data) {
		res.send(data);
	});
}

function saveInitial(req, res, next) {
	var user = new User({
		userid: req.params.userid,
		email: "duschsba@dusch.de",
		albums: [{artist: "artist1", albumtitle: "albumtitle1"}, {artist: "artist2", albumtitle: "albumtitle2"}]
	});
	user.save(function() {
		res.send(req.body);
	});
}

function saveUser(req, res, next) {
	//console.log(req.params.userid);
	var user = new User(req.params)
	console.log(user);
	//user.findOne(
	
	//user.save();
	User.findOneAndUpdate({userid:req.params.userid}, { email: user.email, albums: user.albums} , {upsert: true}, function (err, doc) {});
	res.send(req.body);
}

function remove(req, res, next) {
	User.remove({userid:req.params.userid}, function() {res.send(req.body)});
}

// Set up our routes and start the server
server.use(restify.bodyParser());
server.get('/users', getUsers);
server.get('/user/:userid', getUser);
server.post('/user', saveUser);

server.get('/initial/:userid', saveInitial);
server.get('/remove/:userid', remove);



server.listen(8080, function() {
  console.log('%s listening at %s, love & peace', server.name, server.url);
});