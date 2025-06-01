const { Cart } = require("../model/Cart");

exports.fetchAllCart = async (req, res) => {
  const carts = await Cart.find({});

  res.status(200).json({
    status: "success",
    message: "All Carts are fetched successfully",
    data: carts,
  });
};

exports.fetchCartByUser = async (req, res) => {
  
  
  try {
    const {userId} = req.user;
    console.log("userID", userId)
    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product", // Populate the product field inside items
      select: "", // Adjust fields to populate
    });

    // Check if the cart exists
    if (!cart) {

      cart = new Cart({ user: userId, items: [] });
      await cart.save();

    }

    // Return cart items with a success status
    res.status(200).json({
      status: "success",
      message: "Cart items fetched successfully",
      cart: cart.items,
    });
  } catch (err) {
    // Handle errors and return a descriptive message
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.handleQuantityInCart = async (req, res) => {
  const { quantity, productId } = req.body;
  const { userId } = req.user;

  // Validate input
  if (!productId ) {
    return res.status(400).json({
      status: "error",
      message: "Valid productId is required.",
    });
  }

  try {
    // Find the user's cart and populate product details in the items
    let cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ 
        status: "error", 
        message: "Cart not found for the user" 
      });
    }

    // Find the product in the cart items
    const cartItem = cart.items.find(item => item.product._id.toString() === productId);

    if (!cartItem) {
      // Add a new product to the cart
      cart.items.push({ product: productId, quantity: quantity });
    } else {
      // Update the product's quantity
      cartItem.quantity += quantity;

      // Remove item if quantity is 0 or less
      if (cartItem.quantity <= 0) {
        cart.items = cart.items.filter(item => item.product._id.toString() !== productId);
      }
    }

    // Save the updated cart and populate items again
    const updatedCart = await cart.save();
    await updatedCart.populate('items.product');

    // Send back the updated cart
    return res.status(200).json({
      status: "success",
      message: "Cart updated successfully",
      updatedCart: updatedCart.items,
    });
  } catch (err) {
    console.error('Error updating cart:', err.message);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the cart",
    });
  }
};


exports.deleteFromCart = async (req, res) => {
  const { productId } = req.body;
  const { userId } = req.user;

  // Input validation
  if (!productId) {
    return res.status(400).json({
      status: "error",
      message: "Valid productId is required",
    });
  }

  try {
    // Find the cart for the user
    let cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found for the user",
      });
    }

    // Find the index of the product in the cart
    const productIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Product not found in the cart",
      });
    }

    // Remove the item from the cart
    cart.items.splice(productIndex, 1);

    // Save the updated cart and populate the product details
    const updatedCart = await cart.save();
    await updatedCart.populate('items.product');

    res.status(200).json({
      status: "success",
      message: "Item deleted from the cart successfully",
      updatedCart: updatedCart.items,
    });
  } catch (err) {
    console.error("Error deleting item from cart:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.deleteCart = async(req, res) => {
  const {userId} = req.user;

  try{
    const cart = await Cart.findOne({user: userId});
    cart.items = [];
    await cart.save();
    res.status(200).json({status: 'success', message:"Cart is successfully deleted", cart});
  }catch(err){
    res.status(400).json(err);
  }
}

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await cart.populate("product");

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
