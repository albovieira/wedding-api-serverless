const connectToDatabase = require('../config/db');
const WallMessageSchema = require('../wall-messages/models/wall-messages');

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
    return {
      statusCode: 200,
      body: { message: 'Mensagem gravada com sucesso, obrigado' }
    };
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
    return {
      statusCode: 200,
      body: JSON.stringify(messages)
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: error.message
    };
  }
};
