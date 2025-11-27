const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");
const { logStockMovement } = require("../functions/stockMovementLogger");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "produk", 
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, 
  }
});
router.post("/add-product", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "File gambar produk wajib diunggah." });
    }

    const { name, category, price, stock, description, detail, rating } = req.body;

    const imagePath = req.file.path; 

    const productToSave = {
      name, category, price, stock, description, detail,
      rating: rating || 0,
      image: imagePath,
    };

    const newProduct = new Product(productToSave);
    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      data: savedProduct,
      message: "Produk berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error saat menambahkan produk:", error);
    res.status(500).json({ success: false, message: "An error occurred on the server." });
  }
});

router.put("/update-product/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    const oldProduct = await Product.findById(req.params.id);

    if (req.file) {
      if (oldProduct && oldProduct.image) {
         await deleteImageFromCloudinary(oldProduct.image);
      }

      updateData.image = req.file.path;
    }

    // Log stock movement if stock is being updated
    if (updateData.stock !== undefined && oldProduct) {
      const previousStock = oldProduct.stock;
      const newStock = parseInt(updateData.stock);
      const difference = newStock - previousStock;

      if (difference !== 0) {
        const movementType = difference > 0 ? "in" : "out";
        const quantity = Math.abs(difference);

        await logStockMovement(
          req.params.id,
          oldProduct.name,
          movementType,
          quantity,
          "penyesuaian",
          null,
          previousStock,
          newStock,
          `Penyesuaian stok manual dari ${previousStock} ke ${newStock}`
        );
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
    }

    res.json({
      success: true,
      data: updatedProduct,
      message: "Produk berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error saat memperbarui produk:", error);
    res.status(500).json({ success: false, message: "An error occurred on the server." });
  }
});

router.get("/get-all-products", async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.json({
      success: true,
      data: allProducts,
    });
  } catch (error) {
    console.error("Error while taking product:", error);
    res.status(500).json({ success: false, message: "An error occurred on the server." });
  }
});

router.delete("/delete-product/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    if (deletedProduct.image) {
      await deleteImageFromCloudinary(deletedProduct.image);
    }

    res.json({ success: true, message: "The product has been successfully deleted." });
  } catch (error) {
    console.error("Error while deleting product:", error);
    res.status(500).json({ success: false, message: "An error occurred on the server." });
  }
});

const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    
    const splitUrl = imageUrl.split('/');
    const filename = splitUrl.pop().split('.')[0]; 
    const folder = splitUrl.pop(); 
    const publicId = `${folder}/${filename}`;

    await cloudinary.uploader.destroy(publicId);
    console.log("Image successfully deleted from Cloudinary:", publicId);
  } catch (error) {
    console.error("Failed to delete image in Cloudinary:", error);
  }
};

module.exports = router;