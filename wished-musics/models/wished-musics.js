const mongoose = require('mongoose');
const WishedMusicsSchema = new mongoose.Schema({
  name: String,
  link: String,
  music: String,
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'guest'
  }
});

const mongoosePaginate = require('mongoose-paginate');
WishedMusicsSchema.plugin(mongoosePaginate);

mongoose.model('WishedMusics', WishedMusicsSchema);
module.exports = mongoose.model('WishedMusics');