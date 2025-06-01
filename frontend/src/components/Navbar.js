/* eslint-disable no-unused-vars */
// Navbar.jsx
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, ShoppingCart, ChevronDown } from "lucide-react";
import { fetchCategories } from "../slice/categorySlice";
import { authLogout } from "../slice/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import useOutsideClick from "../hooks/useOutsideClick";

const Navbar = () => {
  const { categories } = useSelector((store) => store.category);
  const loggedInUser = useSelector((store) => store.user.loggedInUser);
  const cartItems = useSelector((store) => store.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const cartItemCount = cartItems?.length || 0;
  const userMenuRef = useRef(null);
  const categoryRef = useRef(null);
  const searchInputRef = useRef(null);

  useOutsideClick(userMenuRef, () => setIsUserMenuOpen(false));
  useOutsideClick(categoryRef, () => setIsCategoryOpen(false));

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
      searchInputRef.current?.blur();
    }
  };

  const handleCategorySelect = (slug) => {
    navigate(`/products?category=${slug}`);
    setIsCategoryOpen(false);
  };

  const handleLogout = () => {
    dispatch(authLogout());
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <header className="bg-navy-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Main Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
                <span className="text-navy-900 font-bold text-2xl">B</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">Buzz Basket</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                to="/"
                className="text-white/80 hover:text-gold-500 transition-colors font-medium"
              >
                Home
              </Link>
              
              <div className="relative" ref={categoryRef}>
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center space-x-1 text-white/80 hover:text-gold-500 transition-colors font-medium"
                >
                  <span>Categories</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${
                    isCategoryOpen ? 'rotate-180' : ''
                  }`}/>
                </button>

                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100"
                    >
                      <div className="p-2 max-h-96 overflow-y-auto">
                        {categories?.map(category => (
                          <button
                            key={category.id}
                            onClick={() => handleCategorySelect(category.slug)}
                            className="w-full px-4 py-2.5 text-left text-sm text-navy-900 hover:bg-gray-50 rounded-md"
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/products"
                className="text-white/80 hover:text-gold-500 transition-colors font-medium"
              >
                All Products
              </Link>
            </nav>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-6 flex-1 max-w-2xl justify-end">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:block flex-1 max-w-xl">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-2.5 rounded-full bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-gold-500"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Link
                to="/cart"
                className="relative hover:text-gold-500 transition-colors"
              >
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold-500 text-navy-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {loggedInUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 hover:bg-gold-500/30"
                  >
                    {loggedInUser.name.charAt(0).toUpperCase()}
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100"
                      >
                        <div className="p-2">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-navy-900">
                              {loggedInUser.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {loggedInUser.email}
                            </p>
                          </div>
                          <Link
                            to="/profile"
                            className="block px-4 py-2.5 text-sm text-navy-900 hover:bg-gray-50 rounded-md"
                          >
                            Account Settings
                          </Link>
                          <Link
                            to="/orders"
                            className="block px-4 py-2.5 text-sm text-navy-900 hover:bg-gray-50 rounded-md"
                          >
                            Order History
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 text-sm text-navy-900 hover:bg-gray-50 rounded-md"
                          >
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-gold-500 text-navy-900 rounded-full font-medium hover:bg-gold-600 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;