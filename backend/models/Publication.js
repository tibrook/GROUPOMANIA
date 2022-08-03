const mongoose = require("mongoose");

/* Utilisation de la methode schema de mongoose */
const publiSchema = mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: false },
  imageUrl: { type: String, required: false },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: Array, required: true },
  usersDisliked: { type: Array, required: true },
  createdAt: { type: Date, required: true },
});

module.exports = mongoose.model("publi", publiSchema);
