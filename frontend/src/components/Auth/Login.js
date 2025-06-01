import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authLogin } from "../../slice/userSlice";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader } from "lucide-react";

import { fetchCartByUserThunk } from "../../slice/cartSlice";

// Define validation schema using Zod
const validationSchema = z.object({
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

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
  });

  const loginError = useSelector((store) => store.user.loginError);
  const loggedInUser = useSelector((store) => store.user.loggedInUser);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser, navigate]);

  const handleLogin = async (userData) => {
    setIsLoading(true);
    try {
      await dispatch(authLogin(userData));
      await dispatch(fetchCartByUserThunk());
      
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data) => {
    handleLogin(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-center mb-8">Login to your account</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                {...register("email")}
                className={`w-full p-3 pl-10 rounded-md border ${
                  ((errors.email || loginError)) ? "border-red-600" : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500  transition duration-200`}
                placeholder="Enter your email"
              />
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`w-full p-3 pl-10 pr-10 rounded-md border ${
                  (errors.password || loginError) ? "border-red-600" : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500  transition duration-200`}
                placeholder="Enter your password"
              />
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="bg-red-600 rounded-sm">
            {loginError && (
              <p className="text-white text-sm p-2 mt-1">{loginError}</p>
            )}
          </div>

          {/* Submit Button with loading state */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full bg-indigo-600 text-white p-3 rounded-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-1 transition duration-200 flex items-center justify-center ${
              isLoading
                ? "bg-blue-300 cursor-not-allowed hover:bg-indigo-300"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin mr-2" size={20} />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-200"
          >
            Forgot your password?
          </a>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {`Don't have an account? `}
            <Link
              to="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-800 transition duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
