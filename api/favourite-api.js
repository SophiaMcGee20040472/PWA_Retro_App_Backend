server.route({
  method: "POST",
  path: "/api/users/{userId}/favourites",
  handler: async (request, h) => {
    const { userId } = request.params;
    const { trackId } = request.payload;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        throw new Error("User not found");
      }
  
      user.favourites.push(trackId);
      await user.save();
  
      return h.response(user.favourites).code(200);
    } catch (error) {
      console.error(error);
      return h.response({ error: "Internal server error" }).code(500);
    }
  }
});
