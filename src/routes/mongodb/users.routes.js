import { Router } from "express";
import Users from "../../dao/managers/mongodb/users.js";
import multer from "multer";
import __dirname from "../../utils/index.js";
import logger from "../../utils/logger/index.js";
import path from "path";
import authMiddleware from "../../helpers/auth.js";
import transporter from "../../config/mailer.js";
const userManager = new Users();

const usersRouter = Router();

usersRouter.post("/premium/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await userManager.get(uid);

    if (!user) {
      return res.json({
        success: "false",
        payload: null,
        message: "User no found",
      });
    }
    const allDocuments = [false, false, false];
    const documents = user.documents;

    if (!documents) {
      return res.json({
        success: "false",
        payload: null,
        message: "User no upload all documents",
      });
    }

    documents.forEach((doc, i) => {
      allDocuments[i] = true;
    });

    if (!allDocuments.every((e) => e === true)) {
      return res.json({
        success: "false",
        payload: null,
        message: "User no upload all documents",
      });
    }

    const updateUserRole = await userManager.updateUserRolToggel(uid);

    return res.json({
      success: "true",
      payload: updateUserRole,
      message: "Update rol user",
    });
  } catch (error) {
    console.log(error);
    logger.error(error);
  }
});

usersRouter.get(
  "/",
  authMiddleware.isLoggedIn,
  authMiddleware.isAdmin,
  async (req, res) => {
    try {
      const user = await userManager.getAll(req.user._id);
      return res.json({
        success: "true",
        payload: user,
        message: "Get all users",
      });
    } catch (error) {
      console.log(error);
      logger.error(error);
    }
  }
);

usersRouter.delete(
  "/",
  authMiddleware.isLoggedIn,
  authMiddleware.isAdmin,
  async (req, res) => {
    try {
      const users = await userManager.getTwoDaysAgo(req.user._id);
      for (const user of users) {
        const mailOptions = {
          from: "lilikathe99@gmail.com",
          to: user.email,
          subject: "Cuenta eliminada por inactividad",
          html: "<p>Su cuenta ha sido eliminada por tener más de dos días de inactividad.</p>",
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          logger.info("Correo electrónico enviado:", info.response);
        } catch (error) {
          logger.error("Error al enviar el correo:", error);
        }
      }

      await userManager.deleteTwoDaysAgo(req.user._id);
      return res.json({
        success: "true",
        payload: users,
        message: "Delete users when last connection two days ago",
      });
    } catch (error) {
      console.log(error);
      logger.error(error);
    }
  }
);

const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const destinationFolder = path.join(
        __dirname,
        `/public/uploads/${folder}/`
      );
      cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
      const filename = `${req.user._id}-${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  });

const uploadMiddleware = (folder) => multer({ storage: storage(folder) });

// UID lo tiene req.user, no se va a usar como parametro.
usersRouter.post(
  "/upload/documents",
  authMiddleware.isLoggedIn,
  authMiddleware.isUser,
  async (req, res) => {
    try {
      const folder = "documents";
      const upload = uploadMiddleware(folder).fields([
        { name: "id", maxCount: 1 },
        { name: "address", maxCount: 1 },
        { name: "accountStatus", maxCount: 1 },
      ]);

      upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          console.log(err);
          return res.status(400).send("Error al subir el archivo");
        } else if (err) {
          console.log(err);
          return res.status(500).send("Error interno del servidor");
        }

        const userDocuments = req.user.documents;
        let documents = [];
        if (userDocuments) documents = userDocuments;

        for (const fieldName in req.files) {
          const file = req.files[fieldName][0];
          documents.push({
            category: file.fieldname,
            name: file.filename,
            reference: file.path,
          });
        }

        req.user.documents = documents;
        await req.user.save();

        return res.redirect("/user/profile");
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
