const mongoose = require('mongoose');
const GuestsSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  email: String,
  confirmed: { type: Boolean, default: false },
  date_confirmation: Date
});
mongoose.model('Guests', GuestsSchema);
module.exports = mongoose.model('Guests');

/* guests
name, email, confirmed, date_confirmation

wished-musics
name, artist, guest

wall-messages
author,  message */
