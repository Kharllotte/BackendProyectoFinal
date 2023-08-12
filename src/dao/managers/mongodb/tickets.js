import { TicketModel } from "../../models/mongodb/ticket.js";

export default class TicketsManager {
  constructor() {}

  save = async (ticket) => {
    try {
      let result = await TicketModel.create(ticket);
      console.log("Ticket saved");
      return result;
    } catch (error) {
      console.log(error);
      console.log("Failed ticket saved");
    }
  };

  getById = async (id) => {
    try {
      const product = await TicketModel.findOne({ _id: id });
      console.log("Get Ticket");
      return product;
    } catch (err) {
      console.log("Failed get Ticket");
      console.log(err);
    }
  };

  getByCode = async (code) => {
    try {
      const product = await TicketModel.findOne({ code });
      console.log("Get Ticket");
      return product;
    } catch (err) {
      console.log("Failed get Ticket");
      console.log(err);
    }
  };
}
