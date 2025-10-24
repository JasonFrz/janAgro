const express = require("express");
const router = express.Router();
const Products = require("../models/Products");

router.get("/get-all-products", (req, res) => {
  try {
    const getAllProducts = Products.find();
    res.json({
      success: true,
      data: getAllProducts,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
