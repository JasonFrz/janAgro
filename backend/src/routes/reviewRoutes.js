const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Product = require("../models/Product");
const { authenticateToken } = require("../middleware/authenticate");
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
    folder: "reviews",
    resource_type: "auto", 
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov"], 
  },
});

const upload = multer({ storage: storage });

router.post("/add", authenticateToken, upload.array("media", 6), async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!productId || !rating) {
      return res.status(400).json({ success: false, message: "Product ID and Rating are required." });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    let mediaFiles = [];
    if (req.files && req.files.length > 0) {
      mediaFiles = req.files.map((file) => ({
        url: file.path,
        type: file.mimetype.startsWith("video") ? "video" : "image", 
      }));
    }

    const newReview = new Review({
      user: userId,
      product: productId,
      rating: Number(rating),
      comment: comment || "",
      media: mediaFiles, 
    });

    const savedReview = await newReview.save();
    
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    
    productExists.rating = avgRating; 
    await productExists.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data: savedReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: "Server error while adding review." });
  }
});

router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name avatar email") 
      .sort({ createdAt: -1 }); 

    const formattedReviews = reviews.map((r) => ({
      _id: r._id,
      userId: r.user?._id,
      userName: r.user?.name || "Anonymous",
      userAvatar: r.user?.avatar || null, 
      rating: r.rating,
      comment: r.comment,
      media: r.media, 
      createdAt: r.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formattedReviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Server error fetching reviews." });
  }
});


router.get("/all", authenticateToken, async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "name avatar email")
      .populate("product", "name image price category") 
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ success: false, message: "Server error fetching reviews." });
  }
});

module.exports = router;
