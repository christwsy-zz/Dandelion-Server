var twilio = require('twilio');
var config = require('../config');
const client = new twilio(config.TWILIO_CONFIG.SID, config.TWILIO_CONFIG.TOKEN);

exports.sendSms = function(phoneNumber, content) {
  return client.messages.create({
      to: phoneNumber,
      from: config.TWILIO_CONFIG.FROM,
      body: content,
    }).then(message => console.log(message.sid));
}
