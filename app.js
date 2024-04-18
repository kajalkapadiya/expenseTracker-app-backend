const express = require("express");
const bodyParser = require("body-parser");
const User = require("./models/user");
require("./models/index");
const userData = require("./models/user");
const bcrypt = require("bcrypt");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static("views")); // Serve static files from the "public" directory

User.sync({ force: true });

app.get("/", async (req, res) => {
  const items = await userData.findAll();
  res.sendFile(__dirname + "/views/signup.html");
});

// Route for user signup
// app.post("/signup", async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     // Check if the user already exists
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     // Create new user
//     const newUser = await User.create({ name, email, password });
//     res
//       .status(201)
//       .json({ message: "User created successfully", userId: newUser.id });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser.id });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to serve the login page
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

// Route for user login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email exists
    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // If both email and password are correct, send a success response
    res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
