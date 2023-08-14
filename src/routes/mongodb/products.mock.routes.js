import { Router } from "express";

import generateProducts from "../../utils/mocking.js";

const productsMock = Router();

productsMock.get("/", async (req, res) => {
  try {
    const productos = generateProducts(100);
    res.send(productos);
  } catch (error) {
    console.log(error);
  }
});

export default productsMock;
