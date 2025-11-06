import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, AlertCircle, CheckCircle } from "lucide-react";

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

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 p-4 rounded-md shadow-lg flex items-center gap-3 transition-transform animate-fade-in-down ${bgColor} text-white`}
    >
      <Icon size={20} /> <span>{message}</span>
    </div>
  );
};

const Cart = ({
  cart,
  produk,
  user,
  vouchers,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  console.log("PROPS received in Cart.jsx -> cart:", cart);
  console.log("PROPS received in Cart.jsx -> produk:", produk);

  const [useProfileName, setUseProfileName] = useState(false);
  const [useProfileAddress, setUseProfileAddress] = useState(false);
  const [useProfilePhone, setUseProfilePhone] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const onCloseNotification = useCallback(() => {
    setNotification({ message: "", type: "" });
  }, []);
  useEffect(() => {
    if (user) {
      if (useProfileName) setCustomerName(user.name || "");
      if (useProfileAddress) setCustomerAddress(user.alamat || "");
      if (useProfilePhone)
        setCustomerPhone(user.no_telp ? user.no_telp.replace(/\D/g, "") : "");
    }
  }, [user, useProfileName, useProfileAddress, useProfilePhone]);

  const handleCheckboxChange = (type, isChecked) => {
    setError("");
    onCloseNotification();
    switch (type) {
      case "name":
        setUseProfileName(isChecked);
        setCustomerName(isChecked && user ? user.name || "" : "");
        break;
      case "address":
        if (isChecked && user && !user.alamat) {
          setError(
            "Alamat profil Anda kosong. Harap isi di halaman profil atau manual."
          );
          setUseProfileAddress(false);
          return;
        }
        setUseProfileAddress(isChecked);
        setCustomerAddress(isChecked && user ? user.alamat || "" : "");
        break;
      case "phone":
        if (isChecked && user && !user.no_telp) {
          setError(
            "No. Telepon profil Anda kosong. Harap isi di halaman profil atau manual."
          );
          setUseProfilePhone(false);
          return;
        }
        setUseProfilePhone(isChecked);
        setCustomerPhone(
          isChecked && user
            ? user.no_telp // <-- Gunakan underscore
              ? user.no_telp.replace(/\D/g, "")
              : ""
            : ""
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
    if (error.includes("Nomor Telepon")) setError("");
  };

// File: Cart.jsx

const cartDetails = cart
  .map((item) => {
    let productData;

    // Cek apakah productId adalah objek (sudah di-populate)
    if (item.productId && typeof item.productId === 'object') {
      productData = item.productId;
    } 
    // Jika bukan objek, berarti itu string ID. Cari di prop 'produk'.
    else if (item.productId) {
      productData = produk.find(p => p._id === item.productId);
    }

    // Jika setelah semua usaha produk tidak ditemukan, jangan render item ini.
    if (!productData) {
      return null;
    }

    // Gabungkan data produk yang ditemukan dengan kuantitas dari keranjang.
    return {
      ...productData,
      quantity: item.quantity,
    };
  })
  .filter(Boolean); // <-- Ini akan menghapus semua item yang 'null'

  const subtotal = cartDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalQuantity = cartDetails.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const kurirFee = 10000;

  const handleApplyVoucher = () => {
    setError("");
    onCloseNotification();
    const foundVoucher = vouchers.find(
      (v) =>
        v.code.toLowerCase() === voucherCode.toLowerCase() &&
        v.isActive &&
        v.currentUses < v.maxUses
    );
    if (foundVoucher) {
      setAppliedVoucher(foundVoucher);
      setNotification({
        message: `Voucher ${foundVoucher.code} berhasil diterapkan!`,
        type: "success",
      });
    } else {
      setAppliedVoucher(null);
      setError("Kode voucher tidak valid, tidak aktif, atau sudah habis.");
    }
  };

  const discountAmount = appliedVoucher
    ? (subtotal * appliedVoucher.discountPercentage) / 100
    : 0;
  const totalHarga = subtotal - discountAmount + kurirFee;

  const handleCheckoutClick = async () => {
    setError("");
    onCloseNotification();

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
      setError("Keranjang Anda kosong.");
      return;
    }

    const checkoutData = {
      userId: user._id,
      nama: customerName,
      alamat: customerAddress,
      noTelpPenerima: customerPhone,
      items: cartDetails,
      subtotal,
      diskon: discountAmount,
      kodeVoucher: appliedVoucher ? appliedVoucher.code : null,
      kurir: { nama: "Kurir JanAgro", biaya: kurirFee },
      totalHarga,
      metodePembayaran: paymentMethod,
    };

    try {
      const checkoutResult = await onCheckout(checkoutData);
      if (checkoutResult.success) {
        setNotification({
          message: "Pesanan berhasil dibuat! Terima kasih.",
          type: "success",
        });
      } else {
        setError(checkoutResult.message || "Terjadi kesalahan saat checkout.");
        setNotification({
          message: checkoutResult.message || "Checkout gagal.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Terjadi kesalahan sistem atau jaringan.");
      setNotification({
        message: "Terjadi kesalahan saat memproses pesanan Anda.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={onCloseNotification}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/shop"
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition"
        >
          <ArrowLeft size={20} /> Lanjut Belanja
        </Link>
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
                      className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-sm flex items-center justify-center text-4xl flex-shrink-0">
                        {item.image}
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 border rounded-sm">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item._id, item.quantity - 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-2 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item._id, item.quantity + 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
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
                  <h3 className="text-xl font-semibold text-black">
                    Keranjang Anda Kosong
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Tambahkan produk dari halaman toko untuk memulai.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-sm border">
              <h2 className="text-xl font-bold mb-4">Detail Pengiriman</h2>
              {user && (
                <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-md border">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={useProfileName}
                      onChange={(e) =>
                        handleCheckboxChange("name", e.target.checked)
                      }
                      className="form-checkbox"
                    />
                    Gunakan nama profil
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={useProfileAddress}
                      onChange={(e) =>
                        handleCheckboxChange("address", e.target.checked)
                      }
                      className="form-checkbox"
                    />
                    Gunakan alamat profil
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={useProfilePhone}
                      onChange={(e) =>
                        handleCheckboxChange("phone", e.target.checked)
                      }
                      className="form-checkbox"
                    />
                    Gunakan no. telp profil
                  </label>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Penerima
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    disabled={useProfileName}
                    className="w-full p-3 border rounded-sm focus:ring-2 focus:ring-black disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap
                  </label>
                  <textarea
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    disabled={useProfileAddress}
                    className="w-full p-3 border rounded-sm focus:ring-2 focus:ring-black disabled:bg-gray-100"
                    rows="3"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon Penerima
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      +62
                    </span>
                    <input
                      type="tel"
                      value={formatPhoneInput(customerPhone)}
                      onChange={handlePhoneChange}
                      disabled={useProfilePhone}
                      className="w-full pl-10 pr-4 py-3 border rounded-sm focus:ring-2 focus:ring-black disabled:bg-gray-100"
                      placeholder="812-3456-7890"
                    />
                  </div>
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
                <input
                  type="text"
                  placeholder="Masukkan Kode Voucher"
                  value={voucherCode}
                  onChange={(e) => {
                    setVoucherCode(e.target.value);
                    setError("");
                    onCloseNotification();
                  }}
                  className="flex-grow p-3 border rounded-sm focus:ring-2 focus:ring-black"
                />
                <button
                  onClick={handleApplyVoucher}
                  className="bg-gray-200 text-black p-3 rounded-sm font-medium hover:bg-gray-300"
                >
                  Terapkan
                </button>
              </div>
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                {appliedVoucher && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon ({appliedVoucher.discountPercentage}%)</span>
                    <span className="font-medium">
                      - Rp {discountAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Biaya Kurir</span>
                  <span className="font-medium">
                    Rp {kurirFee.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total Harga</span>
                  <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Metode Pembayaran</h3>
                <div className="space-y-2">
                  {[
                    { label: "COD (Bayar di Tempat)", value: "COD" }, // Nilai yang dikirim: "COD"
                    { label: "Transfer Bank", value: "Transfer Bank" },
                    { label: "Kartu Kredit", value: "Kartu Kredit" },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className="flex items-center p-3 border rounded-sm has-[:checked]:bg-gray-100 has-[:checked]:border-black cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value);
                          if (error.includes("metode pembayaran")) setError("");
                        }}
                        className="mr-3"
                      />
                      {method.label}
                    </label>
                  ))}
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                  <AlertCircle size={16} /> {error}
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
