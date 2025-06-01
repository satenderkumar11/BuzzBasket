/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { authLogin } from "../slice/userSlice";
import { fetchCartByUserThunk } from "../slice/cartSlice";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must be alphanumeric and contain at least one uppercase letter"
    ),
});

const LoginPopup = ({ isOpen, onClose, handleLoginPopup }) => {
  const dispatch = useDispatch();

  const loginError = useSelector((store) => store.user.loginError);
  const loggedInUser = useSelector((store) => store.user.loggedInUser);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   if (loggedInUser) {
  //     navigate(`/product-detail/${id}`);
  //   }
  // }, [loggedInUser, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    handleLogin(data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (userData) => {
    setIsLoading(true);
    try {
      await dispatch(authLogin(userData));
      await dispatch(fetchCartByUserThunk());
      if (loggedInUser) {
        console.log("loggedIn user");
        handleLoginPopup();
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-blue-100">Please sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="bg-red-600 rounded-sm">
            {loginError && (
              <p className="text-white text-sm p-2 mt-1">{loginError}</p>
            )}
          </div>

          <div className="flex justify-between items-center space-x-4">
            <button
              type="submit"
              className={
                !isLoading
                  ? `flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition duration-200`
                  : `flex-1 bg-gradient-to-r from-blue-200 to-purple-300 text-white px-4 py-2 rounded-md hover:from-blue-300 hover:to-purple-200 focus:outline-none focus:ring-1 focus:ring-blue-200 focus:ring-offset-1 transition duration-200`
              }
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            {`Don't have an account?`}{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
