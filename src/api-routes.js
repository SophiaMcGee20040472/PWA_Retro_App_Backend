// Import the userApi from the user-api.js file
import { userApi } from "../api/user-api.js";

// Define an array of API routes, each with a method, path, and associated userApi configuration
export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find }, // GET all users
  { method: "POST", path: "/api/users", config: userApi.create }, // POST a new user
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll }, // DELETE all users
  { method: "POST", path: "/api/users/remove-from-favourites", config: userApi.deleteFavourite }, // POST to remove a favourite
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne }, // GET a single user by id
  { method: "POST", path: "/api/users/add-to-favourites", config: userApi.addFavourite }, // POST to add a favourite
  { method: "POST", path: "/api/users/find", config: userApi.findOneByEmail }, // POST to find a user by email
  { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate }, // POST to authenticate a user
];