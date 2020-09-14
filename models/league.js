const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LeagueSchema = new Schema( {
  league: {type: String, required: true, unique: true},
  league_short: {type: String, maxLength: 10},
  sport: {type: String, required: true},
  tournament_name: {type: String},
  testID: {type: Number}
});

// Virtual property for URL
LeagueSchema.virtual('url').get( function() {
  return `/data/league/${this._id}`;
});

module.exports = mongoose.model('League', LeagueSchema);