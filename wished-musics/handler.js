const _ = require('lodash');
const connectToDatabase = require('../config/db');
const WishedMusicSchema = require('../wished-musics/models/wished-musics');
const RankingSchema = require('../wished-musics/models/ranking');
const getResponse = require('../services/response');

module.exports.create = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();

    const eventBody = JSON.parse(event.body);
    if (!eventBody.name && !eventBody.artist && !eventBody.guest) {
      throw new Error('Dados não preencidos');
    }
    message = await WishedMusicSchema.create({
      name: eventBody.name,
      music: eventBody.music,
      link: eventBody.link,
      guest: eventBody.guest
    });

    return getResponse(
      200,
      JSON.stringify({
        message: 'Sugestão gravada com sucesso, obrigado'
      })
    );
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: error.message
    };
  }
};

module.exports.list = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();
    const musics = await WishedMusicSchema.find({}).lean();

    return getResponse(200, JSON.stringify(musics));
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: error.message
    };
  }
};

module.exports.ranking = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();
    const musics = await RankingSchema.find({})
      .lean()
      .sort({ total: -1 })
      .limit(5);

    return getResponse(200, JSON.stringify(musics));
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: error.message
    };
  }
};

module.exports.rankingAll = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();

    const params = event.queryStringParameters || {};

    const options = {
      page: params.page ? parseInt(params.page) : 1,
      limit: params.limit ? parseInt(params.limit) : 10,
      sort: { total: -1 },
      lean: true
    };

    const musics = await RankingSchema.paginate({}, options);
    return getResponse(200, JSON.stringify(musics));
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: error.message
    };
  }
};
