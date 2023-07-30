import mongoose from "mongoose";

const cartName = "carts";

const cartSchema = new mongoose.Schema({
  id: { type: String, require: true },
  products: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    ],
  },
});

export const cartModel = mongoose.model(cartName, cartSchema);
