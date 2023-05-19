const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./model/auth");
const Image = require("./model/image");
const multer = require("multer");
const verifiytoken = require("./middleware/verifyToken");
const bcrypt = require("bcrypt");
const verifytoken = require("./middleware/verifyToken");
const cors = require("cors");
require("dotenv").config();

//Routes
const app = express();
app.use(bodyParser.json());
// app.use(crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(
  cors({
    origin: "*",
  })
);

const upload = multer({
  storage: multer.diskStorage({
    destination: "./uploads",
  }),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
});

//Register Route
app.post("/register", upload.single("profileImage"), async (req, res) => {
  // Validate the request body
  const { username, password, profileImage } = req.body;
  if (!username || !password || !profileImage) {
    res.status(400).send("Invalid request body");
    return;
  }

  // Check if the username already exists
  const user = await User.findOne({ username });
  if (user) {
    res.status(400).send("Username already exists");
    return;
  }

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // Create a new user
  const newUser = new User({ username, password: passwordHash });
  newUser.profileImage = profileImage;
  await newUser.save();

  // Return the user object
  res.status(201).json(newUser);
});

// Login route
app.post("/login", async (req, res) => {
  // Validate the request body
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send("Invalid request body");
    return;
  }

  // Find the user by username
  const user = await User.findOne({ username });
  if (!user) {
    res.status(401).send("Invalid username or password");
    return;
  }

  // Compare the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });
  // Generate a JWT token
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
  // Return the token
  res.status(200).json({ token, user });
});

//Image routes

app.post("/images", verifytoken, upload.single("image"), async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  // Validate the request body
  const { name, image } = req.body;
  if (!name) {
    res.status(400).send("Invalid request body");
    return;
  }

  // Upload the image

  // Create a new image object
  const newImage = new Image({
    name,
    image,
    user: req.user.userId,
  });

  // Save the image
  await newImage.save();

  // Return the image object
  res.status(201).json(newImage);
});

// Get image route
app.get("/images/:userId", verifiytoken, async (req, res) => {
  // Find the image by id
  const images = await Image.find({ user: req.params.userId });

  // If no images are found for this user
  if (images.length === 0) {
    res.status(404).send("No images found for this user");
    return;
  }

  // Return the image object
  res.send(images);
});

const PORT = process.env.PORT || 6001;
mongoose
  .connect("mongodb://0.0.0.0:27017/ImageUploader")
  .then(() => {
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
  })
  .catch((error) => {
    console.log(`${error} did not connect`);
  });
