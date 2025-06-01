const { Product } = require("../model/Product");

exports.createProduct = async (req, res) => {
  const productData = req.body;

  // Create a new product instance with the data from the request body
  const product = new Product(productData);

  try {
    // Save the product to the database
    const doc = await product.save();

    // Respond with the created product and status code 201 (Created)
    res
      .status(201)
      .json({
        status: "success",
        message: "product is successfully updated",
        doc,
      });
  } catch (err) {
    // If there's a validation error, send a 400 Bad Request response with the error message
    if (err.name === "ValidationError") {
      res
        .status(400)
        .json({
          status: "error",
          message: "Validation Error",
          error: err.message,
        });
    } else {
      // For other errors, send a 500 Internal Server Error response
      res
        .status(500)
        .json({ status: "error", message: "Server Error", error: err.message });
    }
  }
};

exports.fetchAllProducts = async (req, res) => {
  try {
    let condition = {};

    // Exclude deleted products for non-admin users
    if (!req.query.admin) {
      condition.deleted = { $ne: true };
    }

    // Initialize query with the base condition
    let query = Product.find(condition);

    // Apply category filter if provided
    if (req.query.category) {
      const categories = req.query.category.split(",");
      query = query.where("category").in(categories);
      condition.category = { $in: categories }; 
    }

    // Apply brand filter if provided
    if (req.query.brand) {
      const brands = req.query.brand.split(",");
      query = query.where("brand").in(brands);
    }

    // Apply sorting if provided
    if (req.query._sort && req.query._order) {
      query = query.sort({ [req.query._sort]: req.query._order });
    }

    // Count total documents after filters are applied
    const totalDocs = await query.clone().countDocuments().exec();
    console.log({ totalDocs });

    query = query.select('title price brand discountPercentage rating thumbnail');

    // Apply pagination if provided
    if (req.query._page && req.query._limit) {
      const pageSize = parseInt(req.query._limit, 10);
      const page = parseInt(req.query._page, 10);
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    // Execute query to fetch products
    const products = await query.exec();


    const distinctBrands = await Product.distinct('brand', condition);

    res.set("X-Total-Count", totalDocs);
    res
      .status(200)
      .json({
        status: "success",
        message: "All products are successfully updated",
        data: products,
        brands: distinctBrands
      });
  } catch (err) {
    // Improved error handling

    res
      .status(500)
      .json({
        status: "error",
        message: "Internal Server Error",
        error: err.message,
      });
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }

    res
      .status(200)
      .json({
        status: "success",
        message: "product is successfully fetched with id",
        product,
      });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "Server error", error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Update the product using the custom id field and return the updated document
    const product = await Product.findByIdAndUpdate(
      id, // Assuming the custom id is an integer; adjust if needed
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators for the update operation
      }
    );

    // Handle the case where the product is not found
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }

    res
      .status(200)
      .json({
        status: "success",
        message: "product is successfully updated",
        product,
      });
  } catch (err) {
    // Handle validation errors and other types of errors
    if (err.name === "ValidationError") {
      res
        .status(400)
        .json({
          status: "error",
          message: "Validation Error",
          errors: err.errors,
        });
    } else {
      res
        .status(500)
        .json({ status: "error", message: "Server Error", error: err.message });
    }
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the product using the custom id field
    const product = await Product.findByIdAndRemove(id); // Adjust parseInt if necessary

    // Handle the case where the product is not found
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }

    // Respond with a success message
    res
      .status(200)
      .json({ status: "success", message: "Product successfully deleted" });
  } catch (err) {
    // Handle unexpected errors
    res
      .status(500)
      .json({ status: "error", message: "Server Error", error: err.message });
  }
};
