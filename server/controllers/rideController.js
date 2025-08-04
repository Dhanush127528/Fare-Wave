import User from "../models/User.js";
import Location from "../models/Location.js";
import haversine from "../utils/fareCalculator.js";

// 📌 GET Ride History
export const getRideHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const rideHistory = user.rideHistory || [];
    res.status(200).json({ rideHistory });
  } catch (err) {
    console.error("Ride history error:", err.message);
    res.status(500).json({ error: "Failed to fetch ride history" });
  }
};

// 📌 POST Add Ride
export const addRide = async (req, res) => {
  try {
    const { fromCity, fromArea, toCity, toArea } = req.body;

    if (!fromCity || !toCity) {
      return res.status(400).json({ error: "Missing from or to details" });
    }

    // 🔍 Build queries conditionally for area
    const sourceQuery = { city: fromCity };
    if (fromArea) sourceQuery.area = fromArea;
    const destQuery = { city: toCity };
    if (toArea) destQuery.area = toArea;

    const source = await Location.findOne(sourceQuery);
    const destination = await Location.findOne(destQuery);

    if (!source || !destination) {
      return res.status(404).json({ error: "Location(s) not found" });
    }

    // 🧮 Calculate fare using coordinates
    const distance = haversine(source.coordinates, destination.coordinates); // in km
    const fare = Math.round(distance * 5); // ₹5 per km

    // 💰 Update user
    const user = await User.findById(req.user._id);
    if (!user || user.wallet < fare) {
      return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    user.wallet -= fare;
    user.coins += Math.floor(fare / 10); // reward coins
    user.rideHistory.unshift({
      from: fromArea ? `${fromArea}, ${fromCity}` : fromCity,
      to: toArea ? `${toArea}, ${toCity}` : toCity,
      fare,
      date: new Date().toISOString(),
    });

    await user.save();

    res.status(200).json({
      message: "✅ Ride added & fare deducted",
      ride: user.rideHistory[0],
      wallet: user.wallet,
      coins: user.coins,
    });
  } catch (err) {
    console.error("Add ride error:", err.message);
    res.status(500).json({ error: "Failed to add ride" });
  }
};