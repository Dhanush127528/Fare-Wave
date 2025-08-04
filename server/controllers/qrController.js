import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import Location from "../models/Location.js";
import haversine from "haversine-distance";

// ✅ Check-In (attach coordinates to ticket with logging)
export const checkIn = async (req, res) => {
  try {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    if (!ticket.sourceCoords || !ticket.destCoords) {
      const sourceLoc = await Location.findOne({
        $or: [{ area: ticket.source }, { city: ticket.source }],
      });
      const destLoc = await Location.findOne({
        $or: [{ area: ticket.destination }, { city: ticket.destination }],
      });

      if (!sourceLoc || !destLoc) {
        return res.status(404).json({ error: "Location coordinates not found" });
      }

      ticket.sourceCoords = sourceLoc.coordinates;
      ticket.destCoords = destLoc.coordinates;

      console.log("✅ Coordinates set during check-in:");
      console.log("Source:", ticket.sourceCoords);
      console.log("Destination:", ticket.destCoords);
    }

    ticket.checkedIn = true;
    await ticket.save();

    res.status(200).json({ message: "Checked in successfully" });
  } catch (err) {
    console.error("Check-in error:", err.message);
    res.status(500).json({ error: "Check-in failed" });
  }
};

// ✅ Check-Out using ticket's stored coordinates (with debug logging)
export const checkOut = async (req, res) => {
  try {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (!ticket.checkedIn) {
      return res.status(400).json({ error: "Ticket not checked in" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Coordinate validation with debug logging
    console.log("🧭 Validating coordinates before check-out:");
    console.log("SourceCoords:", ticket.sourceCoords);
    console.log("DestCoords:", ticket.destCoords);

    if (
      !Array.isArray(ticket.sourceCoords) ||
      !Array.isArray(ticket.destCoords) ||
      ticket.sourceCoords.length !== 2 ||
      ticket.destCoords.length !== 2
    ) {
      console.log("❌ Invalid coordinates format");
      return res.status(400).json({ error: "Ticket coordinates are invalid" });
    }

    const distance = haversine(ticket.sourceCoords, ticket.destCoords) / 1000;
    const fare = Math.round(distance * 10); // ₹10/km

    if (user.wallet < fare) {
      return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    user.wallet -= fare;
    user.coins += Math.floor(fare / 10);
    user.rideHistory.unshift({
      from: ticket.source,
      to: ticket.destination,
      fare,
      date: new Date().toISOString(),
    });

    await user.save();
    await ticket.deleteOne();

    res.status(200).json({
      from: ticket.source,
      to: ticket.destination,
      fare,
      qrData: ticket.qrData || "some-qr-string"
    });
  } catch (err) {
    console.error("Check-out error:", err.message);
    res.status(500).json({ error: "Check-out failed" });
  }
};
