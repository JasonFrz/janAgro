const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI;
console.log(uri);

async function connectDatabase() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) { 
    console.error("Error connecting to MongoDB: ", error);
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
