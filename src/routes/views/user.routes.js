import { Router } from "express";
import authMiddleware from "../../helpers/auth.js";
import Users from "../../dao/managers/mongodb/users.js";

const userManager = new Users();
const usersRouterView = Router();

usersRouterView.get("/profile", authMiddleware.isLoggedIn, (req, res) => {
  const allDocuments = { id: false, address: false, accountStatus: false };

  const documents = req.user.documents;
  documents.forEach((doc, i) => {
    allDocuments[doc.category] = true;
  });

  return res.render("user-profile", {
    user: req.user,
    documents: allDocuments,
  });
});

usersRouterView.get(
  "/all",
  authMiddleware.isLoggedIn,
  authMiddleware.isAdmin,
  async (req, res) => {
    const getAllUsers = await userManager.getAll(req.user._id);
    const users = getAllUsers.map((user) => {
      const formattedDate = formatDate(user.lastConnection);
      return {
        ...user._doc,
        date: formattedDate,
        userPremium: user._doc.role == 'premium'
      };
    });

    return res.render("user-all", {
      user: req.user,
      users,
    });
  }
);

function formatDate(date) {
  const options = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return new Date(date).toLocaleDateString("es-ES", options);
}

export default usersRouterView;
