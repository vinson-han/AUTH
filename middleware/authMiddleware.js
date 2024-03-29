const bcrypt = require("bcrypt");
const prisma = require("../db/index");

const localStrategy = require("passport-local").Strategy;

function setupPassportLocal(passport) {
  passport.use(
    new localStrategy(
      { usernameField: "email", passwordField: "password" },
      async function (email, password, done) {
        try {
          // Find user by email
          const user = await prisma.user.findFirstOrThrow({
            where: {
              email: email,
            },
          });

          // Verify user and password
          if (!user || !(await bcrypt.compare(password, user.password))) {
            return done(false, null);
          }
          //Return the user to passport
          //First is an error, second is any user info
          return done(null, user);
        } catch (error) {
          console.error(`error`, error);
          return done(null, false, error);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    process.nextTick(function () {
      return done(null, {
        id: user.id,
        email: user.email,
      });
    });
  });

  passport.deserializeUser(function (user, done) {
    process.nextTick(function () {
      return done(null, user);
    });
  });
}

function checkIfAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/login");
  }
}

module.exports = { setupPassportLocal, checkIfAuthenticated };
