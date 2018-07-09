const connectToDatabase = require('../config/db');
const WallMessageSchema = require('../wall-messages/models/wall-messages');
const getResponse = require('../services/response');
module.exports.create = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();

    const eventBody = JSON.parse(event.body);
    if (!eventBody.author && !eventBody.message) {
      throw new Error('Dados não preencidos');
    }
    message = await WallMessageSchema.create({
      author: eventBody.author,
      message: eventBody.message
    });

    return getResponse(
      200,
      JSON.stringify({
        message: 'Mensagem gravada com sucesso, obrigado'
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

module.exports.update = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();

    const { id } = event.pathParameters;

    if (!id) {
      throw new Error('Id nao informado');
    }

    const eventBody = JSON.parse(event.body);
    const guest = await WallMessageSchema.findByIdAndUpdate(id, {
      $set: {
        author: eventBody.author,
        message: eventBody.message
      }
    });

    return getResponse(
      200,
      JSON.stringify({
        message: 'Mensagem atualizada, obrigado'
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

module.exports.delete = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();

    const { id } = event.pathParameters;

    if (!id) {
      throw new Error('Id nao informado');
    }

    await WallMessageSchema.findByIdAndRemove(id);

    return getResponse(
      200,
      JSON.stringify({
        message: 'Mensagem deletada, obrigado'
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
    messages = await WallMessageSchema.find({});
    return getResponse(200, JSON.stringify(messages));
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: error.message
    };
  }
};

module.exports.get = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();

    const { id } = event.pathParameters;
    if (!id) {
      throw new Error('Id nao informado');
    }

    const messages = await WallMessageSchema.findById(id);
    return getResponse(200, JSON.stringify(messages));
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: error.message
    };
  }
};

module.exports.listAll = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();

    const filter = {};
    const params = event.queryStringParameters || {};
    const options = {
      page: params.page ? parseInt(params.page) : 1,
      limit: params.limit ? parseInt(params.limit) : 10,
      sort: { total: -1 },
      lean: true
    };

    if (params.author) {
      filter.author = {
        $regex: params.author,
        $options: 'i'
      };
    }
    const messages = await WallMessageSchema.paginate(filter, options);
    return getResponse(200, JSON.stringify(messages));
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: error.message
    };
  }
};
