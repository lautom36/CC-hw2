// get widget request from body of the post method
// validate the request
// send request to sqs queue

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

exports.handler = async (event) => {
  const requestJson = getRequest(event);
  const isValid = validate(requestJson);
  if (isValid) {
    sendToSqs(requestJson);
  }
  return response(isValid);
}

const getRequest = (event) => {
  if (event.body) {
    return JSON.parse(event.body);
  }
  return null;
}

const validate = (request) => {
  if (request === null) {
    return false;
  }else {
    //TODO: needs some more work but is ok for now
    return true;
  }
}

const sendToSqs = async (request) => {
  const ReadQueueName = 'https://sqs.us-east-1.amazonaws.com/153933164283/cs5260-requests'
  const sendParams = {
    DelaySeconds: 10,
    MessageBody: request,
    QueueUrl: ReadQueueName //SQS_QUEUE_URL; e.g., 'https://sqs.REGION.amazonaws.com/ACCOUNT-ID/QUEUE-NAME'
  };
  return data = await sqs.sendMessage(sendParams, (err, data) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log("Successfully added message", data.MessageId);
    }
  });
}

const response = (isValid) => {
  let response = {};
  if (isValid) {
    response = {
      statusCode: 200,
      headers: {
        "x-custom-header" : "my custom header value"
      },
      body: JSON.stringify({message: "success"})
    };
  } else {
    response = {
      statusCode: 200,
      headers: {
        "x-custom-header" : "my custom header value"
      },
      body: JSON.stringify({message: "failure"})
    };
  }
  return response;
}