import productManager from "../mongodb/products.js";
import { CartModel } from "../../models/mongodb/cart.js";
import { ProductModel } from "../../models/mongodb/products.js";

const products = new productManager();

export default class CartManagerM {
  constructor() {}

  save = async (cart) => {
    try {
      let result = await CartModel.create(cart);
      console.log("Cart saved");
      return result;
    } catch (error) {
      console.log(error);
      console.log("Failed card saved");
    }
  };

  saveProductInCart = async (cid, pid) => {
    try {
      const cart = await this.getById(cid);
      if (!cart) {
        console.log("no existe el carrito");
        return;
      }

      const product = await products.getById(pid);

      if (!product) {
        console.log("No existe el producto");
        return;
      }

      if (product.stock < 1) {
        return "No stock";
      }

      const query = {
        productId: product,
        amount: 1,
      };

      cart.products.push(query);

      return await cart.save();
    } catch (error) {
      console.log(error);
      console.log("Failed card saved");
    }
  };

  get = async () => {
    try {
      const carts = await CartModel.find().populate("products.productId");
      console.log("Get all success");
      return carts;
    } catch (err) {
      console.log("Get all success error");
      console.log(err);
    }
  };

  delete = async (id) => {
    try {
      const result = await CartModel.deleteOne({ _id: id });
      console.log("Cart deleted");
      return result;
    } catch (error) {
      console.log("Failed card delete");
      console.log(error);
    }
  };

  empty = async (id) => {
    try {
      const result = await this.getById(id);
      if (!result) {
        console.log("Cart not found");
        return;
      }

      result.products = [];
      return await result.save();
    } catch (error) {
      console.log("Failed card delete");
      console.log(error);
    }
  };

  deleteProductInCart = async (cid, pid) => {
    try {
      const result = await CartModel.findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { productId: pid } } },
        { new: true }
      ).populate("products.productId");
      console.log("Deleted product in cart success");
      return result;
    } catch (error) {
      console.log(error);
      console.log("Failed product remove in cart");
    }
  };

  getById = async (id) => {
    try {
      const cart = await CartModel.findOne({ _id: id })
        .populate({ path: "products.productId", match: { active: true } })
        .exec();

      cart.products = cart.products.filter(
        (product) => product.productId !== null
      );
      console.log("Get cart");
      return cart;
    } catch (err) {
      console.log("Failed get cart");
      console.log(err);
    }
  };

  updateAmountProductsInCart = async (cart, pid, amount) => {
    try {
      if (!amount > 0) {
        return this.deleteProductInCart(cart._id, pid);
      }

      const productIndex = cart.products.findIndex(
        (product) => product.productId._id.toString() == pid
      );

      if (productIndex === -1) {
        console.log("El producto no se encuentra en el carrito.");
        return null;
      }

      const stock = cart.products[productIndex].productId.stock;

      if (stock < amount) {
        return "No stock";
      }

      cart.products[productIndex].amount = amount;
      return cart.save();
    } catch (err) {
      //     throw new Error(err?.message);
      console.log(err);
      console.log("no es posible agregar el producto al carrito");
    }
  };

  updateCart = async (cid, pid, productUpdate) => {
    try {
      //    let {id} = req.params;
      //  let productUpdate = req.body;

      let result = await ProductModel.findByIdAndUpdate(
        { _id: cid, _id: pid },
        productUpdate
      );
      // res.send({status: "succes", payload: result})
      console.log("carrito actualizado con exito");
      return result;
    } catch (error) {
      console.log(error);
      console.log("erro al actualizar el carrito");
    }
  };
}
