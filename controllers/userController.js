const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const getSignupPage = async (req, res) => {
  const signupPagePath = path.join(__dirname, "..", "views", "signup.html");
  res.sendFile(signupPagePath);
};

const signup = async (req, res) => {
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
};

const generateAccessToken = (id, name, ispremiumuser) => {
  return jwt.sign({ userId: id, name: name, ispremiumuser }, "secretkey");
};

const getLoginPage = async (req, res) => {
  const loginPagePath = path.join(__dirname, "..", "views", "login.html");
  res.sendFile(loginPagePath);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email exists
    const existingUser = await User.findOne({ where: { email } });
    console.log("login user name", existingUser.dataValues.id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // If both email and password are correct, send a success response
    res.status(200).json({
      message: "User logged in successfully",
      token: generateAccessToken(existingUser.dataValues.id),
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getSignupPage,
  signup,
  generateAccessToken,
  getLoginPage,
  login,
};
