const connectToDatabase = require('../config/db');
const WishedMusicSchema = require('../wished-musics/models/wished-musics');

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
      artist: eventBody.artist,
      guest: eventBody.guest
    });
    return {
      statusCode: 200,
      body: { message: 'Sugestão gravada com sucesso, obrigado' }
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
    musics = await WishedMusicSchema.find({});
    return {
      statusCode: 200,
      body: JSON.stringify(musics)
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: error.message
    };
  }
};
