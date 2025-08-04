// src/components/RideCard.jsx

const RideCard = ({ from, to, fare, date }) => {
  return (
    <div className="border border-gray-300 rounded-xl shadow-sm p-4 bg-white w-full max-w-md mx-auto mb-4">
      <div className="text-lg font-semibold text-green-700">
        {from} ➡️ {to}
      </div>
      <div className="text-sm text-gray-600">📅 {date}</div>
      <div className="mt-2 text-gray-800">
        💰 Fare: ₹{fare}
      </div>
    </div>
  );
};

export default RideCard;
