export const FavouritesStore = {
  async getAll() {
    const results = await Favourites.find().lean();
    return results;
  },

  async getByUserId(userId) {
    if (userId) {
      const result = await Favourites.findOne({ "userId": userId }).lean();
      return result;
    }
    return null;
  },

  async addFavourite(userId, object) {
    const favourites = await Favourites.findOne({ "userId": userId });
    if (!favourites) {
      const newFavourites = new Favourites({ userId, favouriteItems: [object] });
      await newFavourites.save();
      return newFavourites;
    }

    favourites.favouriteItems.push(object);
    await favourites.save();
    return favourites;
  },

  async deleteAll() {
    await Favourites.deleteMany({});
  },
}
