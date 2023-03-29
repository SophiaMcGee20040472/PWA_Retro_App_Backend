// Import Mongoose dependency
const mongoose = require("mongoose");

// Create a new Mongoose schema for a favourites object
const favouritesSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Define a required userId field with a string data type
  favourites: { type: [], required: true, default: [] }, // Define a required favourites field with an array data type and an empty default value
});

// Create a new Mongoose model for the favourites schema and export it
module.exports = mongoose.model("Favourites", favouritesSchema);
