import { Router } from "express";
import productManager from "../../dao/managers/mongodb/products.js";
import authMiddleware from "../../helpers/auth.js";

const product = new productManager();
const productRouter = Router();

/**
 * Metodo para obtener los productos con filtros opcionales de:
 * page, limit, category, title (q), price y sort.
 */
productRouter.get("/", authMiddleware.isLoggedIn, async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const category = req.query.category;
  const q = req.query.q;
  const price = req.query.price;
  const sort = req.query.sort;

  try {
    const payload = await product.getAll(page, limit, category, q, price, sort);
    return res.json({
      result: "success",
      payload,
    });
  } catch (error) {
    logger.error(error)
  }
});

productRouter.get("/:id", authMiddleware.isLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;
    const payload = await product.getById(id);
    return res.json({
      result: "success",
      payload,
    });
  } catch (error) {
    logger.error(error)
  }
});

export default productRouter;
