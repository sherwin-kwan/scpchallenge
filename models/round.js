const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RoundSchema = new Schema( {
  league: {type: Schema.Types.ObjectId, ref: 'League', required: true},
  order: {type: Number, required: true},
  name: {type: String, unique: true},
  points_available: {type: Number},
  special: {type: Boolean} // Signifies whether there is an additional score for picking this round correctly (e.g. the MVP in a finals round)
})

module.exports = mongoose.model('Round', RoundSchema);