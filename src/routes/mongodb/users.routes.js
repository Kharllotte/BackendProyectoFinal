import { Router } from "express";
import Users from "../../dao/managers/mongodb/users.js";

const userManager = new Users();

const usersRouter = Router();

usersRouter.post("/premium/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = userManager.get(uid);

    if (!user) {
      return res.json({
        success: "false",
        payload: null,
        message: "User no found",
      });
    }

    const updateUserRole = await userManager.updateUserRolToggel(uid);

    return res.json({
      success: "true",
      payload: updateUserRole,
      message: "Update rol user",
    });
  } catch (error) {
    logger.error(error);
  }
});

export default usersRouter;
