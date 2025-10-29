const mongoose = require("mongoose");

const CancellationSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Checkout",
      required: true,
    },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["diajukan", "disetujui", "ditolak"],
      default: "diajukan",
    },
    processedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cancellation", CancellationSchema);
