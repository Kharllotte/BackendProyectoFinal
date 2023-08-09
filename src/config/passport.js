import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils/index.js";
import userModel from "../dao/models/mongodb/user.js";
import { Strategy as GitHubStrategy } from "passport-github2";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "signup",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        const { firstName, lastName, age } = req.body;
        try {
          const user = await userModel.findOne({ email });
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }

          const newUser = {
            firstName,
            lastName,
            email,
            age,
            password: createHash(password),
          };
          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (err) {
          return done("Internal server error " + err);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
          if (!user) {
            console.log("User no found");
            done(null, false);
          }
          if (!isValidPassword(user, password)) {
            console.log("Incorrect password");
            return done(null, false);
          }
          done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: "f2b4d13e9113a017b62b",
        clientSecret: "2bf1a21b76f4182422d6a5d70db2f0256fa8ea34",
        scope: ["user:email"],
        callbackURL: "/auth/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        let user = await userModel.findOne({ email });
        if(!user) {
          const newUser = {
            firstName: profile.displayName,
            lastName: '',
            email,
            age: -1,
            password: null,
          };
          user = await userModel.create(newUser);
        }
        
        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    const user = userModel.findById(_id);
    done(null, user);
  });
};

export const authorization = (rol) => {
  return (req, res, next) => {
    console.log("midelware", req.session.user.rol);
    if (req.isAuthenticated() && req.session.user.rol === rol) {
      return next();
    } else {
      return res.send("Acceso denegado");
    }
  };
};

export default initializePassport;
