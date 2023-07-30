import mongoose from "mongoose";

const productCollectionName = "products";

const productSchema = new mongoose.Schema({
  id: { type: String, require: true },
  title: { type: String, require: true },
  description: { type: String, require: true },
  price: { type: Number, require: true },
  code: { type: Number, require: true },
  stock: { type: Number, require: true },
});
export const ProductModel = mongoose.model(
  productCollectionName,
  productSchema
);
export default { productSchema };
