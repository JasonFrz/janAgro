const express = require("express");
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  use_voucher: {
    use: { type: Boolean, default: false },
    code: { type: mongoose.Schema.Types.ObjectId, ref: "Vouchers" },
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
