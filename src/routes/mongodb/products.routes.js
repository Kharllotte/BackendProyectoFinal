import { Router } from "express";
import productManager from "../../dao/managers/mongodb/products.js";

const product = new productManager();
const productRouter = Router();

/**
 * Metodo para obtener los productos con filtros opcionales de:
 * page, limit, category, title (q), price y sort.
 */
productRouter.get("/", async (req, res) => {
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
    console.log(error);
  }
});

export default productRouter;
