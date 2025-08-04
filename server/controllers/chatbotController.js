import QRCode from "qrcode";
import Location from "../models/Location.js";

// ✨ Improved NLP extraction with better pattern
function parseMessage(message) {
  const fromMatch = message.match(/from\s+(.+?)\s+(to|towards)/i);
  const toMatch = message.match(/to\s+(.+)/i);

  const source = fromMatch?.[1]?.trim();
  const destination = toMatch?.[1]?.trim();

  return { source, destination };
}

// Normalize input string
const normalize = (str) =>
  str.trim().toLowerCase().replace(/[^a-z0-9\s]/gi, "").replace(/\s+/g, " ");

export const handleUserMessage = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const { source, destination } = parseMessage(message);

  if (
    !source ||
    !destination ||
    normalize(source) === normalize(destination) ||
    source.length < 2 ||
    destination.length < 2
  ) {
    return res.json({
      reply: "❌ Please provide a valid source and destination.",
    });
  }

  try {
    const src = normalize(source);
    const dest = normalize(destination);

    // 🔍 Match with loose regex on city and area
    const srcLocation = await Location.findOne({
      $or: [
        { area: { $regex: new RegExp(`\\b${src}\\b`, "i") } },
        { city: { $regex: new RegExp(`\\b${src}\\b`, "i") } },
      ],
    });

    const destLocation = await Location.findOne({
      $or: [
        { area: { $regex: new RegExp(`\\b${dest}\\b`, "i") } },
        { city: { $regex: new RegExp(`\\b${dest}\\b`, "i") } },
      ],
    });

    if (!srcLocation || !destLocation) {
      return res.json({
        reply: "🚫 Location not found. Please provide valid source and destination.",
      });
    }

    const qrPayload = {
      source: srcLocation.area || srcLocation.city,
      destination: destLocation.area || destLocation.city,
      sourceCoords: srcLocation.coordinates,
      destCoords: destLocation.coordinates,
      timestamp: Date.now(),
    };

    const qrCode = await QRCode.toDataURL(JSON.stringify(qrPayload));

    return res.json({
      reply: `✅ Ticket booked from ${qrPayload.source} to ${qrPayload.destination}`,
      qrCode,
    });
  } catch (err) {
    console.error("Chatbot QR Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
