const connectToDatabase = require('../config/db');
const GuestsSchema = require('../guests/models/guests');
const WishedMusicSchema = require('../wished-musics/models/wished-musics');
const RankingSchema = require('../wished-musics/models/ranking');
const getResponse = require('../services/response');
const jsonData = require('./guests-data.json');

module.exports.createBatch = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();

    const guests = await GuestsSchema.insertMany(jsonData);

    return getResponse(200, JSON.stringify({ message: 'DB started' }));
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify({
        message: error.message
      })
    };
  }
};

module.exports.create = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();

    const eventBody = JSON.parse(event.body);
    await GuestsSchema.create({
      name: eventBody.name
    });

    return getResponse(200, JSON.stringify({ message: 'Convidado criado' }));
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify({
        message: error.message
      })
    };
  }
};

module.exports.update = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();

    const eventBody = JSON.parse(event.body);

    if (
      !eventBody._id ||
      eventBody.confirmed === undefined ||
      eventBody.confirmed === null
    ) {
      throw new Error('Dados inconsistentes');
    }
    const _id = eventBody._id;
    const confirmed = eventBody.confirmed;
    const guest = await GuestsSchema.findByIdAndUpdate(_id, {
      $set: {
        confirmed,
        email: eventBody.email,
        date_confirmation: new Date()
      }
    });

    if (eventBody.music) {
      await WishedMusicSchema.create({
        name: eventBody.music.name.trim(),
        music: eventBody.music.music.trim(),
        link: eventBody.music.link,
        guest
      });

      const ranking = await RankingSchema.findOne({
        name: new RegExp(`.*${eventBody.music.name.trim()}.*`, 'i'),
        music: new RegExp(`.*${eventBody.music.music.trim()}.*`, 'i')
      });

      if (!ranking) {
        await RankingSchema.create({
          name: eventBody.music.name.trim(),
          music: eventBody.music.music.trim(),
          total: 1
        });
      } else {
        await RankingSchema.findByIdAndUpdate(ranking._id, {
          $inc: {
            total: 1
          }
        });
      }
    }

    return getResponse(200, JSON.stringify({ message: 'Presença confirmada' }));
  } catch (error) {
    return getResponse(
      error.statusCode || 500,
      JSON.stringify({ message: error.message })
    );
  }
};

module.exports.delete = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();

    const { id } = event.pathParameters;

    if (!id) {
      throw new Error('Id nao informado');
    }

    await GuestsSchema.findByIdAndRemove(id);

    return getResponse(
      200,
      JSON.stringify({
        message: 'Convidado deletado'
      })
    );
  } catch (error) {
    console.log(error);
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

    let filter = {};
    const params = event.queryStringParameters;

    if (!params.name) {
      throw new Error('Prencha seu nome completo');
    }

    const name = params.name.replace(/['"]+/g, '');
    if (params) {
      filter.name = {
        $regex: name,
        $options: 'i'
      };
    }

    const guests = await GuestsSchema.find(filter);
    return getResponse(200, JSON.stringify(guests));
  } catch (error) {
    return getResponse(
      error.statusCode || 500,
      JSON.stringify({ message: error.message })
    );
  }
};

module.exports.listAll = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();

    let filter = {};
    const params = event.queryStringParameters || {};

    const options = {
      page: params.page ? parseInt(params.page) : 1,
      limit: params.limit ? parseInt(params.limit) : 10,
      sort: { name: 1 }
    };

    if (params.confirmed) {
      filter.confirmed = params.confirmed === 'yes' ? true : false;
    }
    if (params.name) {
      filter.name = {
        $regex: params.name,
        $options: 'i'
      };
    }

    const guests = await GuestsSchema.paginate(filter, options);

    return getResponse(200, JSON.stringify(guests));
  } catch (error) {
    return getResponse(
      error.statusCode || 500,
      JSON.stringify({ message: error.message })
    );
  }
};
