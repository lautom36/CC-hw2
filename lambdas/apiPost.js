const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

exports.handler = async (event) => {
  console.log('starting lambda');
  console.log(event);
  const requestJson = getRequest(event);
  const isValid = validate(requestJson);
  console.log('isValid: ', isValid)
  if (isValid) {
    sendToSqs(requestJson);
  }
  return response(isValid);
}

const getRequest = (event) => {
  if (event.body) {
    // console.log(event.body)
    // const preJson = event.body.toString();
    // console.log(preJson);
    // const json = JSON.parse(preJson);
    return event.body;
  }
  return null;
}

const validate = (request) => {
  let valid = true;
  if (request === null) {
    return false;
  }else {
    if (!request.type) { valid = false; console.log('no type'); }
    if (!request.requestId) { valid = false; console.log('no requestId'); }
    if (!request.widgtId) { valid = false; console.log('no widgetId'); }
    if (!request.owner) { valid = false; console.log('no owner'); }
    if (!request.label) { valid = false; console.log('no label'); }
    return valid;
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
      statusCode: 201,
      headers: {
        "x-custom-header" : "my custom header value"
      },
      body: JSON.stringify({message: "failure"})
    };
  }
  return response;
}