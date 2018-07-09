const mongoose = require('mongoose');
const RankingSchema = new mongoose.Schema({
  name: String,
  music: String,
  total: Number
});

const mongoosePaginate = require('mongoose-paginate');
RankingSchema.plugin(mongoosePaginate);

mongoose.model('Ranking', RankingSchema);
module.exports = mongoose.model('Ranking');
