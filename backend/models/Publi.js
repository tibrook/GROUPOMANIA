const mongoose = require("mongoose");

/* Utilisation de la methode schema de mongoose */
const publiSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
    usersLiked: { type: Array, required: true },
    usersDisliked: { type: Array, required: true },
});

module.exports = mongoose.model("publi", publiSchema);