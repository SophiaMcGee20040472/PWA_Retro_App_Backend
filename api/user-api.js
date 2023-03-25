import Boom from "@hapi/boom";
import bcrypt from "bcrypt";
import {UserStore} from "../src/models/mongo/user-store.js";

const saltRounds = 10;

export const userApi = {
  find: {
    auth: false,
    handler: async function(request, h) {
      try {
        const users = await UserStore.getAll();
        return users;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  findOne: {
    auth: false,
    handler: async function(request, h) {
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

  findOneByEmail: {
    auth: false,
    handler: async function(request, h) {
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
  findOneByFavourite: {
    auth: false,
    handler: async function(request, h) {
      try {
        const favourite = await UserStore.getByFavourite(request.payload.favourites);
        if (!favourite) {
          return Boom.notFound("No User with this favourite");
        }
        return favourite;
      } catch (err) {
        return Boom.serverUnavailable("No User with this email");
      }
    },
  },

  create: {
    auth: false,
    handler: async function(request, h) {
      try {
        const userDetails = request.payload;
        userDetails.password = await bcrypt.hash(userDetails.password, saltRounds);
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

  deleteAll: {
    auth: false,
    handler: async function(request, h) {
      try {
        await UserStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  authenticate: {
    auth: false,
    handler: async function(request, h) {
      try {
        const user = await UserStore.getByEmail(request.payload.email);
        if (user) {
          const passwordsMatch = await bcrypt.compare(request.payload.password, user.password);
          if (passwordsMatch) {
            return h.response({ success: true }).code(201);
          }
          return Boom.unauthorized("Invalid password");
        }
        return Boom.unauthorized("User not found");

      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },


};
