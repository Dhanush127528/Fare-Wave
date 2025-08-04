// src/pages/RideHistory.jsx

import useRideHistoryStore from "../store/rideHistoryStore";
import RideCard from "../components/RideCard";
import { useNavigate } from "react-router-dom";

const RideHistory = () => {
  const { rides } = useRideHistoryStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">🧾 Ride History</h1>

      {rides.length === 0 ? (
        <p className="text-center text-gray-500">No rides yet. Book your first trip!</p>
      ) : (
        <div className="space-y-4">
          {rides.map((ride, idx) => (
            <RideCard key={idx} {...ride} />
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
        >
          ⬅️ Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default RideHistory;
