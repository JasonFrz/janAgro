import React, { useState, useEffect } from "react";
import { ArrowLeft, Trash2, AlertCircle } from "lucide-react";

const formatPhoneInput = (value) => {
  const digits = value.replace(/\D/g, "").substring(0, 15);
  let formatted = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formatted += "-";
    }
    formatted += digits[i];
  }
  return formatted;
};

const Cart = ({
  cart,
  produk,
  user,
  vouchers,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  setPage,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [useProfileName, setUseProfileName] = useState(false);
  const [useProfileAddress, setUseProfileAddress] = useState(false);
  const [useProfilePhone, setUseProfilePhone] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user && useProfileName) setCustomerName(user.name);
    if (user && useProfileAddress) setCustomerAddress(user.alamat);
    if (user && useProfilePhone)
      setCustomerPhone(user.noTelp.replace(/\D/g, ""));
  }, [user, useProfileName, useProfileAddress, useProfilePhone]);

  const handleCheckboxChange = (type, isChecked) => {
    setError("");
    switch (type) {
      case "name":
        setUseProfileName(isChecked);
        setCustomerName(isChecked && user ? user.name : "");
        break;
      case "address":
        if (isChecked && user && !user.alamat) {
          setError(
            "Alamat profil Anda kosong. Harap isi di halaman profil atau manual."
          );
          return;
        }
        setUseProfileAddress(isChecked);
        setCustomerAddress(isChecked && user ? user.alamat : "");
        break;
      case "phone":
        if (isChecked && user && !user.noTelp) {
          setError(
            "No. Telepon profil Anda kosong. Harap isi di halaman profil atau manual."
          );
          return;
        }
        setUseProfilePhone(isChecked);
        setCustomerPhone(
          isChecked && user ? user.noTelp.replace(/\D/g, "") : ""
        );
        break;
      default:
        break;
    }
  };

  const handlePhoneChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    if (numericValue.length <= 15) {
      setCustomerPhone(numericValue);
    }
  };
  const cartDetails = cart.map((item) => ({
    ...produk.find((p) => p._id === item.productId),
    quantity: item.quantity,
  }));
  const subtotal = cartDetails.reduce(
    (sum, item) => sum + (item.quantity > 0 ? item.price * item.quantity : 0),
    0
  );
  const totalQuantity = cartDetails.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const kurirFee = 10000;

  const handleApplyVoucher = () => {
    const foundVoucher = vouchers.find(
      (v) =>
        v.code.toLowerCase() === voucherCode.toLowerCase() &&
        v.isActive &&
        v.currentUses < v.maxUses
    );
    if (foundVoucher) {
      setAppliedVoucher(foundVoucher);
      setError("");
      setSuccess(`Voucher ${foundVoucher.code} berhasil diterapkan!`);
    } else {
      setAppliedVoucher(null);
      setError("Kode voucher tidak valid, tidak aktif, atau sudah habis.");
      setSuccess("");
    }
  };
  const discountAmount = appliedVoucher
    ? (subtotal * appliedVoucher.discountPercentage) / 100
    : 0;
  const totalHarga = subtotal - discountAmount + kurirFee;

  const handleCheckoutClick = () => {
    setError("");
    if (!user) {
      setError("Silakan login untuk melanjutkan checkout.");
      return;
    }
    if (!customerName || !customerAddress || !customerPhone) {
      setError("Harap lengkapi semua detail pengiriman.");
      return;
    }
    if (customerPhone.length < 8 || customerPhone.length > 15) {
      setError("Nomor Telepon harus antara 8 hingga 15 digit.");
      return;
    }
    if (!paymentMethod) {
      setError("Silakan pilih metode pembayaran.");
      return;
    }
    if (totalQuantity === 0) {
      setError("Keranjang Anda kosong atau semua kuantitas produk adalah nol.");
      return;
    }

    const checkoutResult = onCheckout({
      userId: user.id,
      nama: customerName,
      alamat: customerAddress,
      noTelpPenerima: customerPhone,
      items: cartDetails.filter((i) => i.quantity > 0),
      subtotal,
      diskon: discountAmount,
      kodeVoucher: appliedVoucher ? appliedVoucher.code : null,
      kurir: { nama: "Kurir JanAgro", biaya: kurirFee },
      totalHarga,
      metodePembayaran: paymentMethod,
    });

    if (checkoutResult.success) {
      alert(checkoutResult.message);
    } else {
      setError(checkoutResult.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => setPage({ name: "shop" })}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition"
        >
          {" "}
          <ArrowLeft size={20} /> Lanjut Belanja{" "}
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-sm border">
              <h2 className="text-xl font-bold mb-4">
                Detail Pesanan ({totalQuantity} item)
              </h2>
              {cartDetails.length > 0 ? (
                <div className="space-y-4">
                  {cartDetails.map((item) => (
                    <div
                      key={item._id}
                      className={`flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0 ${
                        item.quantity === 0 ? "opacity-50" : ""
                      }`}
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-sm flex items-center justify-center text-4xl flex-shrink-0">
                        {item.image}
                      </div>
                      <div className="flex-grow">
                        {" "}
                        <p className="font-bold">{item.name}</p>{" "}
                        <p className="text-sm text-gray-500">
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>{" "}
                      </div>
                      <div className="flex items-center gap-2 border rounded-sm">
                        {" "}
                        <button
                          onClick={() =>
                            onUpdateQuantity(item._id, item.quantity - 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          -
                        </button>{" "}
                        <span className="px-2 font-medium">
                          {item.quantity}
                        </span>{" "}
                        <button
                          onClick={() =>
                            onUpdateQuantity(item._id, item.quantity + 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>{" "}
                      </div>
                      <p className="font-semibold w-28 text-right">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                      <button
                        onClick={() => onRemove(item._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  {" "}
                  <h3 className="text-xl font-semibold text-black">
                    Keranjang Anda Kosong
                  </h3>{" "}
                  <p className="text-gray-500 mt-2">
                    Tambahkan produk dari halaman toko untuk memulai.
                  </p>{" "}
                </div>
              )}
            </div>
            <div className="bg-white p-6 rounded-sm border">
              <h2 className="text-xl font-bold mb-4">Detail Pengiriman</h2>
              {user && (
                <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-md border">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    {" "}
                    <input
                      type="checkbox"
                      checked={useProfileName}
                      onChange={(e) =>
                        handleCheckboxChange("name", e.target.checked)
                      }
                      className="form-checkbox"
                    />{" "}
                    Gunakan nama profil{" "}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    {" "}
                    <input
                      type="checkbox"
                      checked={useProfileAddress}
                      onChange={(e) =>
                        handleCheckboxChange("address", e.target.checked)
                      }
                      className="form-checkbox"
                    />{" "}
                    Gunakan alamat profil{" "}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    {" "}
                    <input
                      type="checkbox"
                      checked={useProfilePhone}
                      onChange={(e) =>
                        handleCheckboxChange("phone", e.target.checked)
                      }
                      className="form-checkbox"
                    />{" "}
                    Gunakan no. telp profil{" "}
                  </label>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  {" "}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Penerima
                  </label>{" "}
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    disabled={useProfileName}
                    className="w-full p-3 border rounded-sm focus:ring-2 focus:ring-black disabled:bg-gray-100"
                  />{" "}
                </div>
                <div>
                  {" "}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap
                  </label>{" "}
                  <textarea
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    disabled={useProfileAddress}
                    className="w-full p-3 border rounded-sm focus:ring-2 focus:ring-black disabled:bg-gray-100"
                    rows="3"
                  ></textarea>{" "}
                </div>
                <div>
                  {" "}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon Penerima
                  </label>{" "}
                  <div className="relative">
                    {" "}
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      +62
                    </span>{" "}
                    <input
                      type="tel"
                      value={formatPhoneInput(customerPhone)}
                      onChange={handlePhoneChange}
                      disabled={useProfilePhone}
                      className="w-full pl-10 pr-4 py-3 border rounded-sm focus:ring-2 focus:ring-black disabled:bg-gray-100"
                      placeholder="812-3456-7890"
                    />{" "}
                  </div>{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-sm border sticky top-24 space-y-6">
              <h2 className="text-xl font-bold text-center mb-4">
                Ringkasan Belanja
              </h2>
              <div className="flex items-center gap-2">
                {" "}
                <input
                  type="text"
                  placeholder="Masukkan Kode Voucher"
                  value={voucherCode}
                  onChange={(e) => {
                    setVoucherCode(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  className="flex-grow p-3 border rounded-sm focus:ring-2 focus:ring-black"
                />{" "}
                <button
                  onClick={handleApplyVoucher}
                  className="bg-gray-200 text-black p-3 rounded-sm font-medium hover:bg-gray-300"
                >
                  Terapkan
                </button>{" "}
              </div>
              {success && (
                <div className="text-sm text-green-600">{success}</div>
              )}
              <div className="space-y-2 border-t pt-4">
                {" "}
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>{" "}
                {appliedVoucher && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-green-600">
                      Diskon ({appliedVoucher.discountPercentage}%)
                    </span>
                    <span className="font-medium">
                      - Rp {discountAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}{" "}
                <div className="flex justify-between">
                  <span className="text-gray-600">Biaya Kurir</span>
                  <span className="font-medium">
                    Rp {kurirFee.toLocaleString("id-ID")}
                  </span>
                </div>{" "}
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span className="text-black">Total Harga</span>
                  <span className="text-black">
                    Rp {totalHarga.toLocaleString("id-ID")}
                  </span>
                </div>{" "}
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Metode Pembayaran</h3>
                <div className="space-y-2">
                  {[
                    "COD (Bayar di Tempat)",
                    "Transfer Bank",
                    "Kartu Kredit",
                  ].map((method) => (
                    <label
                      key={method}
                      className="flex items-center p-3 border rounded-sm has-[:checked]:bg-gray-100 has-[:checked]:border-black cursor-pointer"
                    >
                      {" "}
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />{" "}
                      {method}{" "}
                    </label>
                  ))}
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
              <button
                onClick={handleCheckoutClick}
                disabled={totalQuantity === 0}
                className="w-full bg-black text-white py-4 rounded-sm font-medium text-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
