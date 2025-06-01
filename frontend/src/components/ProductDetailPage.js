/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Star,
  Package,
  Truck,
  RotateCcw,
  Shield,
  AlertTriangle,
  Plus,
  Minus,
  ShoppingCart,
  Loader,
} from "lucide-react";
import { handleItemQtyInCart } from "../slice/cartSlice";
import {
  fetchProductById,
  productNullOnDetailPage,
} from "../slice/productSlice";

const LoginPopup = lazy(() => import("./LoginPopup"));
const ShimmerEffect = () => (
  <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden animate-pulse">
        <div className="md:flex">
          <div className="md:w-1/2 p-8">
            <div className="mb-4 h-96 bg-gray-200 rounded-lg"></div>
            <div className="flex space-x-2 overflow-x-auto">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="w-20 h-20 bg-gray-200 rounded-md"
                ></div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 p-8">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LazyImage = ({ src, alt, className, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className={`${className} bg-gray-200 relative overflow-hidden`}
      onClick={onClick}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader className="animate-spin text-gray-400" size={24} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${
          isLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

const ProductErrorComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Product Not Available
      </h2>
      <p className="text-gray-600 mb-4">{`We're sorry, but the product you're looking for is currently unavailable.`}</p>
      <Link
        to="/"
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((store) => store.user.loggedInUser);
  const cartItems = useSelector((store) => store.cart.cartItems);
  const product = useSelector((store) => store.product.product);
  const productError = useSelector((store) => store.product.productError);

  const [currentImage, setCurrentImage] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const isProductInCart = useMemo(() => {
    return cartItems?.some((item) => item.product._id === id);
  }, [cartItems, id]);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(productNullOnDetailPage());
  }, [dispatch, id]);

  if (!product) {
    return productError ? <ProductErrorComponent /> : <ShimmerEffect />;
  }

  const renderStars = (rating) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-current"
              : i < rating
              ? "text-yellow-400 fill-current opacity-50"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-500">
        ({rating.toFixed(1)})
      </span>
    </div>
  );

  const handleAddToCart = async () => {
    if (loggedInUser) {
      setIsLoading(true);
      await dispatch(handleItemQtyInCart({ productId: id, quantity }));
      setTimeout(() => setIsLoading(false), 1000);
    } else {
      setShowLoginPopup(true);
    }
  };

  const CartButton = () => {
    const baseButtonClasses = `flex items-center justify-center w-1/3 bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500`;

    if (isLoading) {
      return (
        <button className={`${baseButtonClasses} opacity-75`} disabled>
          <Loader className="animate-spin mr-2" size={20} />
          <span>Adding...</span>
        </button>
      );
    }

    if (isProductInCart) {
      return (
        <Link to="/cart" className="block w-1/3">
          <button className={`flex items-center justify-center w-full bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500`}>
            <ShoppingCart size={20} className="mr-2" />
            <span>Go to Cart</span>
          </button>
        </Link>
      );
    }

    return (
      <button onClick={handleAddToCart} className={baseButtonClasses}>
        <ShoppingCart size={20} className="mr-2" />
        <span>Add to Cart</span>
      </button>
    );
  };

  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
  };

  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <div className="mb-4">
                <LazyImage
                  src={product.images[currentImage] || product.thumbnail}
                  alt={product.title}
                  className="w-full h-96 object-contain rounded-lg"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <LazyImage
                    key={index}
                    src={image}
                    alt={`${product.title} - ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer ${
                      currentImage === index ? "border-2 border-blue-500" : ""
                    }`}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                {product.category}
              </div>
              <h1 className="mt-1 text-4xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
              <div className="mt-2">{renderStars(product.rating)}</div>
              <p className="mt-4 text-gray-600">{product.description}</p>
              <div className="mt-4 flex items-center">
                <span className="text-3xl font-bold text-gray-900">
                  &#8377;{(85 * product.price).toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="ml-2 text-2xl text-gray-500 line-through">
                      &#8377;
                      {(
                        85 * product.price /
                        (1 - product.discountPercentage / 100)
                      ).toFixed(2)}
                    </span>
                    <span className="ml-2 text-lg text-green-600">
                      ({product.discountPercentage}% off)
                    </span>
                  </>
                )}
              </div>
              <div className="mt-6 space-y-4">
                {!isProductInCart && (
                  <div className="flex items-center justify-start">
                    <span className="mr-4 text-gray-700">Quantity:</span>
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="p-2 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="px-4 font-medium">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="p-2 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex justify-start w-full">
                  <CartButton />
                </div>
              </div>
              <span className="mt-2 block text-sm text-gray-500">
                {product.stock > 0
                  ? ``
                  : "Out of stock"}
              </span>
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Package className="mr-2 h-4 w-4" />
                    SKU: {product.sku}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Truck className="mr-2 h-4 w-4" />
                    {product.shippingInformation}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {product.returnPolicy}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Shield className="mr-2 h-4 w-4" />
                    {product.warrantyInformation}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-8 py-6 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Dimensions (W x H x D)
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {product.dimensions.width}{`"`} x {product.dimensions.height}{`"`} x{" "}
                  {product.dimensions.depth}{`"`}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {product.weight} lbs
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Minimum Order Quantity
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {product.minimumOrderQuantity}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {product.tags.join(", ")}
                </p>
              </div>
            </div>
          </div>
          <div className="px-8 py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Customer Reviews
            </h2>
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: getRandomColor() }}
                  >
                    {review.reviewerName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {review.reviewerName}
                    </h3>
                    <div className="mt-1">{renderStars(review.rating)}</div>
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {product.availabilityStatus === "Low Stock" && (
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle
                  className="h-5 w-5 text-yellow-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Low Stock Alert:</span> This
                  item is running low on stock. Order soon to avoid
                  disappointment!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {!loggedInUser ? (
        <Suspense fallback={<div>Loading...</div>}>
          <LoginPopup
            isOpen={showLoginPopup}
            onClose={() => setShowLoginPopup(false)}
            id={id}
            handleLoginPopup={() => setShowLoginPopup(false)}
          />
        </Suspense>
      ) : null}
    </div>
  );
};

export default ProductDetailPage;