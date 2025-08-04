import QRCode from "qrcode";
import Location from "../models/Location.js";

function parseMessage(message) {
  let fromMatch = message.match(/from\s+(.+?)\s+(to|towards)\s+(.+)/i);
  if (fromMatch) {
    return {
      source: fromMatch[1].trim(),
      destination: fromMatch[3].trim(),
    };
  }

  let simpleMatch = message.match(/^(.+?)\s+(to|towards)\s+(.+)$/i);
  if (simpleMatch) {
    return {
      source: simpleMatch[1].trim(),
      destination: simpleMatch[3].trim(),
    };
  }

  return { source: null, destination: null };
}

const normalize = (str) =>
  str.trim().toLowerCase().replace(/[^a-z0-9\s]/gi, "").replace(/\s+/g, " ");

export const handleUserMessage = async (req, res) => {
  const { message } = req.body;

  console.log("🟡 Received message:", message);

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const { source, destination } = parseMessage(message);

  console.log("🔍 Parsed:", { source, destination });

  if (!source || !destination || normalize(source) === normalize(destination)) {
    return res.json({
      reply: "❌ Please provide a valid source and destination.",
    });
  }

  try {
    const src = normalize(source);
    const dest = normalize(destination);

    console.log("🔤 Normalized:", { src, dest });

    const srcLocation = await Location.findOne({
      $or: [
        { area: { $regex: new RegExp(src, "i") } },
        { city: { $regex: new RegExp(src, "i") } },
      ],
    });

    const destLocation = await Location.findOne({
      $or: [
        { area: { $regex: new RegExp(dest, "i") } },
        { city: { $regex: new RegExp(dest, "i") } },
      ],
    });

    console.log("📍 Found Locations:", { srcLocation, destLocation });

    if (!srcLocation || !destLocation) {
      return res.json({
        reply: "🚫 Location not found. Please use valid names like 'Whitefield', 'Mysore'.",
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

    console.log("✅ Generated QR code for:", qrPayload);

    return res.json({
      reply: `✅ Ticket booked from ${qrPayload.source} to ${qrPayload.destination}`,
      qrCode,
    });
  } catch (err) {
    console.error("❌ Chatbot QR Error:", err);
    return res.status(500).json({ reply: "⚠️ Internal error. Please try again later." });
  }
};
