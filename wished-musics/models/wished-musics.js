const mongoose = require('mongoose');
const WishedMusicsSchema = new mongoose.Schema({
  name: String,
  artist: String,
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'guest' }
});
mongoose.model('WishedMusics', WishedMusicsSchema);
module.exports = mongoose.model('WishedMusics');
