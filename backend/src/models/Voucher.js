const mongoose = require("mongoose");

const VoucherScehma = new mongoose.Schema(
  {
    kode: { type: String, required: true },
    diskon: { type: Number, required: true },
    tanggal_kadaluarsa: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voucher", VoucherScehma);
