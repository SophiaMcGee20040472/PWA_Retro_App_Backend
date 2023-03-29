// Importing required modules and classes
import Boom from "@hapi/boom";
import bcrypt from "bcrypt";
import { UserStore } from "../src/models/mongo/user-store.js";
import { User } from "../src/models/mongo/user.js";

// Define the number of salt rounds to use for password hashing
const saltRounds = 10;

// Define an object containing various API handlers for user-related routes
export const userApi = {

  // Handler to get all users
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const users = await UserStore.getAll();
        return users;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  // Handler to get a specific user by their ID
  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await UserStore.getById(request.params.id);
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable("No User with this id");
      }
    },
  },

  // Handler to get a specific user by their email address
  findOneByEmail: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await UserStore.getByEmail(request.payload.email);
        if (!user) {
          return Boom.notFound("No User with this email");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable("No User with this email");
      }
    },
  },

  // Handler to add a track to a user's favourites list
  addFavourite: {
    auth: false,
    async handler(request, h) {
      const { track, userId } = request.payload;
      console.log(request.payload, "USERID");

      try {
        // Find the user with the specified ID
        const user = await User.findById(userId);

        if (!user) {
          throw new Error("User not found");
        }

        // Add the track to the user's favourites list
        user.favourites.push(JSON.stringify(track));
        await user.save();

        // Return a success response
        return h.response(track).code(200);
      } catch (error) {
        console.error(error);
        return h.response({ error: "Internal server error" }).code(500);
      }
    },
  },

  // Handler to create a new user
  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        // Hash the user's password using bcrypt
        const userDetails = request.payload;
        userDetails.password = await bcrypt.hash(userDetails.password, saltRounds);

        // Add the new user to the database
        const user = await UserStore.addUser(userDetails);

        if (user) {
          return h.response(user).code(201);
        }
        return Boom.badImplementation("error creating user");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  // Handler to delete all users
  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await UserStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  // Handler to remove a track from a user's favourites list
  deleteFavourite: {
    auth: false, // This endpoint does not require authentication
    async handler(request, h) { // The handler function for this endpoint is an asynchronous function
      try {
        const { trackId, userId } = request.payload; // Extracting the trackId and userId from the request payload
        const user = await User.findById(userId); // Finding the user by their userId
  
        if (!user) { // If the user is not found, return an error
          return Boom.notFound("User not found");
        }
  
        const favourites = user.favourites.map((favourite) => JSON.parse(favourite)); // Parsing the favourites from JSON to an array
        const keepTheseFavourites = favourites.filter((favourite) => favourite.key !== trackId); // Filtering out the track to be removed
        const stringifyFavourites = keepTheseFavourites.map((favourite) => JSON.stringify(favourite)); // Stringifying the favourites array
  
        console.log("favourites", stringifyFavourites); // Logging the remaining favourites to the console
  
        user.favourites = stringifyFavourites; // Updating the user's favourites list
        await user.save(); // Saving the user's changes to the database
  
        return h.response({ message: "Favourite removed successfully" }).code(200); // Returning a success message
      } catch (err) { // Catching any errors that may occur
        console.error(err); // Logging the error to the console
        return Boom.serverUnavailable("Internal server error"); // Returning an error message
      }
    },
  },

// This code authenticates a user's login credentials
authenticate: {
  auth: false, // This endpoint does not require authentication
  handler: async function (request, h) { // The handler function for this endpoint is an asynchronous function
    try {
      const user = await UserStore.getByEmail(request.payload.email); // Finding the user by their email address

      if (user) { // If the user is found
        const passwordsMatch = await bcrypt.compare(request.payload.password, user.password); // Checking if the password matches the hashed password in the database

        if (!passwordsMatch) { // If the passwords do not match, return an error
          return Boom.unauthorized("Invalid password");
        }
          return h.response({ success: true, user: user }).code(201);
        }
        return Boom.unauthorized("User not found");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
};
