var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  user: {
    type: String,
    trim: true
  },
  text: {
    type: String,
    trim: true
  }
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the User model
module.exports = Comment;
