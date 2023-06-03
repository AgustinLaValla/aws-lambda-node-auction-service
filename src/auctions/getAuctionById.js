const { DynamoDB } = require("aws-sdk");
const createError = require("http-errors");
const { commonMiddleware } = require("./lib/commonMiddleware");

const getAuctionById = async (event) => {
  const { id } = event.pathParameters;

  const db = new DynamoDB.DocumentClient();

  let auction;

  try {
    const { Item } = await db
      .get({
        TableName: process.env.AUCTION_TABLE_NAME,
        Key: { id },
      })
      .promise();

    auction = Item;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  if (!auction)
    throw new createError.NotFound(`Auction with ID "${id}" not found!`);

  return {
    status: 200,
    auction,
  };
};

module.exports = {
  getAuctionById: commonMiddleware(getAuctionById),
};
