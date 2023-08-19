import { Router } from "express";
import productManager from "../../dao/managers/mongodb/products.js";

import authMiddleware from "../../helpers/auth.js";

const product = new productManager();

const productsRouterView = Router();

/**
 * Metodo para obtener los productos con filtros opcionales de:
 * page, limit, category, title (q), price y sort.
 */

productsRouterView.get("/", authMiddleware.isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const allProducts = await product.getAllOutFilter();
    const products = allProducts.map((p) => {
      return {
        _id: p._id,
        id: p.id,
        title: p.title,
        description: p.description,
        category: p.category,
        price: p.price,
        code: p.code,
        stock: p.stock,
        active: p.active,
        owner: p.owner,
        self: p.owner == user.email,
      };
    });

    return res.render("products", {
      products,
    });
  } catch (error) {
    logger.error(error);
  }
});

productsRouterView.get("/:id", authMiddleware.isLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;
    const getProduct = await product.getById(id);
    return res.render("product", {
      product: getProduct,
    });
  } catch (error) {
    logger.error(error);
  }
});

productsRouterView.post(
  "/add",
  authMiddleware.isLoggedIn,
  authMiddleware.isAdminOrPremium,
  async (req, res) => {
    try {
      const user = req.user;
      const payload = req.body;
      await product.add(payload, user);
      return res.redirect("/products");
    } catch (error) {
      logger.error(error);
    }
  }
);

productsRouterView.post(
  "/update",
  authMiddleware.isLoggedIn,
  authMiddleware.isAdmin,
  async (req, res) => {
    try {
      const payload = req.body;
      await product.update(payload);
      return res.redirect("/products");
    } catch (error) {
      logger.error(error);
    }
  }
);

productsRouterView.post(
  "/inactive/:id",
  authMiddleware.isLoggedIn,
  authMiddleware.isAdmin,
  async (req, res) => {
    try {
      const id = req.params.id;
      const getProduct = await product.getById(id);
      if (!getProduct) throw "Product not found";

      getProduct.active = false;
      await getProduct.save();

      return res.json({
        success: true,
        payload: getProduct,
      });
    } catch (error) {
      logger.error(error);
    }
  }
);

export default productsRouterView;
