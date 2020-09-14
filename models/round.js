const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RoundSchema = new Schema( {
  league: {type: Schema.Types.ObjectId, ref: 'League', required: true},
  name: {type: String, unique: true},
  points_available: {type: Number}
})

// Virtual property for URL

RoundSchema.virtual('url').get( function () {
  return `/data/round/${this._id}`;
})

module.exports = mongoose.model('Round', RoundSchema);