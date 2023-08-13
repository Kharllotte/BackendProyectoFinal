import { messageModel } from "../../models/mongodb/messages.js";

export default class Messages {
  constructor() {}

  save = async (obj) => {
    try {
      let result = await messageModel.create(obj);
      console.log("Message saved");
      return result;
    } catch (err) {
      console.log(err);
      console.log("Failed saved message");
    }
  };

  getAll = async () => {
    const result = await messageModel.find().populate('user');
    console.log("Messages get all successfull");
    return result;
  };
}
