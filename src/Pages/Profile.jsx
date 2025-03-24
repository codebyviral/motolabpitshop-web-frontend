import React, { useEffect, useState } from "react";
import { Header, Footer } from "../components/index";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: [],
    profileImage: "/api/placeholder/100/100",
    isVerified: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [addressData, setAddressData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
  });
  const [activeTab, setActiveTab] = useState("profile");

  const { LogoutUser } = useAuthContext();
  const backendUrl = import.meta.env.VITE_BACKEND;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.user;
        
        // Extract address details if available
        const addressDetails = userData.address && userData.address.length > 0 
          ? userData.address[0] 
          : { addressLine1: "", addressLine2: "", city: "", state: "", pinCode: "" };

        setUser({
          name: userData.fullName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || [],
          profileImage: userData.profileImage || "/api/placeholder/100/100",
          isVerified: userData.isVerified,
        });

        setFormData({
          name: userData.fullName || "",
          email: userData.email || "",
        });

        setAddressData({
          addressLine1: addressDetails.addressLine1 || "",
          addressLine2: addressDetails.addressLine2 || "",
          city: addressDetails.city || "",
          state: addressDetails.state || "",
          pinCode: addressDetails.pinCode || "",
          phone: userData.phone || "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user data");
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${backendUrl}/api/auth/updateuser`,
        {
          fullName: formData.name,
          email: formData.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setUser((prev) => ({
          ...prev,
          name: formData.name,
          email: formData.email,
        }));
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.msg || "Failed to update profile");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format address as an array of objects as expected by the backend
      const formattedAddress = [{
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2,
        city: addressData.city,
        state: addressData.state,
        pinCode: addressData.pinCode
      }];

      const response = await axios.put(
        `${backendUrl}/api/auth/updateuser`,
        {
          address: formattedAddress,
          phone: addressData.phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setUser((prev) => ({
          ...prev,
          address: formattedAddress,
          phone: addressData.phone,
        }));
        setIsEditingAddress(false);
        toast.success("Address updated successfully!");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error(error.response?.data?.msg || "Failed to update address");
    }
  };

  const handleLogout = () => {
    LogoutUser();
    navigate("/");
  };

  // Format address for display
  const getFormattedAddress = () => {
    if (user.address && user.address.length > 0) {
      const addr = user.address[0];
      const parts = [
        addr.addressLine1,
        addr.addressLine2,
        addr.city,
        addr.state,
        addr.pinCode
      ].filter(part => part && part.trim() !== '');
      
      return parts.join(', ');
    }
    return "No address saved";
  };

  const orderHistory = [
    {
      id: "#M12345",
      date: "2025-03-10",
      total: "$249.99",
      status: "Delivered",
    },
    { id: "#M12289", date: "2025-02-22", total: "$89.95", status: "Shipped" },
    {
      id: "#M12100",
      date: "2025-02-05",
      total: "$356.45",
      status: "Processing",
    },
  ];

  const wishlistItems = [
    {
      id: 1,
      name: "Akrapovic Exhaust System",
      price: "$899.99",
      image: "/api/placeholder/60/60",
    },
    {
      id: 2,
      name: "Alpinestars Tech-Air Race Vest",
      price: "$699.99",
      image: "/api/placeholder/60/60",
    },
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 flex items-center"
          >
            Logout
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center">
          <img
            src={import.meta.env.VITE_MOTOLAB_LOGO}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400"
          />
          <div className="ml-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {user.name}
            </h2>
            <p className="text-gray-600">Member since January 2023</p>
            <div className="mt-2">
              {user.isVerified ? (
                <span
                  onClick={() => toast.success(`We trust you! 🏍️`)}
                  className="bg-yellow-400 text-black text-xs font-medium px-2.5 py-0.5 rounded-full mr-2"
                >
                  Verified
                </span>
              ) : (
                <span
                  onClick={() => navigate(`/verify-account`)}
                  className="bg-red-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2"
                >
                  Not Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                className={`inline-block p-4 ${
                  activeTab === "profile"
                    ? "text-yellow-600 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile Details
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 ${
                  activeTab === "orders"
                    ? "text-yellow-600 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("orders")}
              >
                Order History
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 ${
                  activeTab === "wishlist"
                    ? "text-yellow-600 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("wishlist")}
              >
                Wishlist
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 ${
                  activeTab === "Address"
                    ? "text-yellow-600 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("Address")}
              >
                Address
              </button>
            </li>
          </ul>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Profile Details Tab */}
          {activeTab === "profile" && (
            <>
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                        });
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Full Name
                      </h3>
                      <p className="text-gray-800 mt-1">
                        {user.name || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Email Address
                      </h3>
                      <p className="text-gray-800 mt-1">
                        {user.email || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                    >
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Order History Tab */}
          {activeTab === "orders" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="py-2 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="py-2 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="py-2 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-2 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orderHistory.map((order) => (
                      <tr key={order.id}>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {order.id}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {order.date}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {order.total}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <button className="text-blue-600 hover:text-blue-800">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">My Wishlist</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center p-4 border rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover"
                    />
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-yellow-600">{item.price}</p>
                    </div>
                    <button className="px-3 py-1 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === "Address" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Saved Address</h3>
              {isEditingAddress ? (
                <form onSubmit={handleAddressSubmit}>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="addressLine1"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Address Line 1
                        </label>
                        <input
                          type="text"
                          id="addressLine1"
                          name="addressLine1"
                          value={addressData.addressLine1}
                          onChange={handleAddressChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="addressLine2"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          id="addressLine2"
                          name="addressLine2"
                          value={addressData.addressLine2}
                          onChange={handleAddressChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={addressData.city}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="state"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            State
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={addressData.state}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="pinCode"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            PIN Code
                          </label>
                          <input
                            type="text"
                            id="pinCode"
                            name="pinCode"
                            value={addressData.pinCode}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={addressData.phone}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4 space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingAddress(false);
                          // Reset to current values
                          const currentAddress = user.address && user.address.length > 0 
                            ? user.address[0] 
                            : { addressLine1: "", addressLine2: "", city: "", state: "", pinCode: "" };
                          
                          setAddressData({
                            addressLine1: currentAddress.addressLine1 || "",
                            addressLine2: currentAddress.addressLine2 || "",
                            city: currentAddress.city || "",
                            state: currentAddress.state || "",
                            pinCode: currentAddress.pinCode || "",
                            phone: user.phone || "",
                          });
                        }}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Primary Address
                      </h4>
                      <p className="text-gray-600 mt-1">
                        {getFormattedAddress()}
                      </p>
                      <p className="text-gray-600">
                        {user.phone || "No phone number saved"}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;