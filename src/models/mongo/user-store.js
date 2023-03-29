import { User } from "./user.js";

// Define an object that contains methods for interacting with User objects in the database
export const UserStore = {
  // Method to retrieve all User objects
  async getAll() {
    // Use the find() method of the User model to retrieve all documents
    const results = await User.find().lean();
    // Return the results as an array of plain JavaScript objects
    return results;
  },

  // Method to retrieve a single User object by email
  async getByEmail(value) {
    // Check if a value was passed in
    if (value) {
      // Use the findOne() method of the User model to retrieve the document with the specified email
      const result = await User.findOne({ email: value }).lean();
      // Return the result as a plain JavaScript object
      return result;
    }
    // If no value was passed in, return null
    return null;
  },

  // Method to retrieve a single User object by ID
  async getById(value) {
    // Check if a value was passed in
    if (value) {
      // Use the findOne() method of the User model to retrieve the document with the specified ID
      const result = await User.findOne({ _id: value }).lean();
      // Return the result as a plain JavaScript object
      return result;
    }
    // If no value was passed in, return null
    return null;
  },

  // Method to add a new User object to the database
  async addUser(object) {
    // Create a new instance of the User model with the specified object
    const operation = new User(object);
    // Save the new document to the database
    await operation.save();
    // Retrieve the newly created document from the database
    const newObject = await this.getByEmail(operation.email);
    // Log the new object to the console
    console.log(newObject);
    // Return the new object
    return newObject;
  },

  // Method to update a single User object by ID
  async updateOne(updatedObject, objectId, store) {
    // Determine which store to use based on the specified value
    const Store = selectStore(store);
    // Use the updateOne() method of the User model to update the document with the specified ID
    await Store.updateOne({ _id: objectId }, updatedObject);
    // Retrieve the updated document from the database
    const outcome = await this.getByProperty(objectId);
    // Return the outcome
    return outcome;
  },

  // Method to delete all User objects from the database
  async deleteAll() {
    // Use the deleteMany() method of the User model to delete all documents
    await User.deleteMany({});
  },
  
  // Method to add an item to a User's favourites array
  async addFavourite(userId, favouriteItemId) {
    // Find the User with the specified ID
    const user = await User.findById(userId);
    // If no User is found, throw an error
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    // Add the specified item ID to the User's favourites array
    user.favourites.push(favouriteItemId);
    // Save the updated User document to the database
    await user.save();
    // Return the updated User document
    return user;
  },
};
