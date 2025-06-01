/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { handleItemQtyInCart, removeItemFromCart } from "../slice/cartSlice";
import { Trash2, Plus, Minus, ShoppingCart, LogIn } from "lucide-react";

const Cart = ({ onProceedToCheckout }) => {
  const loggedInUser = useSelector((store) => store.user.loggedInUser);
  const cartItems = useSelector((store) => store.cart.cartItems);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleQuantityChange = async (productId, newQuantity) => {
    setLoading(true);
    await dispatch(handleItemQtyInCart({ productId, quantity: newQuantity }));
    setLoading(false);
  };

  const handleRemoveItem = async (productId) => {
    setLoading(true);
    await dispatch(removeItemFromCart(productId));
    setLoading(false);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  if (!loggedInUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md inline-flex items-center">
          <LogIn className="text-blue-500 mr-3" size={24} />
          <p className="text-blue-700">
            Please{" "}
            <button
              onClick={handleLoginRedirect}
              className="font-semibold text-blue-600 hover:text-blue-800 underline focus:outline-none"
            >
              log in
            </button>{" "}
            to view your cart.
          </p>
        </div>
      </div>
    );
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
          Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <ShoppingCart className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-xl text-gray-600">Your cart is empty.</p>
            <Link
              to="/"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li
                  key={item.product._id}
                  className="p-6 flex flex-col sm:flex-row sm:items-center"
                >
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    className="h-24 w-24 object-cover rounded-md bg-gray-100 border-gray-300 border-2"
                  />
                  <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.product.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      ${item.product.price.toFixed(2)}
                    </p>
                    <div className="mt-4 flex items-center">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            -1
                          )
                        }
                        disabled={item.quantity <= 1 || loading}
                        className="text-gray-500 focus:outline-none focus:text-gray-600 p-1 disabled:opacity-50"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <span className="mx-2 text-gray-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id,
                            1
                          )
                        }
                        disabled={loading}
                        className="text-gray-500 focus:outline-none focus:text-gray-600 p-1 disabled:opacity-50"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center">
                    <p className="text-lg font-semibold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      disabled={loading}
                      className="ml-4 text-red-500 hover:text-red-600 focus:outline-none p-2 disabled:opacity-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-xl font-semibold text-gray-900">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalPrice.toFixed(2)}
                </p>
              </div>
              <button
                onClick={onProceedToCheckout}
                className="mt-4 w-full block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold text-center hover:bg-blue-700 transition-colors duration-200"
              >
                <Link
                  to="/cart/checkout"
                  className="block w-full h-full text-white"
                >
                  Proceed to Checkout
                </Link>
              </button>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default Cart;
