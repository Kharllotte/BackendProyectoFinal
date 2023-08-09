import { Router } from "express";
import productManager from "../../dao/managers/mongodb/products.js";

import authMiddleware from '../../helpers/auth.js'

const product = new productManager();

const productsRouterView = Router();

/**
 * Metodo para obtener los productos con filtros opcionales de:
 * page, limit, category, title (q), price y sort.
 */
productsRouterView.get("/", authMiddleware.isLoggedIn, async (req, res) => {
  try {
    const products = await product.getAllOutFilter();
    return res.render("products", {
      products,
    });
  } catch (error) {
    console.log(error);
  }
});

productsRouterView.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const getProduct = await product.getById(id);
    return res.render("product", {
      product: getProduct,
    });
  } catch (error) {
    console.log(error);
  }
});

export default productsRouterView;
