import { User } from "./user.js";

export const UserStore = {
  async getAll() {
    const results = await User.find().lean();
    return results;
  },

  async getByEmail(value) {
    if (value) {
      const result = await User.findOne({ email: value }).lean();
      return result;
    }
    return null;
  },

  async getById(value) {
    if (value) {
      const result = await User.findOne({ _id: value }).lean();
      return result;
    }
    return null;
  },

  async addUser(object) {
    const operation = new User(object);

    await operation.save();
    const newObject = await this.getByEmail(operation.email);
    console.log(newObject);
    return newObject;
  },

  async updateOne(updatedObject, objectId, store) {
    const Store = selectStore(store);
    await Store.updateOne({ _id: objectId }, updatedObject);
    const outcome = await this.getByProperty(objectId);
    return outcome;
  },

  async deleteAll() {
    await User.deleteMany({});
  },
  

  async addFavourite(userId, favouriteItemId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    user.favourites.push(favouriteItemId);
    await user.save();

    return user;
  },
};
