import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import Joi from "joi";
import jwt from "hapi-auth-jwt2";
import HapiSwagger from "hapi-swagger";
import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Cookie from "@hapi/cookie";
import Inert from "@hapi/inert";
import Bell from "@hapi/bell";
import { connectMongo } from "./models/mongo/connect.js";
import { apiRoutes } from "./api-routes.js";
import { User } from "./models/mongo/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
}

const swaggerOptions = {
  info: {
    title: "Retro API",
    version: "0.1",
  },
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  security: [{ jwt: [] }],
};


async function init() {
  const server = Hapi.server({
    port: process.env.PORT || 4000,
    routes: { cors: true },
    
  });

  await server.register(Vision);
  await server.register(Cookie);
  await server.register(Inert);
  await server.register(Bell);
  await server.register(jwt);
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  server.validator(Joi);

  connectMongo();
  server.route(apiRoutes);
  
  // server.route({
  //   method: "POST",
  //   path: "/api/users/{userId}/favourites",
  //   handler: async (request, h) => {
  //     const { userId } = request.params;
  //     const { trackId } = request.payload;
    
  //     try {
  //       const user = await User.findById(userId);
    
  //       if (!user) {
  //         throw new Error("User not found");
  //       }
    
  //       user.favourites.push(trackId);
  //       await user.save();
    
  //       return h.response(user.favourites).code(200);
  //     } catch (error) {
  //       console.error(error);
  //       return h.response({ error: "Internal server error" }).code(500);
  //     }
  //   }
  // });

  // server.route({
  //   method: 'DELETE',
  //   path: '/favourites/{id}',
  //   options: {
  //     validate: {
  //       params: Joi.object({
  //         id: Joi.string().required(),
  //       }),
  //     },
  //   },
  //   handler: async (request, h) => {
  //     try {
  //       const { id } = request.params;

  //       const result = await server.methods.db.collection('favourites').findOneAndDelete({ _id: ObjectId(id) });
        
  //       if (!result.value) {
  //         return h.response({ message: 'Favourite not found' }).code(404);
  //       }
  
  //       return h.response({ message: 'Favourite deleted successfully' }).code(200);
  //     } catch (error) {
  //       console.log(error);
  //       return h.response({ message: 'Internal Server Error' }).code(500);
  //     }
  //   },
  // });

  await server.start();
  console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
