const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const { connectDatabase } = require("./src/database/database"); // <-- Import this

// Connect to MongoDB
connectDatabase(); // <-- Call this

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const authRoutes = require("./src/routes/authRoutes");
const productsRoutes = require("./src/routes/productsRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
