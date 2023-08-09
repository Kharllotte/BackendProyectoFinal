import { Router } from "express";
import passport from "passport";
import authMiddleware from "../../helpers/auth.js";

const authRouterView = Router();

const layout = "logout";

authRouterView.get("/login", authMiddleware.isNotLoggedIn, async (req, res) => {
  return res.render("login", {
    layout,
    isLogin: true,
  });
});

authRouterView.post(
  "/login",
  authMiddleware.isNotLoggedIn,
  passport.authenticate("login", {
    failureRedirect: "/auth/login",
    successRedirect: "/products",
  })
);

authRouterView.get(
  "/signup",
  authMiddleware.isNotLoggedIn,
  async (req, res) => {
    return res.render("signup", {
      layout,
      isLogin: false,
    });
  }
);

authRouterView.post(
  "/signup",
  authMiddleware.isNotLoggedIn,
  passport.authenticate("signup", {
    failureRedirect: "/auth/register",
    successRedirect: "/products",
  })
);

authRouterView.get("/logout", authMiddleware.isLoggedIn, (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
});

authRouterView.get("/github", passport.authenticate("github"));

authRouterView.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/login" }),
  (req, res) => {
    res.redirect("/products"); // Cambia esta URL según tus necesidades
  }
);

export default authRouterView;
