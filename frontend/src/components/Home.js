import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserByToken } from "../slice/userSlice";
import { fetchCartByUserThunk } from "../slice/cartSlice";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProtectedRoute from "./ProtectedRoute";

import Pagination from "./Pagination";
import { ITEMS_PER_PAGE } from "../store/constant";
import Checkout from "./Checkout";
import OrderConfirmation from "./OrderConfirmation";

// Lazy loaded components
const ProductList = lazy(() => import("./ProductList"));
const ProductDetailPage = lazy(() => import("./ProductDetailPage"));
const Login = lazy(() => import("./Auth/Login"));
const Signup = lazy(() => import("./Auth/SignUp"));
const Cart = lazy(() => import("./Cart"));
const NotFound = lazy(() => import("./NotFound"));
const MyProfile = lazy(() => import("./UserProfile"));
const MyOrders = lazy(()=>import("./MyOrders"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="p-8 bg-white rounded-lg shadow-md">
      <div className="flex space-x-4 items-center">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  </div>
);

const Home = () => {
  const dispatch = useDispatch();
  const totalItems = useSelector((store) => store.product.totalItems);

  const [currentPage, setCurrentPage] = useState(1);
  const [isCheckoutAllowed, setIsCheckoutAllowed] = useState(false);

  

  const allowCheckout = () => {
    setIsCheckoutAllowed(true);
  };

  const handlePageChange = (page) => {
    console.log("page", page);
    setCurrentPage(page);
  };

  useEffect(() => {
    dispatch(getUserByToken());
    dispatch(fetchCartByUserThunk());
  }, [dispatch]);

  const totalPages = useMemo(
    () => Math.ceil(totalItems / ITEMS_PER_PAGE),
    [totalItems]
  );

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <ProductList currentPage={currentPage} />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                }
              />
              <Route
                path="/product-detail/:id"
                element={<ProductDetailPage />}
              />
              <Route
                path="/login"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Login />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Signup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <MyProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <MyOrders/>
                  </ProtectedRoute>
                }
              />
               <Route 
                path="/cart" 
                element={<Cart onProceedToCheckout={allowCheckout} />} 
              />

               <Route
                path="/cart/checkout"
                element={
                  <ProtectedRoute>
                    {isCheckoutAllowed ? (
                      <Checkout />
                    ) : (
                      <Navigate to="/cart" replace />
                    )}
                  </ProtectedRoute>
                }
              />

              <Route path="/products" element={
                  <>
                    <ProductList currentPage={currentPage} />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                }/>

              <Route
                path="order-confirmation/:id"
                element={
                  <ProtectedRoute>
                    <OrderConfirmation />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default Home;
