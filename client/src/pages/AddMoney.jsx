import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import { FaWallet } from "react-icons/fa";

const AddMoney = () => {
  const navigate = useNavigate();
  const { wallet, setWallet } = useUserStore();
  const [amount, setAmount] = useState("");

  const handleAdd = () => {
    const num = parseInt(amount);
    if (!num || num <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    setWallet(wallet + num);
    alert(`✅ ₹${num} added to your wallet!`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-6 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
          <FaWallet /> Add Money
        </h2>

        <p className="text-gray-600 mb-2 font-medium">
          Current Wallet Balance: <span className="text-green-700 font-bold">₹{wallet}</span>
        </p>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-green-300 p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={handleAdd}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          ➕ Add Money
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 w-full text-sm text-gray-500 underline"
        >
          ← Go back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AddMoney;
