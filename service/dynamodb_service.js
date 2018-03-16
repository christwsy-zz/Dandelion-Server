var aws = require('aws-sdk');
var config = require('../config');

exports.call = function(action, params) {
  aws.config.update({
    accessKeyId: config.AWS.ACCESS_KEY_ID,
    secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
    region: config.AWS.REGION
  });
  const dynamoDb = new aws.DynamoDB.DocumentClient();
  console.log(action, params);
  return dynamoDb[action](params).promise();
}
