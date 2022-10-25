const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const yargs = require('yargs');
// const Widget = require('Widget.js')

// read from bucket 2 in key order
const ReadBucketName = 'usu-cs5260-lautom-requests';
const WriteBucketName = 'usu-cs5260-lautom-web';
const WriteDynoDBName = '';

const argv = yargs.argv;
let actionType = argv.type;
let count = 0;


// if bucket gets request, delete the request, process the request, wait 100ms and look for more requests

// handle create request
// -When the Consumer processes a Widget Create Request, it will create the specified 
//  widget and store it in either Bucket 3 or the DynamoDB table.

// handle update request
// -When the Consumer processes a Widget Update Request, it will first retrieve the 
//  specified widget, and then change all the attributes mentioned in the request.  If a 
//  property is not included in an update request or if its value is null, its current value 
//  should not be change.  If value of a property in an update request is the empty string, 
//  that means the corresponding property of the widget should be set to null or deleted (if 
//  it is one of the other attributes).  A widget’s id and owner cannot be changed.  If the 
//  specified widget does not exit, it should not throw an error.  Instead, it should simply log 
//  a warning.

// handle delete request
// -When the Consumer processes a Widget Delete Request, it needs to make sure that the 
//  specified object does not exist.  If it does not currently exist, the Consumer should not 
//  throw an error.  Instead, it should simply log a warning and move on to the next 
//  request. 
let result = null;
let object = null;
readBucket = async () => {
  const params = {
    Bucket: ReadBucketName,
    MaxKeys: 1
  }

  await s3.listObjectsV2(params, function(err, data) {
    if (err) {
      console.log("error")
      // TODO: log error 
    }
    else {
      // console.log("No Error")
      // TODO: log data
      // store data
      // console.log(data);
      result = data;
    }
  }).promise();
}

poll = async () => {
  while (count < 1) {
    await readBucket();
    const request = result;

    if (request !== null) {
      processRequest(request)
    }
    else {
      setTimeout(timeout, 100);
    }
    count++;
  }

}

timeout = () => {
  console.log('no request found. waiting for 100ms');
}

processRequest = async (request) => {
  console.log("processRequest started")
  const { Contents } = request;
  const key = Contents[0].Key;
  params = { Bucket: ReadBucketName, Key: key }
  await getObjectFromS3(params);
  // console.log(object);

  //TODO: delete request

  // handle request
  const { type } = object;
  // console.log(object);
  const widget = {
    id: object.widgetId,
    owner: object.owner,
    label: object.label,
    description: object.description,
    otherAttributes: object.otherAttributes,
  };
  
  // console.log(widget);
  if (type === 'create') {
    handleCreate(widget);
  } else if (type === 'update') {
    handleUpdate(widget);
  } else if (type === 'delete') {
    handleDelete(widget);
  }

  // preform action

}

getObjectFromS3 = async (params) => {
  await s3.getObject(params, (err, data) => {
    if (err) {
      //TODO: error
    } else {
      let preJson = data.Body.toString();
      object = JSON.parse(preJson);
    }
  }).promise();
}

handleCreate = async (widget) => {
  console.log("handleCreate started");
  // console.log(widget);
  actionType = 's3'
  if (actionType === 's3') {
    const params = {Bucket: WriteBucketName, Body: JSON.stringify(widget), Key: `widget/${widget.owner}/${widget.id}`}
    await s3.putObject(params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("no error", data)
      }
    }).promise();
  }
}

handleDelete = async (widget) => {
}

handleUpdate = async (widget) => {
  console.log("handleUpdate started");
  // get og widget
  params = { Bucket: WriteBucketName, Key: `widget/${widget.owner}/${widget.id}` }
  await getObjectFromS3(params);

  const ogWidget = {
    id: object.widgetId,
    owner: object.owner,
    label: object.label,
    description: object.description,
    otherAttributes: object.otherAttributes,
  };

  // update widget
  let updatedWidget = ogWidget;
  for (key in widget) {
    if (widget[key] !== undefined) {
      updatedWidget[key] = widget[key];
    }
  }

  // put updated widget
  handleCreate(updatedWidget);
}



poll()