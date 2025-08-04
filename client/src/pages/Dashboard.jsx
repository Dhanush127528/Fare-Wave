import React, { useState, useEffect } from "react";
import { FaBus, FaUser, FaTicketAlt } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import MapComponent from "../components/MapComponent";
import useUserStore from "../store/userStore";
import { useRouteStore } from "../store/routeStore";
import useRideHistoryStore from "../store/rideHistoryStore";
import useAuthStore from "../store/authStore";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Chatbot from "../components/Chatbot";

const Dashboard = () => {
  const { token } = useAuthStore();
  const { user, setUser, wallet, coins, setWallet } = useUserStore(); // 🟢 updated here
  const { rides, setRideHistory } = useRideHistoryStore();
  const { route } = useRouteStore();
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState(0);
  const [showChatbotModal, setShowChatbotModal] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        setCurrentLocation({ lat: 12.9716, lng: 77.5946 });
      }
    );
  }, []);

  // 🚀 Fetch user + ride data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser({
          name: data.message.split(",")[1]?.trim(),
        }); // 🟢 updated here
        setWallet(data.wallet);
        const historyRes = await fetch("http://localhost:5000/api/user/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const historyData = await historyRes.json();
        setRideHistory(historyData.rideHistory || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [token, setUser, setWallet, setRideHistory]); // 🟢 updated dependencies

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleAddMoney = async () => {
    const amt = parseInt(amountToAdd);
    if (!isNaN(amt) && amt > 0) {
      try {
        const res = await fetch("http://localhost:5000/api/user/wallet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: amt }),
        });

        const data = await res.json();
        setWallet(data.wallet);
        toast.success("Wallet updated!");
        setShowAddMoney(false);
        setAmountToAdd(0);
      } catch (err) {
        toast.error("Failed to add money.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-100 p-4 relative overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-2">
        <img src={logo} alt="logo" className="h-10 w-10" />
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/scan-qr")}
            className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg font-semibold text-sm shadow"
          >
            🎟️ Scan Ticket
          </button>
          <FaUser
            className="text-2xl text-green-800 cursor-pointer"
            onClick={() => setDrawerOpen(true)}
          />
        </div>
      </div>

      {/* Map */}
      {currentLocation ? (
        <div className="h-[300px] w-full mb-4 rounded-xl overflow-hidden relative z-0">
          <MapComponent
            source={
              route?.src
                ? [route.src.lat, route.src.lng]
                : [currentLocation.lat, currentLocation.lng]
            }
            destination={route?.dest || null}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading map...</p>
      )}

      {/* Greeting */}
      <h2 className="text-xl font-semibold mb-4 text-green-700">
        Welcome back, {user?.name} 👋
      </h2>

      {/* [REMOVED NOTHING BELOW THIS POINT — ALL YOUR 347 LINES KEPT] */}


      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div
          onClick={() => {
            if (wallet < 500) {
              alert("⚠️ Please recharge your wallet to book a ticket.");
            } else {
              navigate("/book-ticket");
            }
          }}
          className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <FaTicketAlt />
            <span>Book Ticket</span>
          </div>
          <p className="text-sm text-gray-500">Plan your next ride</p>
        </div>

        <div
          onClick={() => navigate("/track-me")}
          className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <FaBus />
            <span>Track Me</span>
          </div>
          <p className="text-sm text-gray-500">Live bus status</p>
        </div>
      </div>

      {/* Wallet */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-gray-700">Wallet Balance</h4>
            <p className="text-2xl text-green-700 font-bold">₹{wallet}</p>
          </div>
          <button
            onClick={() => setShowAddMoney(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
          >
            + Add Money
          </button>
        </div>
      </div>

      {/* Add Money Modal */}
      <AnimatePresence>
        {showAddMoney && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm"
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Add Money
              </h2>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter amount"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(e.target.value)}
              />
              <div className="flex justify-between">
                <button
                  onClick={handleAddMoney}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddMoney(false)}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invite Section */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Invite Your Friends</h4>
        <p className="text-sm text-gray-500 mb-3">
          🎁 Get rewards when they ride
        </p>
        <button
          onClick={() => {
            const link = `https://farewave.com/invite?ref=${name?.toLowerCase().replace(/\s/g, "") || "farewave"}`;
            navigator.clipboard.writeText(link);
            toast.success("Invite link copied!");
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          🔗 Copy Invite Link
        </button>
      </div>

      {/* FareWave Coins */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h4 className="font-semibold text-gray-700">FareWave Coins</h4>
        <p className="text-orange-600 font-bold text-lg">🪙 {coins} Coins</p>
      </div>

      {/* Floating Chatbot */}
      <button
        onClick={() => setShowChatbotModal(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
      >
        <IoIosChatbubbles size={24} />
      </button>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {showChatbotModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md h-[450px] flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  💬 FareWave Assistant
                </h2>
                <button
                  onClick={() => setShowChatbotModal(false)}
                  className="text-gray-500 text-xl font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1">
                <Chatbot />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 right-0 w-full sm:w-[60%] h-full bg-white shadow-2xl px-6 py-4 z-[999] flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                <FaUser /> {name}
              </h3>
              <button
                className="text-gray-500 text-xl font-bold"
                onClick={() => setDrawerOpen(false)}
              >
                ✕
              </button>
            </div>
            <h4 className="text-md font-semibold mb-2 text-gray-700 border-b pb-2">
              🧾 Ride History
            </h4>
            <div className="flex-1 overflow-y-auto space-y-4 mt-2 pr-1">
              {rides.length === 0 ? (
                <p className="text-sm text-gray-500">No rides yet.</p>
              ) : (
                rides.map((ride, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 p-4 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-green-800 font-medium text-sm mb-1">
                      <FaBus className="text-green-600" />
                      {ride.from} ➡ {ride.to}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{ride.date}</p>
                    <p className="text-sm font-semibold text-green-700">
                      Fare: ₹{ride.fare}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition font-semibold"
              >
                🚪 Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
