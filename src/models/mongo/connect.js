// Import dependencies
import * as dotenv from "dotenv";
import Mongoose from "mongoose";

// Define function to connect to MongoDB database
export function connectMongo() {
  dotenv.config(); // Load environment variables from .env file

  // Connect to database and create connection object
  const db = Mongoose.connection;
  Mongoose.connect(process.env.db, {
    useNewUrlParser: true, // Use new URL parser
    useUnifiedTopology: true, // Use new server discovery and monitoring engine
  })
    .then(() => console.log("MongoDB connected")) // Log successful connection
    .catch(err => console.log(err)); // Log error if connection fails

  // Add event listeners to database connection object
  db.on("error", (err) => {
    console.log(`database connection error: ${err}`); // Log any database connection errors
  });

  db.on("disconnected", () => {
    console.log("database disconnected"); // Log when database is disconnected
  });

  db.once("open", function () {
    console.log(`database connected to ${this.name} on ${this.host}`); // Log when database connection is open
  });
}
