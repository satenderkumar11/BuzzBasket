const { Brand } = require('../model/Brand');

exports.fetchBrands = async (req, res) => {
  try {
    // Fetch all brands from the database
    const brands = await Brand.find({}).exec();
    
    // Check if brands were found
    if (!brands || brands.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No brands found',
      });
    }

    // Return brands with a success status
    res.status(200).json({
      status: 'success',
      message: 'Brands fetched successfully',
      data: brands,
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

exports.createBrand = async (req, res) => {
  const brand = new Brand(req.body);
  try {
    const doc = await brand.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
