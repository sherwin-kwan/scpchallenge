const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TeamSchema = new Schema( {
  city: {type: String, required: true, maxLength: 64},
  teamName: {type: String, maxLength: 64},
  league: {type: Schema.Types.ObjectId, ref: 'League', required: true},
  conference: {type: String},
  division: {type: String},
  league_id: {type: Number},
})

// Virtual property for URL
TeamSchema.virtual('url').get( function() {
  return `/data/team/${this._id}`;
});

module.exports = mongoose.model('Team', TeamSchema);