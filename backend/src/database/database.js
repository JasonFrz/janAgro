const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI;

async function connectDatabase() {
  try {
    // Cek apakah URI terbaca (Debugging)
    if (!uri) {
      throw new Error("MONGO_URI tidak ditemukan di file .env");
    }

    // Opsi tambahan tidak wajib di Mongoose versi baru, tapi baik untuk diketahui
    await mongoose.connect(uri);
    
    console.log("✅ Berhasil connect ke MongoDB Atlas (Database: janAgro)");
  } catch (error) { 
    console.error("❌ Gagal connect ke MongoDB: ", error);
    process.exit(1); // Matikan server jika DB gagal connect
  }
}

async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    console.log("Berhasil disconnect MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB: ", error);
  }
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
};