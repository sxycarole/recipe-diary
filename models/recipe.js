var mongoose = require("mongoose");

var recipeSchema = new mongoose.Schema({
   recipe_id: Number,
   name: String,
   image: String,
   description: String,
   cost: Number,
   // location: String,
   // lat: Number,
   // lng: Number,
   createdAt: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Recipe", recipeSchema);