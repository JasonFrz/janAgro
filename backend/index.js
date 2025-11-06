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
const voucherRoutes = require("./src/routes/voucherRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const userRoutes = require('./src/routes/userRoutes');

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/vouchers", voucherRoutes); 
app.use("/api/admin", adminRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
