    const express = require("express");
    const app = express();
    const port = 3000;
    const cors = require("cors");
    const path = require("path");
    const { connectDatabase } = require("./src/database/database"); 

    connectDatabase(); 
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static('public'));

    const authRoutes = require("./src/routes/authRoutes");
    const productsRoutes = require("./src/routes/productsRoutes");
    const voucherRoutes = require("./src/routes/voucherRoutes");
    const adminRoutes = require("./src/routes/adminRoutes");
    const userRoutes = require('./src/routes/userRoutes');
    const cartRoutes = require('./src/routes/cartRoutes');
    const checkoutRoutes = require('./src/routes/checkoutRoutes');

    app.use("/api/auth", authRoutes);
    app.use("/api/products", productsRoutes);
    app.use("/api/vouchers", voucherRoutes); 
    app.use("/api/admin", adminRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/checkouts', checkoutRoutes);


    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
