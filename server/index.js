const express = require("express");
const router = express.Router();

// Home page data
router.get("/home", async (req, res) => {
  try {
    res.status(200).json({
      title: "Hi, I am Chetan Pawar",
      subtitle: "Full Stack Developer",
      description: "Welcome to my portfolio website.",
      image: "/assets/profile.jpg"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Contact page data
router.get("/contact", async (req, res) => {
  try {
    res.status(200).json({
      email: "your@email.com",
      phone: "+91XXXXXXXXXX",
      location: "Gujarat, India"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;