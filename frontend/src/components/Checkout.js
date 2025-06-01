/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { createOrderThunk, createPaymentThunk, resetPaymentState, verifyPaymentThunk } from "../slice/orderSlice";
import { deleteCartThunk } from "../slice/cartSlice";
import { load } from "@cashfreepayments/cashfree-js";

const Checkout = () => {
  

  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  let cashfree;

  var initializeSDK = async function () {
    cashfree = await load({
      mode: "sandbox",
    });
  };
  initializeSDK();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const cartItems = useSelector((store) => store.cart.cartItems);
  const loggedInUser = useSelector((store) => store.user.loggedInUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const subtotal = cartItems?.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );



  const getSessionData = async (orderData) => {
    try {
      const result = await dispatch(createPaymentThunk(orderData)).unwrap();
      if (!result?.payment_session_id || !result?.order_id) {
        throw new Error("Failed to get payment session or order ID");
      }
      // Optionally, update state if needed later, but also return the IDs
      setOrderId(result.order_id);
      return {
        sessionId: result.payment_session_id,
        orderId: result.order_id,
      };
    } catch (error) {
      throw new Error("Payment session creation failed: " + (error.message || "Unknown error"));
    }
  };
  
  const processPayment = async (orderData) => {
    const { sessionId, orderId } = await getSessionData(orderData);
    const checkoutOptions = {
      paymentSessionId: sessionId,
      redirectTarget: "_modal",
    };
  
    return new Promise((resolve, reject) => {
      cashfree.checkout(checkoutOptions)
        .then((result) => {
          if (result.error) {
            reject(new Error(result.error.message || "Payment failed"));
          } else if (result.paymentDetails) {
            // Resolve with both payment details and orderId
            resolve({ paymentDetails: result.paymentDetails, orderId });
          } else if (result.redirect) {
            console.log("Payment redirecting...");
          }
        })
        .catch(reject);
    });
  };
  
  const handlePayment = async (orderData) => {
    setIsLoading(true);
    setError(null);
  
    try {
      // Process payment and retrieve both payment details and orderId
      const { paymentDetails, orderId } = await processPayment(orderData);
      
      // Verify payment using the correct orderId
      await dispatch(verifyPaymentThunk(orderId)).unwrap();
      
      // Create order after successful payment verification
      const orderResult = await dispatch(createOrderThunk(orderData)).unwrap();

      dispatch(resetPaymentState());
      
      // Clear cart and navigate to confirmation
      await dispatch(deleteCartThunk()).unwrap();
      navigate(`/order-confirmation/${orderResult.id}`);
    } catch (error) {
      console.error("Payment process failed:", error);
      setError(error.message || "Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const onSubmit = async (formData) => {
    const orderData = {
      totalAmount: subtotal,
      totalItems: cartItems.length,
      user: loggedInUser.id,
      paymentMethod: formData.paymentMethod,
      selectedAddress: {
        building: formData.building,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
      },
    };

    await handlePayment(orderData);
  };


  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            Checkout
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white shadow-md rounded-lg p-6 space-y-6"
          >
            {/* Shipping Address */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Shipping Address
              </h3>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    {...register("name", { required: "Full name is required" })}
                    id="name"
                    type="text"
                    className={`mt-1 block w-full px-4 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter a valid 10-digit phone number",
                      },
                    })}
                    id="phone"
                    type="tel"
                    className={`mt-1 block w-full px-4 py-2 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="1234567890"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Street Address */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street Address
                  </label>
                  <input
                    {...register("street", {
                      required: "Street address is required",
                    })}
                    id="street"
                    type="text"
                    className={`mt-1 block w-full px-4 py-2 border ${
                      errors.street ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="123 Main St"
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                {/* Building/Apartment */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="building"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Building/Apartment (Optional)
                  </label>
                  <input
                    {...register("building")}
                    id="building"
                    type="text"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Apt 4B"
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    {...register("city", { required: "City is required" })}
                    id="city"
                    type="text"
                    className={`mt-1 block w-full px-4 py-2 border ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <input
                    {...register("state", { required: "State is required" })}
                    id="state"
                    type="text"
                    className={`mt-1 block w-full px-4 py-2 border ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="NY"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                {/* Postal Code */}
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Postal Code
                  </label>
                  <input
                    {...register("postalCode", {
                      required: "Postal Code is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Enter a valid postal code",
                      },
                    })}
                    id="postalCode"
                    type="text"
                    className={`mt-1 block w-full px-4 py-2 border ${
                      errors.postalCode ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="12345"
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Mode */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Payment Method
              </h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    {...register("paymentMethod", {
                      required: "Payment method is required",
                    })}
                    id="card"
                    type="radio"
                    value="Card"
                    className="focus:ring-blue-500 text-blue-600 border-gray-300"
                  />
                  <label
                    htmlFor="card"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Credit / Debit Card
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    {...register("paymentMethod", {
                      required: "Payment method is required",
                    })}
                    id="cash"
                    type="radio"
                    value="Cash"
                    className="focus:ring-blue-500 text-blue-600 border-gray-300"
                  />
                  <label
                    htmlFor="cash"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Cash on Delivery
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    {...register("paymentMethod", {
                      required: "Payment method is required",
                    })}
                    id="paypal"
                    type="radio"
                    value="PayPal"
                    className="focus:ring-blue-500 text-blue-600 border-gray-300"
                  />
                  <label
                    htmlFor="paypal"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    PayPal
                  </label>
                </div>
              </div>

              {errors.paymentMethod && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Complete Purchase
              </button>
            </div>
          </form>
        </div>

        {/* Cart Summary Section */}
        <div className="bg-white shadow-md rounded-lg p-6 sticky top-6 mt-24 mb-64 ">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Order Summary
          </h3>

          {/* Show a button to view cart in modal */}
          {loggedInUser && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 hover:underline text-sm mb-4"
            >
              View Cart Details
            </button>
          )}

          {/* Modal for Cart Details */}
          <Dialog
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            className="relative z-50"
          >
            <div
              className="fixed inset-0 bg-black bg-opacity-30"
              aria-hidden="true"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <DialogPanel className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full">
                <DialogTitle className="text-xl font-semibold text-gray-900 mb-4">
                  Cart Items
                </DialogTitle>

                <ul className="divide-y divide-gray-200 mb-6 max-h-96 overflow-y-auto">
                  {cartItems?.map((item, index) => (
                    <li key={index} className="flex py-4 space-x-4">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.product.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x ₹{item.product.price}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="text-right">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-sm text-gray-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Shipping</span>
              <span className="text-sm text-gray-900">₹100</span>
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>₹{(subtotal + 100).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
