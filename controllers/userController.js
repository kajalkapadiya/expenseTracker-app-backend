const User = require("../models/user");

const userController = {
  signup: async function (req, res) {
    const { name, email, password } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create new user
      const newUser = await User.create({ name, email, password });
      res
        .status(201)
        .json({ message: "User created successfully", userId: newUser.id });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = userController;
