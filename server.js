var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var twilio = require('twilio');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());
// Add headers
app.use(cors());

app.get('/', function (req, res) {
   res.send('Hello World');
});

app.post('/sendMessage', urlencodedParser, function (req, res) {
	const client = twilio(req.body.accountSid, req.body.authToken);
	client.messages
	.create({
     body: req.body.body,
     from: '+14159803151',
     to: '+91'+req.body.to
	})
	.then(message => {
	  console.log(message.sid);
	  res.end(JSON.stringify(message));
	})
	.done();
});

app.post('/makeCall', urlencodedParser, function (req, res) {
	const client = twilio(req.body.accountSid, req.body.authToken);
	client.calls
  .create({
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
});