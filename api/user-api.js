import Boom from "@hapi/boom";
import bcrypt from "bcrypt";
import { UserStore } from "../src/models/mongo/user-store.js";
import { User } from "../src/models/mongo/user.js";

const saltRounds = 10;

export const userApi = {
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
  addFavourite: {
    auth: false,
    async handler(request, h) {
      const { track, userId } = request.payload;
      console.log(request.payload, "USERID");
      try {
        const user = await User.findById(userId);

        if (!user) {
          throw new Error("User not found");
        }

        user.favourites.push(JSON.stringify(track));
        await user.save();

        return h.response(track).code(200);
      } catch (error) {
        console.error(error);
        return h.response({ error: "Internal server error" }).code(500);
      }
    },
  },

  create: {
    auth: false,
    handler: async function (request, h) {
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
    handler: async function (request, h) {
      try {
        await UserStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  deleteFavourite: {
    auth: false,
    async handler(request, h) {
      try {
        const { trackId, userId } = request.payload;
        const user = await User.findById(userId);
        if (!user) {
          return Boom.notFound("User not found");
        }

        const favourites = user.favourites.map((favourite) => JSON.parse(favourite));
        const keepTheseFavourites = favourites.filter((favourite) => favourite.key !== trackId);
        const stringifyFavourites = keepTheseFavourites.map((favourite) => JSON.stringify(favourite));
        console.log("favourites", stringifyFavourites);

        user.favourites = stringifyFavourites;
        await user.save();

        return h.response({ message: "Favourite removed successfully" }).code(200);
      } catch (err) {
        console.error(err);
        return Boom.serverUnavailable("Internal server error");
      }
    },
  },

  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await UserStore.getByEmail(request.payload.email);
        if (user) {
          const passwordsMatch = await bcrypt.compare(request.payload.password, user.password);
          if (!passwordsMatch) {
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
