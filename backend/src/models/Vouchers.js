const express = require("express");
const mongoose = require("mongoose");

const VouchersScehma = new mongoose.Schema(
  {
    kode: { type: String, required: true },
    diskon: { type: Number, required: true },
    tanggal_kadaluarsa: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vouchers", VouchersScehma);
