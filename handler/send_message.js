var uuid = require('uuid');
var smsService = require('../service/sms_service');
var emailService = require('../service/email_service');
var dynamoDb = require('../service/dynamodb_service');
var bitly = require('bitly');
var config = require('../config');
var bitlyClient= bitly(config.BITLY.ACCESS_TOKEN);
var fs = require('fs');
var path = require('path');
var application_root = __dirname; //Web framework

// Send text message 
exports.sendSms = function(phoneNumber, content) {
  processContent(content, function(url) {
    var textMsg = "You have a new message: " + url;
    smsService.sendSms(phoneNumber, textMsg);
  });
}

// Send text message to a phone number with content
exports.sendEmail = function(email, content) {
  processContent(content, function(url) {
    fs.readFile(path.join(application_root, '/template.html'), 'utf-8', function (err, data) {
      if (err) {
        console.error(err);
        return;
      }
      // replace the placeholder for the actual url
      data = data.replace(/<%URL%>/g, url);
      emailService.sendEmail(email, data);
    });
  });
}

// Store the message to the server and generate a shorten URL
function processContent(content, callback) {
  var messageId = uuid.v1();
  storeMessage(messageId, content);
  generateLink(messageId).then(function (data) {
    var resultUrl = '';
    if (data.status_code == 200) {
      resultUrl = data.data.url;
    } else {
      resultUrl = config.SERVER_URL + messageId;
    }
    callback(resultUrl);
  }, function(error) {
    console.error(error);
  });
}

function generateLink(messageId) {
  var link = config.SERVER_URL + messageId;
  console.log(link);
  return bitlyClient.shorten(link);
}

// Store the message to the database
function storeMessage(messageId, content) {
  var params = {
    TableName: 'messages',
    Item: {
      'messageId': messageId,
      'content': content
    }
  };
  return dynamoDb.call('put', params);
}
