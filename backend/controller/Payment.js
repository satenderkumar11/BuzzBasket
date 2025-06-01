



const { Cashfree } = require("cashfree-pg");

// Configure Cashfree credentials and environment
Cashfree.XClientId = process.env.XClientId;
Cashfree.XClientSecret = process.env.XClientSecret;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

/**
 * Create a payment order using Cashfree's PGCreateOrder API.
 */
exports.createPayment = async (req, res) => {
  try {
    
    const orderDataForPayment = {...req.body};
    console.log("req body create payment", orderDataForPayment);
    
    if (!orderDataForPayment) {
      return res
        .status(400)
        .json({ error: "orderDataForPayment is required." });
    }

    

    // Await the order creation call instead of mixing then/catch with async/await
    const response = await Cashfree.PGCreateOrder("2023-08-01",  orderDataForPayment);
    console.log("Order created successfully:", response.data);

    return res.status(200).json(response.data);
  } catch (error) {
    // Use optional chaining to safely access error properties
    const errorMsg = error.response?.data?.message || error.message;
    console.error("Error creating order:", errorMsg);
    return res.status(500).json({ error: errorMsg });
  }
};


exports.verifyPayment = async (req, res) => {
  try {

    console.log("req.body", req.body)
    const {orderId} = req.body;
    if (!orderId) {
      return res.status(400).json({ error: "orderId is required." });
    }

    console.log("Verifying payment for order id:", orderId);
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    return res.status(200).json(response.data);
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error("Error verifying payment:", errorMsg);
    return res.status(500).json({ error: errorMsg });
  }
};
