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
