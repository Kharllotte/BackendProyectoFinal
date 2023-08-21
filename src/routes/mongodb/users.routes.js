import { Router } from "express";
import Users from "../../dao/managers/mongodb/users.js";
import multer from "multer";
import __dirname from "../../utils/index.js";
import logger from "../../utils/logger/index.js";
import path from 'path';

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

const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const destinationFolder = `uploads/${folder}`;
      console.log(destinationFolder);
      cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
      const filename = file.originalname;
      cb(null, filename);
    },
  });

const uploadMiddleware = (folder) => multer({ storage: storage(folder) });

// UID lo tiene req.user, no se va a usar como parametro.
usersRouter.post(
  "/upload/documents",
  uploadMiddleware("documents").fields([
    { name: "id", maxCount: 1 },
    { name: "address", maxCount: 1 },
    { name: "accountStatus", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files;

      const filesUser = {
        documents: files.map((file) => ({
          category: "algo",
          name: file.originalname,
          reference: file.path,
        })),
      };


      return;

      const updateUser = userManager.update(req.user._id, filesUser);
      return res.send({
        status: "success",
        payload: updateUser,
      });
    } catch (error) {
      console.log(error);
      logger.error("Error update files");
      logger.debug(error);
      return res
        .status(500)
        .send({ status: "error", message: "Error update files" });
    }
  }
);

export default usersRouter;
