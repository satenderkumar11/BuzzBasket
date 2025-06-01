/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// MyOrders.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { IoCartOutline, IoTimeOutline, IoLocationOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { fetchOrdersByUser } from "../slice/orderSlice"; // Assuming this action exists

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Format date (assuming order has a createdAt field)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6"
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-navy-900">Order #{order.id.slice(-6)}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 flex items-center">
              <IoTimeOutline className="mr-2" />
              {order.createdAt ? formatDate(order.createdAt) : "Date not available"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <p className="text-lg font-bold text-navy-900">${order.totalAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-600">{order.totalItems} items</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="bg-gold-100 rounded-full p-2 mt-1">
            <IoLocationOutline className="text-gold-500 w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-navy-900 mb-1">Shipping Address</h4>
            <p className="text-sm text-gray-600">
              {order.selectedAddress.building && `${order.selectedAddress.building}, `}
              {order.selectedAddress.street}<br />
              {order.selectedAddress.city}, {order.selectedAddress.state} {order.selectedAddress.postalCode}<br />
              {order.selectedAddress.country}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-gold-500 hover:text-gold-600 font-medium"
        >
          {expanded ? "Hide Details" : "View Order Details"}
        </button>
        
        {expanded && (
          <div className="mt-4 space-y-4">
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-medium text-navy-900 mb-3">Order Items</h4>
              <div className="space-y-3">
                {order.cart.map((item, index) => (
                  
                  <div key={index} className="flex items-start">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                      {item.product.thumbnail ? (
                        <img 
                          src={item.product.thumbnail} 
                          alt={item.product.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <IoCartOutline className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-navy-900">{item.product.title}</h5>
                      <p className="text-xs text-gray-600 mt-1">
                        Quantity: {item.quantity} × ${item.product.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-navy-900">
                        ${(item.quantity * item.product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-medium text-navy-900 mb-3">Payment Information</h4>
              <p className="text-sm text-gray-600">
                Method: {order.paymentMethod}
              </p>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm text-navy-900">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Shipping:</span>
                <span className="text-sm text-navy-900">Free</span>
              </div>
              <div className="flex justify-between items-center mt-2 font-semibold">
                <span className="text-sm text-navy-900">Total:</span>
                <span className="text-base text-navy-900">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((store) => store.order);
  const loggedInUser = useSelector((store) => store.user.loggedInUser);
  const { id } = loggedInUser;

  
  
  useEffect(() => {
    dispatch(fetchOrdersByUser(id));
  }, [dispatch, id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 py-10 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-navy-900 mb-8">My Orders</h1>
        
        {orders && orders.length > 0 ? (
          <div>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-8 text-center"
          >
            <div className="bg-gold-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <IoCartOutline className="text-gold-500 w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-navy-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You {"haven't"} placed any orders yet.</p>
            <a
              href="/products"
              className="px-6 py-3 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-600 transition-colors inline-block"
            >
              Start Shopping
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;