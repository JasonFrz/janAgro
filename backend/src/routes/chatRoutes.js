const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const { authenticateToken, isPemilik } = require("../middleware/authenticate"); // Sesuaikan path middleware Anda

// 1. User Kirim Pesan
router.post("/send", authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id; // Dari token

    let chat = await Chat.findOne({ userId });
    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    const newMessage = { sender: "user", text, timestamp: new Date() };
    chat.messages.push(newMessage);
    chat.lastMessageAt = Date.now();
    
    await chat.save();

    // REALTIME TRIGGER: Beritahu Admin
    req.io.to("admin_channel").emit("receive_message", { 
       chatId: chat._id, 
       userId: userId, 
       message: newMessage 
    });

    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Admin Balas Pesan
router.post("/admin/reply", authenticateToken, isPemilik, async (req, res) => {
  try {
    const { targetUserId, text } = req.body;

    const chat = await Chat.findOne({ userId: targetUserId });
    if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });

    const newMessage = { sender: "admin", text, timestamp: new Date() };
    chat.messages.push(newMessage);
    chat.lastMessageAt = Date.now();

    await chat.save();

    // REALTIME TRIGGER: Beritahu User Spesifik
    req.io.to(targetUserId).emit("receive_message", newMessage);

    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Get Chat Saya (User)
router.get("/my-chat", authenticateToken, async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.user.id });
    res.status(200).json({ success: true, data: chat ? chat.messages : [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Get Semua Chat (Admin)
router.get("/admin/all", authenticateToken, isPemilik, async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate("userId", "name email avatar")
      .sort({ lastMessageAt: -1 });
    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;