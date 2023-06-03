const { DynamoDB } = require("aws-sdk");
const { v4: uuid } = require("uuid");
const createError = require("http-errors");
const { commonMiddleware } = require("./lib/commonMiddleware");

const createAuction = async (event) => {
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
  createAuction: commonMiddleware(createAuction),
};
