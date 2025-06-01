const { Category } = require('../model/Category');

exports.fetchCategories = async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await Category.find({}).exec();
    
    // Check if categories were found
    if (!categories || categories.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No categories found',
      });
    }

    // Return categories with a success status
    res.status(200).json({
      status: 'success',
      message: 'Categories fetched successfully',
      data: categories,
    });
  } catch (err) {
    // Handle errors and return a descriptive message
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
    const doc = await category.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};



