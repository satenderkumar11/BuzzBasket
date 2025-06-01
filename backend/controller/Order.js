const { Cart } = require("../model/Cart");
const { Order } = require("../model/Order");

exports.fetchOrdersByUser = async (req, res) => {
    const { userId } = req.params;
    try {
      const orders = await Order.find({ user: userId }).populate('cart.product');
  
      res.status(200).json(orders);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
exports.fetchOrderById = async(req, res) =>{
  const { id } = req.params;
  console.log("order id", id)
  try {
    const order = await Order.findById(id);

    await order.populate('cart.product');

    console.log("order", order)
    


    res.status(200).json({status: "success", message:"Successfully fetched order by Id", order});
  } catch (err) {
    res.status(400).json(err);
  }

}
  exports.createOrder = async (req, res) => {
    try {
      // Fetch the cart but don't populate the products in cart items
      const cart = await Cart.findOne({user: req.body.user});
      console.log("cart.....", cart.items)
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // Create a new order, embedding the cart object directly
      const order = new Order({
        cart: cart.items, // Embedding the cart (with product IDs in items)
        totalAmount: req.body.totalAmount,
        totalItems: req.body.totalItems,
        user: req.body.user,
        paymentMethod: req.body.paymentMethod,
        selectedAddress: req.body.selectedAddress,
        status: req.body.status || 'pending'
      });
  
      // Save the order with the cart embedded (product IDs remain)
      const savedOrder = await order.save();
      await savedOrder.populate('cart.product');
      
      res.status(201).json({status: "success", message:"Successfully fetched order by Id", savedOrder}); // Return the saved order
    } catch (err) {
      console.log("Error creating order:", err);
      res.status(400).json(err);
    }
  };
  
  
  
  exports.deleteOrder = async (req, res) => {
      const { id } = req.params;
      try {
      const order = await Order.findByIdAndDelete(id);
      res.status(200).json(order);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
  exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(order);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  exports.fetchAllOrders = async (req, res) => {
    // sort = {_sort:"price",_order="desc"}
    // pagination = {_page:1,_limit=10}
    let query = Order.find({deleted:{$ne:true}});
    let totalOrdersQuery = Order.find({deleted:{$ne:true}});
  
    
    if (req.query._sort && req.query._order) {
      query = query.sort({ [req.query._sort]: req.query._order });
    }
  
    const totalDocs = await totalOrdersQuery.count().exec();
    console.log({ totalDocs });
  
    if (req.query._page && req.query._limit) {
      const pageSize = req.query._limit;
      const page = req.query._page;
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }
  
    try {
      const docs = await query.exec();
      res.set('X-Total-Count', totalDocs);
      res.status(200).json(docs);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  