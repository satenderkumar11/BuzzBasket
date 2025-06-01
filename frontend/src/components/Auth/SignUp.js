import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authSignup } from "../../slice/userSlice";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Loader } from "lucide-react";

// Define validation schema using Zod
const validationSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters long"),
  email: z.string().min(1, "Email is required").email("Email is invalid"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must be alphanumeric and contain at least one uppercase letter"
    ),
});

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
  });

  const signupError = useSelector((store) => store.user.signupError);
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

  const handleSignup = async (userData) => {
    setIsLoading(true);
    try {
      await dispatch(authSignup(userData));
        
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data) => {
    handleSignup(data);
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
          Create an Account
        </h2>
        <p className="text-gray-600 text-center mb-8">Join BuzzBasket today</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Name
            </label>
            <div className="relative">
              <input
                type="text"
                {...register("name")}
                className={`w-full p-3 pl-10 rounded-md border ${
                  errors.name ? "border-red-600" : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                placeholder="Enter your name"
              />
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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
                  errors.email ? "border-red-600" : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
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
                  errors.password ? "border-red-600" : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
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
            {signupError && (
              <p className="text-white text-sm p-2 mt-1">{signupError}</p>
            )}
          </div>
          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`w-full bg-indigo-600 text-white p-3 rounded-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-200 flex items-center justify-center ${
              isLoading
                ? "bg-indigo-300 cursor-not-allowed hover:bg-indigo-300"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin mr-2" size={20} />
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-800 transition duration-200"
            >
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
