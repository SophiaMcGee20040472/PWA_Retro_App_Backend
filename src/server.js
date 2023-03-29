// Import necessary modules
import { fileURLToPath } from "url"; // Provides utility function to convert a file URL to a file path
import path from "path"; // Provides utilities for working with file and directory paths
import dotenv from "dotenv"; // Loads environment variables from a .env file
import Joi from "joi"; // Provides object schema validation
import jwt from "hapi-auth-jwt2"; // Provides JWT authentication strategy for Hapi
import HapiSwagger from "hapi-swagger"; // Generates Swagger documentation for Hapi
import Hapi from "@hapi/hapi"; // Main Hapi framework module
import Vision from "@hapi/vision"; // Provides templating support for Hapi
import Cookie from "@hapi/cookie"; // Provides cookie support for Hapi
import Inert from "@hapi/inert"; // Provides static file and directory handling for Hapi
import Bell from "@hapi/bell"; // Provides third-party authentication support for Hapi
import { connectMongo } from "./models/mongo/connect.js"; // Connects to a MongoDB database
import { apiRoutes } from "./api-routes.js"; // Defines API routes

// Get the file path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from a .env file
const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
}

// Options for generating Swagger documentation
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

// Define the Hapi server
async function init() {
  const server = Hapi.server({
    port: process.env.PORT || 4000, // Set the server's port, either from an environment variable or 4000
    routes: { cors: true }, // Enable CORS for all routes
  });

  // Register necessary plugins
  await server.register(Vision); // Templating support
  await server.register(Cookie); // Cookie support
  await server.register(Inert); // Static file and directory handling
  await server.register(Bell); // Third-party authentication
  await server.register(jwt); // JWT authentication
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]); // Swagger documentation generation
  server.validator(Joi); // Add object schema validation

  // Connect to MongoDB database
  connectMongo();

  // Define API routes
  server.route(apiRoutes);

  // Start the server
  await server.start();
  console.log("Server running on %s", server.info.uri);
}

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

// Initialize the server
init();
