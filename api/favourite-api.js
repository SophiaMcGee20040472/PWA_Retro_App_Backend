server.route({
  method: "POST", // This route handles HTTP POST requests
  path: "/api/users/{userId}/favourites", // The route path includes a dynamic userId parameter
  handler: async (request, h) => {
    const { userId } = request.params; // Extracts the userId from the request parameters
    const { trackId } = request.payload; // Extracts the trackId from the request payload
  
    try {
      const user = await User.findById(userId); // Find the user with the specified userId in the database
  
      if (!user) { // If no user was found, throw an error
        throw new Error("User not found");
      }
  
      user.favourites.push(trackId); // Add the trackId to the user's favourites list
      await user.save(); // Save the updated user object in the database
  
      return h.response(user.favourites).code(200); // Send the user's favourites list as the response with a 200 status code
    } catch (error) {
      console.error(error); // Log the error to the console
      return h.response({ error: "Internal server error" }).code(500); // Send an error response with a 500 status code
    }
  }
});
