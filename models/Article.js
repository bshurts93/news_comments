var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  image: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true,
    unique: true
  },
  content: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  timestamp: {
    type: String,
    trim: true
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the User model
module.exports = Article;
