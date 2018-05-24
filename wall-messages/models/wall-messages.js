const mongoose = require('mongoose');
const WallMessagesSchema = new mongoose.Schema({
  author: String,
  message: String
});
mongoose.model('WallMessages', WallMessagesSchema);
module.exports = mongoose.model('WallMessages');
