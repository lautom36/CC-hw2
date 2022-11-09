FROM node:14

COPY package*.json ./
RUN npm install

COPY . .
CMD ["Node", "consumer.js", "--type=s3", "--queue=https://sqs.us-east-1.amazonaws.com/153933164283/cs5260-requests"]
# node consumer.js --type=s3 --queue=https://sqs.us-east-1.amazonaws.com/153933164283/cs5260-requests
# node consumer.js --type=ddb
# node consumer.js --type=s3