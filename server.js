const dotenv = require("dotenv");
const morgan = require("morgan");
const express = require("express");
const staticRoutes = require("./routes/static");
const postsRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");

const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const { setupPassportLocal } = require("./middleware/authMiddleware");
const app = express();
dotenv.config(); //require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "testing", //The secret key should not be put into the code itself but just use an env variable
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Adjust this based on your deployment environment
  })
);
app.use(passport.initialize());
setupPassportLocal(passport);
app.use(passport.session());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
}

app.use("/", staticRoutes);
app.use("/auth", authRoutes(passport));
app.use("/posts", postsRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is Live ${process.env.PORT}`);
});
