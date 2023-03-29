export const FavouritesStore = {

  // Retrieve all favourite items from the database
  async getAll() {
    const results = await Favourites.find().lean();
    return results;
  },

  // Retrieve the favourite item associated with a particular user ID
  async getByUserId(userId) {
    if (userId) {
      const result = await Favourites.findOne({ "userId": userId }).lean();
      return result;
    }
    return null;
  },

  // Add a new favourite item for the given user
  async addFavourite(userId, object) {
    const favourites = await Favourites.findOne({ "userId": userId });

    // If the user has no favourite items yet, create a new favourite object with the first item
    if (!favourites) {
      const newFavourites = new Favourites({ userId, favouriteItems: [object] });
      await newFavourites.save();
      return newFavourites;
    }

    // Add the new favourite item to the existing favourite object
    favourites.favouriteItems.push(object);
    await favourites.save();
    return favourites;
  },

  // Delete all favourite items from the database
  async deleteAll() {
    await Favourites.deleteMany({});
  },
}
