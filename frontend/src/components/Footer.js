import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
  } from "react-icons/fa";
  
  const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Us */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-sm text-gray-400 hover:text-white">
                BuzzBasket is your one-stop online shop for the latest products in
                electronics, fashion, home appliances, and more. Our mission is to
                provide a seamless shopping experience for our customers.
              </p>
            </div>
  
            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-semibold mb-4 hover:text-white">Customer Service</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>
                  <a className="hover:text-white" href="#">Help Center</a>
                </li>
                <li>
                  <a className="hover:text-white" href="#">Returns</a>
                </li>
                <li>
                  <a className="hover:text-white" href="#">Track Order</a>
                </li>
                <li>
                  <a className="hover:text-white" href="#">Shipping Info</a>
                </li>
                <li>
                  <a className="hover:text-white" href="#">FAQs</a>
                </li>
              </ul>
            </div>
  
            {/* Contact Us */}
            <div>
              <h3 className="text-lg font-semibold mb-4 hover:">Contact Us</h3>
              <ul className="text-sm text-gray-400 space-y-2 ">
                <li className="hover:text-white">Email: support@buzzbasket.com</li>
                <li className="hover:text-white">Phone: +1 234 567 890</li>
                <li className="hover:text-white">Address: 123 Main Street, City, Country</li>
                <li className="hover:text-white">Live Chat Support: Available 24/7</li>
              </ul>
            </div>
  
            {/* Newsletter Subscription */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <p className="text-sm text-gray-400">
                Subscribe to our newsletter to receive updates on new arrivals,
                exclusive deals, and special promotions.
              </p>
              <div className="mt-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="p-2 w-full rounded bg-gray-800 text-gray-300 border border-gray-700 focus:outline-none"
                />
                <button className="mt-2 w-full py-2 bg-blue-600 rounded text-white hover:bg-blue-700 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
  
          {/* Social Media & Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col lg:flex-row justify-between items-center">
            {/* Social Media Links */}
            <div className="flex space-x-4 mb-4 lg:mb-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedinIn />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaYoutube />
              </a>
            </div>
  
            {/* Copyright Text */}
            <div className="text-sm text-gray-400 hover:text-white">
              &copy; {new Date().getFullYear()} BuzzBasket. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  