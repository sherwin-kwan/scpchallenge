const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const formats = require('./formats.js');

let EventSchema = new Schema( {
  team1: {type: Schema.Types.ObjectId, ref: 'Team', required: true},
  team2: {type: Schema.Types.ObjectId, ref: 'Team', required: true},
  begins_at: {type: Date},
  next_game_number: {type: Number},
  next_game_begins_at: {type: Date},
  team1_result: {type: Number},
  team2_result: {type: Number},
  player_result_name: {type: String}, // Use this to specify what "player_result" is used for e.g. Conn Smythe Trophy winner 
  player_result: [{type: Schema.Types.ObjectId, ref: 'Player'}],
  other_result: [{type: String}], 
  round: {type: Schema.Types.ObjectId, ref: 'Round', required: true},
  format: {type: String, required: true, enum: formats, default: 'BO7'},
  league: {type: Schema.Types.ObjectId, ref: 'League', required: true},
  season: {type: Number},
  testID: {type: Number}
})

// Virtual property for URL
EventSchema.virtual('url').get( function() {
  return `/data/event/${this._id}`;
});

module.exports = mongoose.model('Event', EventSchema);