import mongoose from "mongoose";

const { Schema } = mongoose;

const favouritesSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  favouriteItems: [
    {
      name: { type: String, required: true },
      artist: { type: String, required: true },
      trackId: { type: mongoose.Schema.Types.ObjectId, required: true }
    }
  ]
});

const Favourites = mongoose.model("Favourites", favouritesSchema);

export default Favourites;

