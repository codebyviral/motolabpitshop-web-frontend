import React, { useState } from "react";
import { Header, Footer } from "../components/index";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "John Rider",
    email: "john.rider@example.com",
    phone: "(555) 123-4567",
    address: "123 Main Street, Anytown, USA",
    profileImage: "/api/placeholder/100/100",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [activeTab, setActiveTab] = useState("profile");

  const { LogoutUser } = useAuthContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(formData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    LogoutUser();
    navigate("/");
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
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 flex items-center"
          >
            Logout
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center">
          <img
            src={"https://i.ibb.co/2178bTsx/motolab.jpg"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400"
          />
          <div className="ml-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {user.name}
            </h2>
            <p className="text-gray-600">Member since January 2023</p>
            <div className="mt-2">
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                Premium Member
              </span>
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
                    {/* More form fields would go here */}
                  </div>
                  <div className="flex justify-end mt-6 space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(user);
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
                      <p className="text-gray-800 mt-1">{user.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Email Address
                      </h3>
                      <p className="text-gray-800 mt-1">{user.email}</p>
                    </div>
                    {/* More user info would go here */}
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                    >
                      Edit Profile
                    </button>
                  </div>

                  {/* Additional sections like password change, preferences, etc. would go here */}
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
