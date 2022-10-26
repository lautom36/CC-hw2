class Request {
  // get first key in ReadBucket
  readBucket = async (numberKeys=1) => {
    const params = {
      Bucket: ReadBucketName,
      MaxKeys: numberKeys
    }

    await s3.listObjectsV2(params, function(err, data) {
      if (err) {
        logger.error(`There was an error reading from the ${ReadBucketName} bucket`);
      }
      else {
        logger.info(`Request was loaded from bucket ${ReadBucketName}`)
        return data;
      }
    }).promise();
  }

  processRequest = async (request) => {
    // get request from bucket 2
    const { Contents } = request;
    const key = Contents[0].Key;
    params = { Bucket: ReadBucketName, Key: key }
    await getObjectFromS3(params);
  
    //TODO: delete request
  
    // turn request into widget
    const { type } = object;
    const widget = jsonToWidget(object);
    
    // handle request
    if (type === 'create') {
      handleCreate(widget);
    } else if (type === 'update') {
      handleUpdate(widget);
    } else if (type === 'delete') {
      handleDelete(widget);
    }
  }

  handleCreate = async (widget) => {
    logger.info("handleCreate started");
    // if uploading to s3
    if (actionType === 's3') {
      const params = {Bucket: WriteBucketName, Body: JSON.stringify(widget), Key: `widget/${widget.owner}/${widget.id}`}
      await s3.putObject(params, (err, data) => {
        if (err) {
          logger.error(`There was an error uploading key: ${params.Key} to Bucket: ${params.Bucket}`);
        } else {
          logger.info(`Key: ${params.Key} was uploaded to Bucket: ${params.Bucket}`);
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
      }).promise();
    }
  }
  
  handleDelete = async (widget) => {
    logger.info("handleDelete started");
    // if uploading to s3
    if (actionType === 's3') {
      // check to see if item exists
      const params = { Bucket: WriteBucketName, Key: `widget/${widget.owner}/${widget.id}` };
      const object = await getObjectFromS3(params);
    
      if (object === null) {
        logger.error(`Key:${params.Key} was not found in Bucket: ${params.Bucket}. Cannot delete`);
        return;
      } else {
        logger.info(`Key:${params.Key} was found in Bucket: ${params.Bucket}`);
      }
    
      // delete object
      await s3.deleteObject(params, (err, data) => {
        if (err) {
          logger.error(`Key:${params.Key} could not be deleted from Bucket: ${params.Bucket}`);
          return;
        } else {
          logger.info(`Key:${params.Key} was deleted from Bucket: ${params.Bucket}`);
        }
      }).promise();
  
    // if uploading to ddb
    } else if (actionType === 'ddb') {
      // check to see if item exists
      const params = { 
        TableName: WriteDynoDBName, 
        Key: {
           "id": {"S": `${widget.id}`},
          }};
      const object = await getObjectFromDdb(params);
  
      if (object === null) {
        logger.error(`Item was not found in Table: ${params.TableName}. Cannot delete`)
        return;
      } else {
        logger.info(`Item was found in Table: ${params.TableName}`);
      }
  
      // delete item
      await ddb.deleteItem(params, (err, data) => {
        if (err) {
          logger.error(`Item could not be delted from Table: ${params.TableName}`);
        } else {
          logger.info(`Item was deleted from Table: ${params.TableName}`);
        }
      }).promise();
    }
  }
  
  handleUpdate = async (widget) => {
    logger.info("handleUpdate started");
    // get origional widget
    if (actionType === 's3') {
      params = { Bucket: WriteBucketName, Key: `widget/${widget.owner}/${widget.id}` };
      await getObjectFromS3(params);
    
    } else if (actionType === 'ddb') {
      const params = { 
        TableName: WriteDynoDBName, 
        Key: {
          "id": {"S": `${widget.id}`},
        }};
        await getObjectFromDdb(params);
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
    handleCreate(updatedWidget);
  }

}

module.exports = Request;