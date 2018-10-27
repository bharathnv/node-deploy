var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
const accountSid = 'AC1272f00ea8d0ce83270e9354459fe7d2';
const authToken = '9d19332df30ae8b49efe78f8381498e8';
const client = require('twilio')(accountSid, authToken);

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());
// Add headers
//app.use(cors());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'https://assignment-angular-deployment.herokuapp.com');
	res.header('Access-Control-Allow-Headers', 'Origin, Content-Type');
	next();
});

app.get('/', function (req, res) {
   res.send('Hello World');
});

app.post('/sendMessage', urlencodedParser, function (req, res) {
	client.messages
	.create({
     body: req.body.body,
     from: '+14159803151',
     to: '+91' + req.body.to
	})
	.then(message => {
	  console.log(message.sid);
	  res.end(JSON.stringify(message));
	})
	.done();
});

app.post('/makeCall', urlencodedParser, function (req, res) {
	client.calls
  .create({
    //url: 'http://demo.twilio.com/docs/voice.xml',
	url: 'https://assignment-backend-node.herokuapp.com/callbackForCall',
	to: '+91'+ req.body.to,
    from: '+14159803151',
  })
  .then(call => {
	process.stdout.write(call.sid);
	res.end(JSON.stringify(call));
  });
});

app.get('/callbackForCall', urlencodedParser, function (req, res) {
	const VoiceResponse = client.twiml.VoiceResponse;
	const response = new VoiceResponse();
	response.say(
	  {
		voice: 'man',
		language: 'en',
	  },
	  'Hi this is bharath, Talking through twilio services'
	);
	console.log(response.toString());
});

var server = app.listen(process.env.PORT || 8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})