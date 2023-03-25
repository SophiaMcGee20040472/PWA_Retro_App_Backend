app.post("/api/users/:userId/favourites", async (req, res) => {
    const { userId } = req.params;
    const { trackId } = req.body;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        throw new Error("User not found");
      }
  
      user.favourites.push(trackId);
      await user.save();
  
      res.send(user.favourites);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Internal server error" });
    }
  });
  