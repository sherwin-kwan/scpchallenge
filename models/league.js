const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LeagueSchema = new Schema( {
  league: {type: String, required: true},
  league_short: {type: String, maxLength: 10},
  sport: {type: String, required: true},
  testID: {type: Number, unique: true}
});

// Virtual property for URL
LeagueSchema.virtual('url').get( () => {
  return `/data/league/${this._id}`;
});

module.exports = mongoose.model('League', LeagueSchema);