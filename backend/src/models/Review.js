const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Checkout", required: true }, 
  rating: { type: Number, required: true },
  comment: { type: String },
  media: [
    {
      url: { type: String, required: true },
      type: { type: String, enum: ['image', 'video'], default: 'image' }
    }
  ],
}, { timestamps: true });

reviewSchema.index({ product: 1, user: 1, order: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);