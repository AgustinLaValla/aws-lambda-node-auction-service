const { DynamoDB } = require("aws-sdk");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const { v4: uuid } = require("uuid");
const httpEventNormalizer = require("@middy/http-event-normalizer");
const httpErrorHanlder = require("@middy/http-error-handler");
const createError = require("http-errors");

const createAuction = async (event) => {
  console.log({body: event.body})
  const { title } = event.body;
  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };

  const db = new DynamoDB.DocumentClient();
  

  try {
    await db
      .put({
        TableName: process.env.AUCTION_TABLE_NAME,
        Item: auction,
      })
      .promise();
      console.log('DONE!')
  } catch (error) {
    console.log(error);
    throw new createError.NotFound(error);
  }

  return {
    status: 201,
    auction,
  };
};

module.exports = {
  createAuction: middy(createAuction)
    .use(httpJsonBodyParser())
    .use(httpEventNormalizer()) //adjust the API gateway event object to prevent accidentally having nonexisting objects
    .use(httpErrorHanlder()) // Allows to make handler process smooth and clean,
};
