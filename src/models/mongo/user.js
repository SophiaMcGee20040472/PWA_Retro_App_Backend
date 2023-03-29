// Import dependencies
import Mongoose from "mongoose";
import Boom from "@hapi/boom";

// Create a new Mongoose schema for a user
const { Schema } = Mongoose;
const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  favourites: [],
});

// Add a static method to the user schema for finding a user by email address
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email });
};

// Add a method to the user schema for comparing passwords
userSchema.methods.comparePassword = function (candidatePassword) {
  const isMatch = this.password === candidatePassword;
  
  // If the passwords don't match, throw an unauthorized error using the Boom library
  if (!isMatch) {
    throw Boom.unauthorized("Password mismatch");
  }
  
  // If the passwords match, return the user object
  return this;
};

// Create a new Mongoose model for the user schema
export const User = Mongoose.model("User", userSchema);
