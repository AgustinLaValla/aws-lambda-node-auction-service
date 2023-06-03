const { DynamoDB } = require("aws-sdk");
const createError = require("http-errors");
const { commonMiddleware } = require("./lib/commonMiddleware");

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
  getAuctions: commonMiddleware(getAuctions),
};
