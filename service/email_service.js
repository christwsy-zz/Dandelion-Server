var sgMail = require('@sendgrid/mail');
var config = require('../config');
sgMail.setApiKey(config.SENDGRID_CONFIG.API_KEY);

exports.sendEmail = function(email, content) {
  const msg = {
    to: email,
    from: 'the.dandelion.app@gmail.com',
    subject: 'The Dandelion - You have a new message',
    html: content
  };
  sgMail.send(msg);
}
