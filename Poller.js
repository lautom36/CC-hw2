const logger = require('./logger/index');
//TODO: import readBucket
//TODO: import processRequest

class Poller {
  poll = async () => {
    logger.info("\nConsumer started\n");
    while (count < 1) {
      await readBucket();
      const request = result;
  
      if (request !== null) {
        processRequest(request)
      }
      else {
        setTimeout(() => { logger.info('No request found. waiting for 100ms'); }, 100);
      }
      count++;
    }
  }
}

module.exports = Poller;