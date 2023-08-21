import { createHash } from "../../../utils/index.js";
import logger from "../../../utils/logger/index.js";
import userModel from "../../models/mongodb/user.js";

export default class Users {
  constructor() {}

  save = async (obj) => {
    try {
      let result = await userModel.create(obj);
      logger.info("User saved");
      return result;
    } catch (err) {
      logger.error(err);
      logger.error("Failed saved user");
    }
  };

  updatePassword = async (uid, password) => {
    try {
      const user = await userModel.findById(uid);
      const newPassword = createHash(password);
      user.password = newPassword;
      user.save();
      logger.info("Password update");
      return user;
    } catch (error) {
      logger.error("Password update");
    }
  };

  get = async (id) => {
    try {
      const user = await userModel.findById(id);
      logger.info("Get user by id");
      return user;
    } catch (error) {
      logger.error("Get user by id");
      logger.error(error);
    }
  };

  getAll = async (uidAdmin) => {
    try {
      const users = await userModel
        .find({ _id: { $ne: uidAdmin } })
        .select("-password -__v -cart -documents");
      logger.info("Get all user");
      return users;
    } catch (error) {
      logger.error("Get all user");
      logger.error(error);
    }
  };

  deleteTwoDaysAgo = async (uidAdmin) => {
    try {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const users = await userModel.deleteMany({
        _id: { $ne: uidAdmin },
        lastConnection: { $lte: twoDaysAgo },
      });

      logger.info("Delete users when last connection two days ago");
      return users;
    } catch (error) {
      logger.error("Delete users when last connection two days ago");
      logger.error(error);
    }
  };

  getTwoDaysAgo = async (uidAdmin) => {
    try {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const users = await userModel.find({
        _id: { $ne: uidAdmin },
        lastConnection: { $lte: twoDaysAgo },
      });

      logger.info("Get all when last connection two days ago");
      return users;
    } catch (error) {
      logger.error("Get all when last connection two days ago");
      logger.error(error);
    }
  };

  findByEmail = async (email) => {
    try {
      const user = await userModel.findOne({ email });
      logger.info("Get user by email");
      return user;
    } catch (error) {
      logger.error("Get user by email");
      logger.error(error);
    }
  };

  updateUserRolToggel = async (uid) => {
    try {
      const user = await this.get(uid);
      let role = user.role == "user" ? "premium" : "user";
      user.role = role;
      await user.save();

      logger.info("Toggle user rol");

      return user;
    } catch (error) {
      logger.error("Toggle user rol");
      logger.error(error);
    }
  };

  update = async (uid, user) => {
    try {
      const result = await userModel.updateOne({ _id: uid }, user);
      logger.info("Update user success");
      return result;
    } catch (error) {
      logger.debug(err);
      logger.error("Error update user");
    }
  };
}
