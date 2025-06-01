/* eslint-disable no-unused-vars */
// UserProfile.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { IoSaveOutline, IoPersonCircleOutline, IoLocationOutline, IoMailOutline, IoKeyOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { updateUserProfile } from "../slice/userSlice"; // Assuming this action exists

const UserProfile = () => {
  const dispatch = useDispatch();
  
  const {loggedInUser, loading} = useSelector((store) => store.user);
  const [isEditing, setIsEditing] = useState(false);
  const [addressIndex, setAddressIndex] = useState(0);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    addresses: [{ building: "", street: "", city: "", state: "", postalCode: "", country: "" }],
  });

  useEffect(() => {
    if (loggedInUser) {
      setFormData({
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        addresses: loggedInUser.addresses && loggedInUser.addresses.length > 0 
          ? loggedInUser.addresses 
          : [{ building: "", street: "", city: "", state: "", postalCode: "", country: "" }],
      });
    }
  }, [loggedInUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedAddresses = [...prev.addresses];
      updatedAddresses[addressIndex] = {
        ...updatedAddresses[addressIndex],
        [name]: value
      };
      return { ...prev, addresses: updatedAddresses };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords if changing
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords don't match");
        return;
      }
      if (!formData.currentPassword) {
        toast.error("Current password is required to set a new password");
        return;
      }
    }
    
    // Remove empty addresses
    const cleanedAddresses = formData.addresses.filter(addr => 
      addr.street || addr.city || addr.state || addr.country
    );
    
    const userData = {
      name: formData.name,
      email: formData.email,
      addresses: cleanedAddresses.length > 0 ? cleanedAddresses : undefined,
      ...(formData.newPassword && {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })
    };
    
    try {
      await dispatch(updateUserProfile(userData)).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      toast.error(error?.message || "Failed to update profile");
    }
  };

  const addNewAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, { building: "", street: "", city: "", state: "", postalCode: "", country: "" }]
    }));
    setAddressIndex(formData.addresses.length);
  };

  const removeAddress = (index) => {
    if (formData.addresses.length <= 1) {
      toast.info("You must have at least one address");
      return;
    }
    
    setFormData(prev => {
      const updatedAddresses = prev.addresses.filter((_, i) => i !== index);
      return { ...prev, addresses: updatedAddresses };
    });
    
    if (addressIndex >= index && addressIndex > 0) {
      setAddressIndex(prev => prev - 1);
    }
  };

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
        <h1 className="text-3xl font-bold text-navy-900 mb-8">My Profile</h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gold-100 rounded-full p-3">
                  <IoPersonCircleOutline className="text-gold-500 w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-navy-900">{loggedInUser?.name || "Account Details"}</h2>
                  <p className="text-sm text-gray-600">{loggedInUser?.email}</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-sm bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-600 transition-colors"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 text-gray-700 disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IoMailOutline className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 text-gray-700 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Password Section */}
              {isEditing && (
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IoKeyOutline className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 text-gray-700"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 text-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Addresses */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-navy-900">Addresses</h3>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={addNewAddress}
                      className="text-sm text-gold-500 hover:text-gold-600 font-medium"
                    >
                      + Add New Address
                    </button>
                  )}
                </div>
                
                {/* Address Tabs */}
                {formData.addresses.length > 0 && (
                  <div>
                    <div className="flex border-b border-gray-100 mb-6 overflow-x-auto hide-scrollbar">
                      {formData.addresses.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setAddressIndex(index)}
                          className={`px-4 py-2 text-sm whitespace-nowrap ${
                            addressIndex === index 
                              ? "text-gold-500 border-b-2 border-gold-500 font-medium" 
                              : "text-gray-600 hover:text-navy-900"
                          }`}
                        >
                          Address {index + 1}
                          {isEditing && index > 0 && (
                            <span 
                              className="ml-2 text-red-500 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeAddress(index);
                              }}
                            >
                              &times;
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    {/* Current Address Form */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
                            Building/Apartment
                          </label>
                          <input
                            type="text"
                            id="building"
                            name="building"
                            value={formData.addresses[addressIndex]?.building || ""}
                            onChange={handleAddressChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 text-gray-700 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address
                          </label>
                          <input
                            type="text"
                            id="street"
                            name="street"
                            value={formData.addresses[addressIndex]?.street || ""}
                            onChange={handleAddressChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 text-gray-700 disabled:bg-gray-50"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.addresses[addressIndex]?.city || ""}
                            onChange={handleAddressChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 text-gray-700 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            State/Province
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.addresses[addressIndex]?.state || ""}
                            onChange={handleAddressChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 text-gray-700 disabled:bg-gray-50"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                            Postal/ZIP Code
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={formData.addresses[addressIndex]?.postalCode || ""}
                            onChange={handleAddressChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 text-gray-700 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.addresses[addressIndex]?.country || ""}
                            onChange={handleAddressChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 text-gray-700 disabled:bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {isEditing && (
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-600 transition-colors"
                >
                  <IoSaveOutline />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;