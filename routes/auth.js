const express = require("express");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const prisma = require("../db/index");
const passport = require("passport");

const { loginAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userId = uuidv4().replace(/-/g, "").slice(0, 24);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        id: userId,
        email: email,
        password: hashedPassword,
      },
    });

    req.login(user, function (err) {
      if (err) return err;
      return res.redirect("/dashboard");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Service Error" });
  }
});

router.post(
  "/login",
  loginAuth(), // passport.authenticate("local", {
  //   successRedirect: "/dashboard",
  //   failureRedirect: "/login",
  // }),
  async (req, res) => {
    res.redirect("/");
  }
);
// for the user to logout.
// req.logout will destroy the session that passport created
router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function (err) {
      res.redirect("/login");
    });
  });
});

module.exports = router;
