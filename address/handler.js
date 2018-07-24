const {
  drawRoute
} = require("../services/address");
const getResponse = require('../services/response');

module.exports.getPath = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;

    const params = event.queryStringParameters || {};

    const origin = {
      lat: params.lat,
      lng: params.lng
    };
    const destination = {
      lat: '-19.854593',
      lng: '-43.980393',
    };

    const res = await drawRoute(origin, destination);

    return getResponse(200, JSON.stringify(res));

  } catch (error) {
    return getResponse(
      error.statusCode || 500,
      JSON.stringify({
        message: error.message
      })
    );
  }
};