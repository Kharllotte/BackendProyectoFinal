import { Router } from "express";
import cartsManager from "../../dao/managers/mongodb/carts.js";
import { generateCodeToken } from "../../utils/index.js";
import TicketsManager from "../../dao/managers/mongodb/tickets.js";
import authMiddleware from "../../helpers/auth.js";

const carts = new cartsManager();
const tickets = new TicketsManager();

const cartsRouter = Router();

//Consultar todos los carritos
cartsRouter.get("/", async (req, res) => {
  try {
    const getAllCarts = await carts.get();
    return res.json({
      result: "success",
      payload: getAllCarts,
    });
  } catch (error) {
    console.log(error);
  }
});

cartsRouter.get(
  "/:cid",
  authMiddleware.isLoggedIn,
  authMiddleware.isUser,
  async (req, res) => {
    try {
      const cid = req.params.cid;
      const cart = await carts.getById(cid);
      return res.json({
        result: "success",
        payload: cart,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//Crear carrito con productos
cartsRouter.post(
  "/",
  authMiddleware.isLoggedIn,
  authMiddleware.isUser,
  async (req, res) => {
    try {
      const query = {
        products: [],
      };
      const result = await carts.save(query);
      return res.status(201).json({ result: "succes", payload: result });
    } catch (err) {
      console.log("no es posible acceder a la ruta");
      console.log(err);
    }
  }
);

// Agregar un producto en el carrito
cartsRouter.post(
  "/:cid/products/:pid",
  authMiddleware.isLoggedIn,
  authMiddleware.isUser,
  async (req, res) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;

      const result = await carts.saveProductInCart(cid, pid);

      if (result == "No stock") throw "No stock";

      return res.status(201).json({ result: "succes", payload: result });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ result: "false", payload: err });
    }
  }
);

// Actualizar la cantidad de productos en el carrito
cartsRouter.put(
  "/:cid/products/:pid",
  authMiddleware.isLoggedIn,
  authMiddleware.isUser,
  async (req, res) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const amount = req.body.amount;

      const cart = await carts.getById(cid);

      if (!cart) console.log("Cart not found");

      const result = await carts.updateAmountProductsInCart(cart, pid, amount);
      if (result == "No stock") throw "No stock";
      return res.status(201).json({ result: "s;ucces", payload: result });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ result: "false", payload: err });
    }
  }
);

// Borrar un producto especifico del carrito
cartsRouter.delete(
  "/:cid/products/:pid",
  authMiddleware.isLoggedIn,
  authMiddleware.isUser,
  async (req, res) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;

      const result = await carts.deleteProductInCart(cid, pid);
      return res.status(201).json({ result: "succes", payload: result });
    } catch (err) {
      console.log(err);
    }
  }
);

// Borrar un carrito
cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const result = await carts.delete(cid);
    return res.status(201).json({ result: "succes", payload: result });
  } catch (err) {
    console.log(err);
  }
});

// Vaciar un carrito
cartsRouter.delete("/:cid/empty", async (req, res) => {
  try {
    const cid = req.params.cid;
    const result = await carts.empty(cid);
    return res.status(201).json({ result: "succes", payload: result });
  } catch (err) {
    console.log(err);
  }
});

// Facturar
cartsRouter.post(
  "/:cid/purchase",
  authMiddleware.isLoggedIn,
  authMiddleware.isUser,
  async (req, res) => {
    try {
      const cid = req.params.cid;
      const cart = await carts.getById(cid);

      const productsNoStock = [];
      const productsNoStockCart = { products: [] };
      let amount = 0;

      if (!cart) {
        return res.json({
          result: "false",
          payload: cart,
          message: "Cart no found",
        });
      }

      const products = cart.products;
      for (const product of products) {
        if (product.productId.stock < product.amount) {
          productsNoStock.push(product.productId);
          productsNoStockCart.products.push({
            productId: product.productId._id,
            amount: product.amount,
          });
        } else {
          product.productId.stock -= product.amount;
          await product.productId.save();
          amount += product.productId.price * product.amount;
        }
      }

      if (amount < 1) {
        return res.json({
          result: "false",
          payload: null,
          productsNoStock,
          newCart: null,
        });
      }

      const newTicket = {
        code: await generateCode(),
        purcharseDataTime: new Date(),
        amount,
        purcharser: req.user.email,
        idCart: cid,
      };

      const tk = await tickets.save(newTicket);

      const newCart = await carts.save(productsNoStockCart);

      req.user.cart = newCart._id;
      await req.user.save();

      return res.json({
        result: "true",
        payload: tk,
        productsNoStock,
        newCart,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

const generateCode = async () => {
  const code = generateCodeToken();
  const tk = await tickets.getByCode(code);

  if (tk) generateCode();

  return code;
};

export default cartsRouter;
