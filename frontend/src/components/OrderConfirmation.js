import  { useState, useEffect } from 'react';
import { CheckCircleIcon, TruckIcon, PrinterIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderByIdThunk } from '../slice/orderSlice';

const OrderConfirmation = () => {
const dispatch = useDispatch();
  const order = useSelector((store) => store.order.order);
  const [isLoading, setIsLoading] = useState(true);

  const {id} = useParams();

  useEffect(() => {
    // Simulating an API call to fetch order details
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        // Replace this with your actual API call
        await dispatch(fetchOrderByIdThunk(id));
       
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [dispatch, id]);

  const handlePrintOrder = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!order) {
    return <div className="flex justify-center items-center h-screen">No order found.</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-green-500 px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl leading-6 font-bold text-white">Order Confirmation</h1>
            <CheckCircleIcon className="h-8 w-8 text-white" />
          </div>
        </div>

        {<div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Order Details</h2>
              <button 
                onClick={handlePrintOrder}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <PrinterIcon className="h-4 w-4 mr-1" />
                Print Order
              </button>
            </div>
            <p className="text-sm text-gray-600"><strong>Order ID:</strong> {order.id}</p>
            <p className="text-sm text-gray-600"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p className="text-sm text-gray-600"><strong>Status:</strong> {order.status}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-2">Items</h2>
            <ul className="divide-y divide-gray-200">
              {order?.cart?.map((item, index) => (
                <li key={index} className="py-4 flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.product.title}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${(item.product.price * item.quantity)?.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-2">Order Summary</h2>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${order.totalAmount?.toFixed(2)}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Shipping</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">$0.00</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total</dt>
              <dd className="mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2">${order.totalAmount?.toFixed(2)}</dd>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-2">Shipping Address</h2>
            <address className="text-sm text-gray-600 not-italic">
              {order?.selectedAddress?.building}<br />
              {order?.selectedAddress?.street}<br />
              {order?.selectedAddress?.city}, {order?.selectedAddress?.state} {order?.selectedAddress?.postalCode}<br />
              {order?.selectedAddress?.country}
            </address>
          </div>

          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-2">Track Your Order</h2>
            <div className="flex items-center text-sm text-blue-600">
              <TruckIcon className="h-5 w-5 mr-2" />
              <a href="#" className="hover:underline">Click here to track your order</a>
            </div>
          </div>
        </div>}

        <div className="bg-gray-50 px-4 py-5 sm:px-6">
          <p className="text-sm text-gray-500 text-center">Thank you for your order! If you have any questions, please contact our customer support.</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;