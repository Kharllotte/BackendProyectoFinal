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
    const products = await ProductModel.find({ active: true });
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

  add = async (product) => {
    try {
      const exist = await ProductModel.find({
        $or: [
          {
            title: product.productName,
          },
          {
            code: product.productCode,
          },
        ],
      });

      if (exist.length > 0) {
        console.log(exist);
        throw "Already product exist";
      }

      const newProduct = {
        id: `${product.productName}${product.productCode}`,
        title: product.productName,
        description: product.productDescription,
        price: product.productPrice,
        code: product.productCode,
        stock: product.productStock,
        category: product.productCategory,
        active: true,
      };

      const result = await ProductModel.create(newProduct);
      console.log("Product saved");
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  update = async (product) => {
    try {
      const newProduct = {
        title: product.productName,
        description: product.productDescription,
        price: product.productPrice,
        code: product.productCode,
        stock: product.productStock,
        category: product.productCategory,
        active: true,
      };

      let result = await ProductModel.findByIdAndUpdate(
        { _id: product._id},
        newProduct
      );

      console.log("Product updated");
      return result;
    } catch (error) {
      console.log(error);
    }
  };
}
