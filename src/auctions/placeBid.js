const { DynamoDB } = require("aws-sdk");
const createError = require("http-errors");
const { commonMiddleware } = require("./lib/commonMiddleware");
const { getAuction } = require("./getAuctionById");

const handler = async (event) => {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const db = new DynamoDB.DocumentClient();
  let updatedAuction;

  const auction = await getAuction(id);
  const auctionAmount = auction.highestBid.amount;

  if (amount <= auctionAmount)
    throw new createError.Forbidden(
      `Your bid amount should be higher than ${auctionAmount}`
    );

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

module.exports = { placeBid: commonMiddleware(handler) };
