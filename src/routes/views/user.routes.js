import { Router } from "express";
import authMiddleware from "../../helpers/auth.js";

const usersRouterView = Router();

usersRouterView.get("/profile", authMiddleware.isLoggedIn, (req, res) => {
  return res.render("user-profile", {
    user: req.user,
  });
});

export default usersRouterView;
