const { DynamoDB } = require("aws-sdk");
const createError = require("http-errors");
const { commonMiddleware } = require("./lib/commonMiddleware");

const handler = async (event) => {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const db = new DynamoDB.DocumentClient();

  let updatedAuction;

  try {
    const { Attributes } = await db
      .update({
        TableName: process.env.AUCTION_TABLE_NAME,
        Key: { id },
        UpdateExpression: "set highestBid.amount = :amount",
        ExpressionAttributeValues: {
          ":amount": amount,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    updatedAuction = Attributes;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    status: 200,
    auction: updatedAuction,
  };
};

module.exports = { placePid: commonMiddleware(handler) };
