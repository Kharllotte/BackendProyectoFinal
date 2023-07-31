import { Router } from "express";
import cartsManager from "../../dao/managers/mongodb/carts.js";

const carts = new cartsManager();

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

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid
    const cart = await carts.getById(cid);
    return res.json({
      result: "success",
      payload: cart,
    });
  } catch (error) {
    console.log(error);
  }
});

//Crear carrito con productos
cartsRouter.post("/", async (req, res) => {
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
});

// Agregar un producto en el carrito
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const result = await carts.saveProductInCart(cid, pid);
    return res.status(201).json({ result: "succes", payload: result });
  } catch (err) {
    console.log("no es posible acceder a la ruta");
    console.log(err);
  }
});

// Actualizar la cantidad de productos en el carrito
cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const amount = req.body.amount;

    const cart = await carts.getById(cid);

    if (!cart) console.log("Cart not found");

    const result = await carts.updateAmountProductsInCart(cart, pid, amount);
    return res.status(201).json({ result: "succes", payload: result });
  } catch (err) {
    console.log(err);
  }
});

// Borrar un producto especifico del carrito
cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const result = await carts.deleteProductInCart(cid, pid);
    return res.status(201).json({ result: "succes", payload: result });
  } catch (err) {
    console.log(err);
  }
});

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

// Borrar un carrito
cartsRouter.delete("/:cid/empty", async (req, res) => {
  try {
    const cid = req.params.cid;
    const result = await carts.empty(cid);
    return res.status(201).json({ result: "succes", payload: result });
  } catch (err) {
    console.log(err);
  }
});

export default cartsRouter;
