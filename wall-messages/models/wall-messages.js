const mongoose = require('mongoose');
const WallMessagesSchema = new mongoose.Schema({
  author: String,
  message: String
});

const mongoosePaginate = require('mongoose-paginate');
WallMessagesSchema.plugin(mongoosePaginate);

mongoose.model('WallMessages', WallMessagesSchema);
module.exports = mongoose.model('WallMessages');
