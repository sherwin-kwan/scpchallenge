const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PickSchema = new Schema( {
  name: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  event: {type: Schema.Types.ObjectId, ref: 'Event', required: true},
  winner: {type: Schema.Types.ObjectId, ref: 'Team', required: true},
  result: {type: Number},
  other_result: [{type: String}],
  player_result: {type: Schema.Types.ObjectId, ref: 'Player'},
  points: {type: Number},
  testID: {type: Number, unique: true}
})

// Virtual property for URL
PickSchema.virtual('url').get( () => {
  return `/data/pick/${this._id}`;
});

module.exports = mongoose.model('Pick', PickSchema);