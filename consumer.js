var argv = require('yargs').argv;
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB();
const logger = require('./logger/index');

const ReadBucketName = 'usu-cs5260-lautom-requests';
const WriteBucketName = 'usu-cs5260-lautom-web';
const WriteDynoDBName = 'widgets';

// how to run 
// node consumer.js --type=s3 
// or
// node consumer.js --type=ddb
let actionType = argv.type;

// get first key in ReadBucket
readBucket = async (numberKeys=1) => {
  const params = {
    Bucket: ReadBucketName,
    MaxKeys: numberKeys
  }

  return await s3.listObjectsV2(params, async (err, data) => {
    if (err) {
      logger.error(`There was an error reading from the ${ReadBucketName} bucket`);
    }
    else {
      logger.info(`Bucket: ${ReadBucketName} was read`)
      return data;
      // return data;
    }
  }).promise();
}

// untill interupted look for requests
let processing = false;
poll = async () => {
  logger.info("\nConsumer started\n");
  while (true) {
    if (!processing){
      // processing = true;
      result = await readBucket();
      let request = result;
      if (request.KeyCount === 0) {
        request = null;
      }
      
      if (request !== null) {
        await processRequest(request)
      }
      else {
        setTimeout(() => { logger.info('No request found. waiting for 100ms'); }, 100);
      }
    }
  }
}

jsonToWidget = (json) => {
  return {
    id: json.widgetId,
    owner: json.owner,
    label: json.label,
    description: json.description,
    otherAttributes: json.otherAttributes,
  };
}


processRequest = async (request) => {
  let object = null;
  // get request from bucket 2
  const { Contents } = request;
  const key = Contents[0].Key;
  params = { Bucket: ReadBucketName, Key: key }
  object = await getObjectFromS3(params);
  object = s3toJson(object);
 
  // turn request into widget
  const { type } = await object;
  const widget = jsonToWidget(object);
  
  const deleteParams = { Bucket: ReadBucketName, Key: `widget/${widget.owner}/${widget.id}`};
  await deleteRequest(deleteParams);

  // handle request
  if (type === 'create') {
    await handleCreate(widget);
  } else if (type === 'update') {
    await handleUpdate(widget);
  } else if (type === 'delete') {
    await handleDelete(widget);
  } else {
    logger.error("type was not suported");
  }
}

s3toJson = (data) => {
  let preJson = data.Body.toString();
      let json = JSON.parse(preJson);
      return json;
}

getObjectFromS3 = async (params) => {
  return await s3.getObject(params, async (err, data) => {
    if (err) {
      logger.error(`There was an error getting key: ${params.Key} from Bucket: ${params.Bucket}`);
    } else {
      logger.info(`key: ${params.Key} was retrived from Bucket: ${params.Bucket}`);
      return await data;
    }
  }).promise();
}

getObjectFromDdb = async (params) => {
  return await ddb.getItem(params, async (err, data) => {
    if (err) {
      logger.error(`There was an error getting the item from Table: ${params.TableName}`);
    } else {
      logger.info(`item was retrived from Table: ${params.TableName}`);
      return data;
    }
  }).promise();
}

handleCreate = async (widget) => {
  logger.info("handleCreate started");
  // if uploading to s3
  if (actionType === 's3') {
    const params = {Bucket: WriteBucketName, Body: JSON.stringify(widget), Key: `widget/${widget.owner}/${widget.id}`}
    return await s3.putObject(params, async (err, data) => {
      if (err) {
        logger.error(`There was an error uploading key: ${params.Key} to Bucket: ${params.Bucket}`);
      } else {
        logger.info(`Key: ${params.Key} was uploaded to Bucket: ${params.Bucket}`);
        return data;
      }
    }).promise();

  // if uploading to ddb
  } else if (actionType === 'ddb') {
    const ddbDc = new AWS.DynamoDB.DocumentClient();
    const params = { TableName: WriteDynoDBName, Item: widget };
    await ddbDc.put(params, function(err, data) {
      if (err) {
        logger.error(`There was an error uploading the item to Table: ${params.TableName}`);
      } else {
        logger.info(`Item was uploaded to Table: ${params.TableName}`);
      }
      processing = false;
    }).promise();
  }
}

handleDelete = async (widget) => {
  logger.info("handleDelete started");
  let object = null;
  // if uploading to s3
  if (actionType === 's3') {
    // check to see if item exists
    const params = { Bucket: WriteBucketName, Key: `widget/${widget.owner}/${widget.id}` };
    object = await getObjectFromS3(params);
    object = s3toJson(object);
  
    if (object === null) {
      logger.error(`Key:${params.Key} was not found in Bucket: ${params.Bucket}. Cannot delete`);
      return;
    } else {
      logger.info(`Key:${params.Key} was found in Bucket: ${params.Bucket}`);
    }
  
    // delete object
    await s3.deleteObject(params, async (err, data) => {
      if (err) {
        logger.error(`Key:${params.Key} could not be deleted from Bucket: ${params.Bucket}`);
        return;
      } else {
        logger.info(`Key:${params.Key} was deleted from Bucket: ${params.Bucket}`);
      }
      processing = false;
    }).promise();

  // if uploading to ddb
  } else if (actionType === 'ddb') {
    // check to see if item exists
    const params = { 
      TableName: WriteDynoDBName, 
      Key: {
         "id": {"S": `${widget.id}`},
        }};
    object = await getObjectFromDdb(params);

    if (object === null) {
      logger.error(`Item was not found in Table: ${params.TableName}. Cannot delete`)
      return;
    } else {
      logger.info(`Item was found in Table: ${params.TableName}`);
    }

    // delete item
    await ddb.deleteItem(params, async (err, data) => {
      if (err) {
        logger.error(`Item could not be delted from Table: ${params.TableName}`);
      } else {
        logger.info(`Item was deleted from Table: ${params.TableName}`);
      }
      processing = false;
    }).promise();
  }
}

handleUpdate = async (widget) => {
  let object = null;
  logger.info("handleUpdate started");
  // get origional widget
  if (actionType === 's3') {
    params = { Bucket: WriteBucketName, Key: `widget/${widget.owner}/${widget.id}` };
    object = await getObjectFromS3(params);
    object = s3toJson(object);
  
  } else if (actionType === 'ddb') {
    const params = { 
      TableName: WriteDynoDBName, 
      Key: {
        "id": {"S": `${widget.id}`},
      }};
      object = await getObjectFromDdb(params);
    }
    
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
  await handleCreate(updatedWidget);
}

deleteRequest = async (paramas) => {
  await s3.deleteObject(params, async (err, data) => {
    if (err) {
      logger.error(`Key:${params.Key} could not be deleted from Bucket: ${params.Bucket}`);
      return;
    } else {
      logger.info(`Key:${params.Key} was deleted from Bucket: ${params.Bucket}`);
    }
  }).promise();
}



poll()


module.exports = handleCreate, handleDelete, handleUpdate, jsonToWidget, readBucket;