const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema( {
  firstName: {type: String},
  lastName: {type: String},
  userName: {type: String, unique: true}
})

// Virtual property for URL
UserSchema.virtual('url').get( function() {
  return `/data/user/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);