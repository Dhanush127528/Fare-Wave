import express from "express";
import Location from "../models/Location.js";

const router = express.Router();

// Get all locations
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// Get cities by state
router.get("/cities/:state", async (req, res) => {
  try {
    const { state } = req.params;
    const cities = await Location.find({ state }).distinct("city");
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});

// Get areas by city
router.get("/areas/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const areas = await Location.find({ city, area: { $ne: null } }).distinct("area");
    res.json(areas);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch areas" });
  }
});

export default router;
