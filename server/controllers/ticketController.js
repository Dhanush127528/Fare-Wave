import Ticket from "../models/Ticket.js";

// Create a new ticket and save as a Ticket document
export const createTicket = async (req, res) => {
  try {
    const { from, to, fare, qrData } = req.body;

    if (!from || !to || !fare || !qrData) {
      return res.status(400).json({ error: "Missing ticket details" });
    }

    // Create and save the ticket as a document
    const ticket = new Ticket({
      user: req.user._id,
      source: from,
      destination: to,
      fare,
      qrData,
    });

    await ticket.save();

    res.status(201).json({ message: "Ticket created", ticketId: ticket._id, ticket });
  } catch (err) {
    console.error("Create ticket error:", err.message);
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

// Fetch all tickets for the authenticated user
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ tickets });
  } catch (err) {
    console.error("Get tickets error:", err.message);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};