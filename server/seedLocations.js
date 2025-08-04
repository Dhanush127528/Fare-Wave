import mongoose from "mongoose";
import dotenv from "dotenv";
import Location from "./models/Location.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const locations = [
  // Karnataka → Bangalore Areas
  { state: "Karnataka", city: "Bangalore", area: "Whitefield", coordinates: [12.9698, 77.7499] },
  { state: "Karnataka", city: "Bangalore", area: "Electronic City", coordinates: [12.8452, 77.6604] },
  { state: "Karnataka", city: "Bangalore", area: "Indiranagar", coordinates: [12.9719, 77.6412] },
  { state: "Karnataka", city: "Bangalore", area: "HSR Layout", coordinates: [12.9141, 77.6408] },
  { state: "Karnataka", city: "Mysore", area: null, coordinates: [12.2958, 76.6394] },
  { state: "Karnataka", city: "Bangalore", area: "Koramangala", coordinates: [12.9352, 77.6144] },


  

  // Telangana
  { state: "Telangana", city: "Hyderabad", area: null, coordinates: [17.3850, 78.4867] },

  // Tamil Nadu
  { state: "Tamil Nadu", city: "Chennai", area: null, coordinates: [13.0827, 80.2707] },

  // Maharashtra
  { state: "Maharashtra", city: "Mumbai", area: null, coordinates: [19.0760, 72.8777] },

  // Delhi
  { state: "Delhi", city: "Delhi", area: null, coordinates: [28.6139, 77.2090] },
];

await Location.insertMany(locations);
console.log("✅ Locations seeded");
process.exit();
