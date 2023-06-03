const { DynamoDB } = require("aws-sdk");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const httpEventNormalizer = require("@middy/http-event-normalizer");
const httpErrorHanlder = require("@middy/http-error-handler");
const createError = require("http-errors");

const getAuctions = async (event) => {
  const db = new DynamoDB.DocumentClient();

  try {
    const { Items: auctions } = await db
      .scan({ TableName: process.env.AUCTION_TABLE_NAME })
      .promise();

    return {
      status: 200,
      auctions,
    };
  } catch (error) {
    console.log({ error });
    throw new createError.InternalServerError(error);
  }
};

module.exports = {
  getAuctions: middy(getAuctions)
    .use(httpJsonBodyParser())
    .use(httpEventNormalizer())
    .use(httpErrorHanlder()),
};
