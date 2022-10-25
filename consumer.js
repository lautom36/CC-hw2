const AWS = require('aws-sdk');
const commandLineArgs = require('command-line-args')

// read from bucket 2 in key order

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