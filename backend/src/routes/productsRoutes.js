const express = require("express");
const router = express.Router();
const Products = require("../models/Product");

router.get("/get-all-products", async (req, res) => {
  try {
    const getAllProducts = await Products.find();
    res.json({
      success: true,
      data: getAllProducts,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
