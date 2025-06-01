/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// ProductList.jsx
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoStarSharp, IoStarHalfSharp, IoClose, IoFilterSharp } from "react-icons/io5";
import { fetchProducts } from "../slice/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import useOutsideClick from "../hooks/useOutsideClick";

const Shimmer = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        className="bg-white rounded-xl shadow-sm h-[400px] overflow-hidden"
      >
        <div className="h-48 bg-gray-200 animate-pulse" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse" />
        </div>
      </motion.div>
    ))}
  </div>
);

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <IoStarSharp key={i} className="text-gold-500 w-4 h-4" />
      ))}
      {hasHalfStar && <IoStarHalfSharp className="text-gold-500 w-4 h-4" />}
      {[...Array(emptyStars)].map((_, i) => (
        <IoStarSharp key={`empty-${i}`} className="text-gray-400 w-4 h-4" />
      ))}
    </div>
  );
};

const sortOptions = [
  { name: "Featured", sort: "", order: "" },
  { name: "Best Rating", sort: "rating", order: "desc" },
  { name: "Price: Low to High", sort: "price", order: "asc" },
  { name: "Price: High to Low", sort: "price", order: "desc" },
];

const ProductList = ({ currentPage }) => {
  const dispatch = useDispatch();
  const { products, brands } = useSelector((store) => store.product);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  
  // Filters
  const selectedCategory = searchParams.get("category");
  const searchQuery = searchParams.get("q");
  const [sortOption, setSortOption] = useState(sortOptions[0]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Refs
  const brandRef = useRef(null);
  const filterRef = useRef(null);
  useOutsideClick(brandRef, () => setIsFilterOpen(false));

  useEffect(() => {
    const fetchProductsData = async () => {
      setLoading(true);
      await dispatch(
        fetchProducts({
          page: currentPage,
          category: selectedCategory,
          brand: selectedBrands.join(","),
          q: searchQuery,
          _sort: sortOption.sort,
          _order: sortOption.order,
        })
      );
      setLoading(false);
    };

    fetchProductsData();
  }, [currentPage, sortOption, selectedBrands, selectedCategory, searchQuery, dispatch]);

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="bg-gray-50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Search Header */}
        {searchQuery && (
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-light text-gray-600">
              Search results for: 
              <span className="font-semibold ml-2 text-navy-900">{`${searchQuery}`}</span>
            </h2>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <h1 className="text-3xl font-bold text-navy-900">
            {selectedCategory ? selectedCategory : "All Products"}
          </h1>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Sort Dropdown */}
            <div className="relative flex-1 md:flex-none">
              <select
                value={`${sortOption.sort}-${sortOption.order}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  setSortOption({ sort, order, name: e.target.options[e.target.selectedIndex].text });
                }}
                className="w-full bg-white px-4 py-2.5 rounded-lg shadow-sm border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                {sortOptions.map(option => (
                  <option 
                    key={option.name} 
                    value={`${option.sort}-${option.order}`}
                  >
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full md:w-auto bg-white px-4 py-2.5 rounded-lg shadow-sm border border-gray-200 text-gray-700 hover:border-gold-500 flex items-center gap-2"
            >
              <IoFilterSharp className="text-gold-500" />
              <span>{isFilterOpen ? "Hide Filters" : "Show Filters"}</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                ref={filterRef}
                className="w-full lg:w-64 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-navy-900 mb-4">Brands</h3>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <label 
                        key={brand}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                          className="h-4 w-4 text-gold-500 rounded border-gray-300 focus:ring-gold-500"
                        />
                        <span className="text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {selectedBrands.length > 0 && (
                  <button
                    onClick={() => setSelectedBrands([])}
                    className="w-full py-2 text-sm text-gold-500 hover:text-gold-600 font-medium"
                  >
                    Clear Brands
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <Shimmer />
            ) : products.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
              >
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                  >
                    <Link
                      to={`/product-detail/${product._id}`}
                      className="block h-full"
                    >
                      <div className="relative aspect-square">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-medium text-navy-900 mb-1 truncate">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-gold-500">
                            &#8377;{(85 * product.price).toFixed(2)}
                          </span>
                          {renderStars(product.rating)}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-xl font-medium text-navy-900 mb-4">
                  No products found
                </h3>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSortOption(sortOptions[0]);
                  }}
                  className="px-6 py-2 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-600 transition-colors"
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;