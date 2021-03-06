const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PlayerSchema = new Schema( {
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  position: {type: String},
  jersey_number: {type: Number},
  team: {type: Schema.Types.ObjectId, ref: 'Team', required: true},
  league_id: {type: Number, unique: true},
})

// Virtual property for URL
PlayerSchema.virtual('url').get( function () {
  return `/data/player/${this._id}`;
});

module.exports = mongoose.model('Player', PlayerSchema);