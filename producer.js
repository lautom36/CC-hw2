var argv = require('yargs').argv;
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB();
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});


const ReadBucketName = 'usu-cs5260-lautom-requests';
const ReadQueueName = 'https://sqs.us-east-1.amazonaws.com/153933164283/cs5260-requests'

let testCred1 = {"type":"create","requestId":"e80fab52-71a5-4a76-8c4d-11b66b83ca2a","widgetId":"8123f304-f23f-440b-a6d3-80e979fa4cd6","owner":"Mary Matthews","label":"JWJYY","description":"THBRNVNQPYAWNHGRGUKIOWCKXIVNDLWOIQTADHVEVMUAJWDONEPUEAXDITDSHJTDLCMHHSESFXSDZJCBLGIKKPUYAWKQAQI","otherAttributes":[{"name":"width-unit","value":"cm"},{"name":"length-unit","value":"cm"},{"name":"rating","value":"2.580677"},{"name":"note","value":"FEGYXHIJCTYNUMNMGZBEIDLKXYFNHFLVDYZRNWUDQAKQSVFLPRJTTXARVEIFDOLTUSWZZWVERNWPPOEYSUFAKKAPAGUALGXNDOVPNKQQKYWWOUHGOJWKAJGUXXBXLWAKJCIVPJYRMRWMHRUVBGVILZRMESQQJRBLXISNFCXGGUFZCLYAVLRFMJFLTBOTLKQRLWXALLBINWALJEMUVPNJWWRWLTRIBIDEARTCSLZEDLZRCJGSMKUOZQUWDGLIVILTCXLFIJIULXIFGRCANQPITKQYAKTPBUJAMGYLSXMLVIOROSBSXTTRULFYPDFJSFOMCUGDOZCKEUIUMKMMIRKUEOMVLYJNJQSMVNRTNGH"}]};
const testCred2 = {"type":"update","requestId":"840117b1-b4b8-4750-8757-36bc5a441f9e","widgetId":"8123f304-f23f-440b-a6d3-80e979fa4cd6","owner":"Mary Matthews","description":"GEYPOLQOEELYDNNLBCLPQGTNIAGBJMIGGKD","otherAttributes":[{"name":"color","value":"yellow"},{"name":"size","value":"301"},{"name":"size-unit","value":"cm"},{"name":"height","value":"637"},{"name":"height-unit","value":"cm"},{"name":"width","value":"85"},{"name":"rating","value":"0.23102671"},{"name":"price","value":"24.44"},{"name":"quantity","value":"843"},{"name":"vendor","value":"TKDWESJEFIW"},{"name":"note","value":"ZDXTSRLNLKGBPEZOUAQOKQSXONDVUGTOAVAKVMMGJJCMHVSXUNVFWCTKEDPIZROGHEKCIVAWEOMKMWGQCRZJXWAECGNCUCXGKBWNMKGHUDRJPXYQOFNZXYRPYFWXGYKEMJNGAKIHLXHHNOJJIJFFTVGUIVCPJOKOEEJWLDAJDKWMZREXDWTLPJMPOOEASBTZUOCSAZOVCNHOWWMVURWXOHSYMNXBKTBHVWCCUNULSLRNDUTZHKHDNBWTOPRPERHKEUTPOBQAJYSNJXFDDKSWJACWUJIBQFORREFKZIWEVBBIGZUEYPFTCVJQWMVAYXLENZZVYPRBRRXGPAAKLFBDIMNKDDNEBJZVORUVRUUBOLWTAKXJO"}]};
const testCred3 = {"type":"delete","requestId":"21cf74b2-dbf2-46bb-a274-b8e3eac679bf","widgetId":"8123f304-f23f-440b-a6d3-80e979fa4cd6","owner":"Mary Matthews"};
testCred1 = JSON.stringify(testCred1);

let actionType = argv.type;
actionType = 'sqs';

const poller = async () => {
  if (actionType === 'sqs') {
    const params = {
      DelaySeconds: 10,
      MessageBody: testCred1,
      QueueUrl: ReadQueueName //SQS_QUEUE_URL; e.g., 'https://sqs.REGION.amazonaws.com/ACCOUNT-ID/QUEUE-NAME'
    };
    result = await sqsUpload(params);
    console.log(result)
  }

}
// run with node producer.js --type=sqs  

const sqsUpload = async (sendParams) => {
    return data = await sqs.sendMessage(sendParams, (err, data) => {
      if (err) {
        console.log('Error', err);
      } else {
        console.log("Successfully added message", data.MessageId);
      }
    });
};

// poller();

const testAPIGateway = () => {
  
}