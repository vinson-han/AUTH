const express = require("express");
const prisma = require("../db/index.js");
const { checkIfAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.get("/signup", async (req, res) => {
  res.render("signup");
});

router.get("/create-post", async (req, res) => {
  res.render("createpost");
});

router.get("/dashboard", checkIfAuthenticated, async (req, res) => {
  const userId = req.user.id;
  try {
    // Fetch user's posts from the database
    const userPosts = await prisma.post.findMany({
      where: {
        userId: userId,
      },
    });

    // Render the 'dashboard.ejs' file with userPosts data
    res.render("dashboard", { userPosts, error: false });
  } catch (error) {
    console.error(error);
    // Instead of just sending an error for the browser to handle,
    // we would display the dashboard page with an error message
    res.render("dashboard", { userPosts: null, error: true });
  }
});

module.exports = router;
