// Module dependencies.
var express = require( 'express' ); //Web framework
var http = require('http');
var bodyParser = require('body-parser'); 
var config = require('./config');
var messageHandler = require('./handler/send_message');

// Server setup
// Create server instance
var app = express();
app.use(bodyParser.json())

// Listen on localhost
var server = app.listen(config.PORT, function () {
  var host = server.address().address; 
  var port = server.address().port;
  console.log("Server running at http://%s:%s", host, port);
});

var sendRouter = express.Router();

// Router for sending text message
sendRouter.post('/sms', function(req, res) {
  var body = req.body;
  console.log(body);
  if (!body.content || !body.phoneNumber) {
    res.send({ "code": 400, "result": "bad request" });
    return;
  } else {
    const result = messageHandler.sendSms(body.phoneNumber, body.content);
    res.send({ "code": 200, "result": "sent", result });
  }
});

// Router for sending email
sendRouter.post('/email', function (req, res) {
  var body = req.body;
  console.log(body);
  if (!body.content || !body.email) {
    res.send({ "code": 400, "result": "bad request" });
    return;
  } else {
    const result = messageHandler.sendEmail(body.email, body.content);
    res.send({ "code": 200, "result": "sent", result });
  }
});

app.use('/send', sendRouter);