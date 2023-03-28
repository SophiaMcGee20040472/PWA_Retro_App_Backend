const mongoose = require("mongoose");

const favouritesSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  favourites: { type: [], required: true, default: [] },
});

module.exports = mongoose.model("Favourites", favouritesSchema);
