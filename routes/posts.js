const express = require("express");
const prisma = require("../db/index");
const { checkIfAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:postId", async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.postId,
      },
    });

    const newPost = {
      title: post.title,
      content: post.content,
    };

    res.render("post", { post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/create-post", checkIfAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  const id = req.user.id;
  console.log(id);

  try {
    const post = await prisma.post.create({
      data: {
        userId: id,
        title: title,
        content: content,
      },
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/");

module.exports = router;
