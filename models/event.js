const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EventSchema = new Schema( {
  team1: {type: Schema.Types.ObjectId, ref: 'Team', required: true},
  team2: {type: Schema.Types.ObjectId, ref: 'Team', required: true},
  begins_at: {type: Date, required: true},
  next_game_number: {type: Number},
  next_game_begins_at: {type: Date},
  team1_result: {type: Number},
  team2_result: {type: Number},
  player_result: [{type: Schema.Types.ObjectId, ref: 'Player'}],
  other_result: [{type: String}], 
  points_available: {type: Number},
  tournament: {type: Schema.Types.ObjectId, ref: 'Tournament', required: true},
  testID: {type: Number, unique: true}
})

// Virtual property for URL
EventSchema.virtual('url').get( function() {
  return `/data/event/${this._id}`;
});

module.exports = mongoose.model('Event', EventSchema);