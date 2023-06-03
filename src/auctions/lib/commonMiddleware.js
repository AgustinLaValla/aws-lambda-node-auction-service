const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const httpEventNormalizer = require("@middy/http-event-normalizer");
const httpErrorHanlder = require("@middy/http-error-handler");

const commonMiddleware = (hanlder) =>
  middy(hanlder).use([
    httpJsonBodyParser(),
    httpEventNormalizer(),
    httpErrorHanlder(),
  ]);

module.exports = { commonMiddleware };
