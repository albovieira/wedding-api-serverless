const mongoose = require('mongoose');
const RankingSchema = new mongoose.Schema({
  name: String,
  music: String,
  total: Number
});
mongoose.model('Ranking', RankingSchema);
module.exports = mongoose.model('Ranking');
