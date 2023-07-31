import { ProductModel } from "../../models/mongodb/products.js";

export default class productManager {
  constructor() {}

  getAll = async (pageIn, limitIn, categoryIn, qIn, priceIn, sortIn) => {
    const page = parseInt(pageIn, 10) ?? 10;
    const limit = limitIn ? parseInt(limitIn, 10) : 10;
    const price = parseInt(priceIn, 10);

    let sort = { price: 1 };
    if (sortIn == "desc") {
      sort = {
        price: -1,
      };
    }

    const filter = {};

    if (categoryIn) filter.category = categoryIn;

    if (qIn) filter.title = qIn;

    if (price) filter.price = price;

    const products = await ProductModel.paginate(filter, {
      limit,
      page,
      sort,
    });

    return products;
  };

  getAllOutFilter = async () => {
    const products = await ProductModel.find();
    return products;
  };

  getById = async (id) => {
    try {
      const product = await ProductModel.findOne({ _id: id });
      console.log("Get product");
      return product;
    } catch (err) {
      console.log("Failed get product");
      console.log(err);
    }
  };
}
