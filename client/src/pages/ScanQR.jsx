import { useState } from "react";
import { useRideStore } from "../store/rideStore";
import useUserStore from "../store/userStore";
import useRideHistoryStore from "../store/rideHistoryStore";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";

const cityDistances = {
  "Bangalore-Mysore": 150,
  "Mysore-Bangalore": 150,
  "Bangalore-Hyderabad": 570,
  "Hyderabad-Bangalore": 570,
  "Bangalore-Chennai": 350,
  "Chennai-Bangalore": 350,
  "Mysore-Hyderabad": 720,
  "Hyderabad-Mysore": 720,
  "Mysore-Chennai": 480,
  "Chennai-Mysore": 480,
  "Hyderabad-Chennai": 630,
  "Chennai-Hyderabad": 630,
};

const calculateFare = (from, to) => {
  const key = `${from}-${to}`;
  const reverseKey = `${to}-${from}`;
  const distance = cityDistances[key] || cityDistances[reverseKey] || 0;
  const ratePerKm = 2;
  return distance * ratePerKm;
};

const normalize = (str) =>
  str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();

const ScanQR = () => {
  const [scanned, setScanned] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [qrFile, setQrFile] = useState(null);

  const { status, checkIn, checkOut, resetRide } = useRideStore();
  const { deductFare, addCoins } = useUserStore();
  const { addRide } = useRideHistoryStore();
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrFile(file);
    }
  };

  const handleScan = async () => {
    if (!qrFile) {
      setErrorMsg("❌ Please upload a QR code file.");
      return;
    }

    const imageBitmap = await createImageBitmap(qrFile);
    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imageBitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const qrCodeData = jsQR(imageData.data, imageData.width, imageData.height);
    if (!qrCodeData) {
      setErrorMsg("❌ Could not decode QR code. Try again.");
      return;
    }

    const decodedText = qrCodeData.data;

    try {
      if (!decodedText.includes("FareWaveTicket")) {
        throw new Error("Invalid format");
      }

      const parts = decodedText.split("|").map((p) => p.trim());
      const from = normalize(parts[1]?.split(":")[1] || "");
      const to = normalize(parts[2]?.split(":")[1] || "");
      console.log("QR Scan →", from, to); // ✅ Debug

      if (!from || !to) {
        throw new Error("Missing source or destination");
      }

      const time = Date.now();

      if (!scanned && status === "idle") {
        checkIn({ from, to, time });
        setScanned(true);
        setErrorMsg("");
        alert(`✅ Checked in: ${from} to ${to}`);
      } else if (scanned && status === "checkedIn") {
        const fare = calculateFare(from, to);
        deductFare(fare);
        checkOut(Date.now());

        addRide({
          from,
          to,
          fare,
          date: new Date().toLocaleString(),
        });

        const earnedCoins = 5;
        addCoins(earnedCoins);

        setScanned(false);
        setErrorMsg("");
        alert(`✅ Checked out! ₹${fare} has been deducted. 🪙 You earned +${earnedCoins} coins!`);
        resetRide();
        navigate("/dashboard");
      } else {
        setErrorMsg("⚠️ Invalid scan flow. Please retry.");
      }
    } catch (err) {
      console.error("QR Decode Error:", err);
      setErrorMsg("❌ Invalid QR code format.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-center px-4 py-10">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-extrabold text-green-700 mb-3 animate-pulse">
          🎫 Scan Your FareWave Ticket
        </h2>
        <p className="text-gray-600 text-base max-w-md mx-auto">
          Upload your QR code image to <strong>Check In</strong> or <strong>Check Out</strong>.
        </p>
      </div>

      <div className="my-4">
        <label
          htmlFor="qr-upload"
          className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Upload QR Code Image
        </label>
        <input
          id="qr-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
        />
      </div>

      {qrFile && (
        <div className="my-4">
          <img
            src={URL.createObjectURL(qrFile)}
            alt="QR Preview"
            className="w-48 h-48 object-contain mx-auto"
          />
        </div>
      )}

      <button
        onClick={handleScan}
        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all"
      >
        {scanned ? "Scan to Check-Out" : "Scan to Check-In"}
      </button>

      {errorMsg && (
        <div className="mt-6 bg-red-100 text-red-700 px-4 py-3 rounded-lg shadow-md text-center">
          {errorMsg}
        </div>
      )}

      {scanned && (
        <div className="mt-6">
          <button
            onClick={() => {
              setScanned(false);
              setQrFile(null);
              setErrorMsg("");
            }}
            className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-400 transition"
          >
            🔁 Retry Scan
          </button>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition"
        >
          ⬅️ Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ScanQR;
