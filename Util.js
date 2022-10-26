class Util {
  getObjectFromS3 = async (params) => {
    // console.log('getObjectFromS3 started')
    await s3.getObject(params, (err, data) => {
      if (err) {
        logger.error(`There was an error getting key: ${params.Key} from Bucket: ${params.Bucket}`);
      } else {
        logger.info(`key: ${params.Key} was retrived from Bucket: ${params.Bucket}`);
        let preJson = data.Body.toString();
        return JSON.parse(preJson);
      }
    }).promise();
  }
  
  getObjectFromDdb = async (params) => {
    // console.log("getObjectFromDdb started");
    await ddb.getItem(params, (err, data) => {
      if (err) {
        logger.error(`There was an error getting the item from Table: ${params.TableName}`);
      } else {
        logger.info(`item was retrived from Table: ${params.TableName}`);
        return data;
      }
    }).promise();
  }

}

module.exports = Util;