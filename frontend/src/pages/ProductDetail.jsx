import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  ArrowLeft,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Truck,
} from "lucide-react";

// SERVER_URL tidak lagi dibutuhkan untuk gambar Cloudinary
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
// const SERVER_URL = API_URL.replace("/api", "");

const Notification = ({ message, type }) => {
  if (!message) return null;
  const isError = type === "error";
  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 p-4 rounded-md shadow-lg flex items-center gap-3 transition-transform animate-fade-in-down ${
        isError ? "bg-red-600 text-white" : "bg-green-600 text-white"
      }`}
    >
      {isError ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
      <span>{message}</span>
    </div>
  );
};

const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }
      />
    ))}
  </div>
);

const ProductDetail = ({
  product,
  reviews,
  users,
  user,
  onAddToCart,
  cartCount,
}) => {
  const [ratingFilter, setRatingFilter] = useState(0);
  const [mediaFilter, setMediaFilter] = useState("all");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAddToCartClick = async (productId) => {
    if (product.stock === 0) {
      setNotification({
        type: "error",
        message: "Produk ini sedang tidak tersedia (Stok Habis).",
      });
      return;
    }
    if (!user) {
      setNotification({
        type: "error",
        message: "Silakan login terlebih dahulu.",
      });
      return;
    }

    const resultMessage = await onAddToCart(productId);
    const messageType = resultMessage.toLowerCase().includes("gagal")
      ? "error"
      : "success";
    setNotification({ type: messageType, message: resultMessage });
  };

  const filteredReviews = reviews
    .filter((r) => r.productId === product._id)
    .filter((r) => ratingFilter === 0 || r.rating === ratingFilter)
    .filter(
      (r) =>
        mediaFilter === "all" ||
        (mediaFilter === "dengan-media" && r.imageUrl) ||
        (mediaFilter === "tanpa-media" && !r.imageUrl)
    );

  return (
    <>
      <Notification message={notification?.message} type={notification?.type} />
      <div className="fixed top-24 right-4 sm:right-8 z-30 flex flex-col gap-4">
        <Link
          to="/cart"
          className="relative bg-white p-4 rounded-full shadow-lg border transition-transform hover:scale-110"
          aria-label="Buka Keranjang"
        >
          <ShoppingCart size={24} className="text-black" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          )}
        </Link>
        {user && (
          <Link
            to="/pesanan"
            className="relative bg-white p-4 rounded-full shadow-lg border transition-transform hover:scale-110"
            aria-label="Lacak Pesanan"
          >
            <Truck size={24} className="text-black" />
          </Link>
        )}
      </div>
      <div className="min-h-screen bg-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/shop"
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition"
          >
            <ArrowLeft size={20} /> Kembali ke Toko
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            
            <div className="lg:col-span-2 flex items-center justify-center bg-gray-100 rounded-sm h-96 overflow-hidden">
              {/* --- PERUBAHAN DI SINI --- */}
              {/* Langsung gunakan product.image (Cloudinary URL) */}
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl">🪴</span>
              )}
            </div>

            <div className="lg:col-span-3 flex flex-col">
              <span className="text-sm uppercase text-gray-500 tracking-wider">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 my-2">
                {product.name}
              </h1>
              <p className="text-3xl font-light text-gray-800 mb-4">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.detail}
              </p>

              {product.stock > 0 && product.stock <= 10 && (
                <p className="text-sm mb-6 font-semibold text-yellow-600">
                  Stok Terbatas: Hanya tersisa {product.stock}!
                </p>
              )}

              <button
                onClick={() => handleAddToCartClick(product._id)}
                disabled={product.stock === 0}
                className="w-full bg-black text-white py-4 px-4 rounded-sm transition-all duration-300 hover:bg-gray-800 text-sm font-medium uppercase tracking-wide disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
              </button>
            </div>
          </div>
          <div className="mt-16 border-t pt-12">
            <h2 className="text-3xl font-bold mb-4">Ulasan Produk</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 border rounded-sm">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Filter Berdasarkan Rating
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[0, 5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatingFilter(star)}
                      className={`px-4 py-2 text-sm rounded-sm border transition ${
                        ratingFilter === star
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-300 hover:border-black"
                      }`}
                    >
                      {star === 0 ? "Semua" : `★ ${star}`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Filter Berdasarkan Media
                </label>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setMediaFilter("all")}
                    className={`px-4 py-2 text-sm rounded-sm border transition ${
                      mediaFilter === "all"
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:border-black"
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setMediaFilter("dengan-media")}
                    className={`px-4 py-2 text-sm rounded-sm border transition ${
                      mediaFilter === "dengan-media"
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:border-black"
                    }`}
                  >
                    Dengan Media
                  </button>
                  <button
                    onClick={() => setMediaFilter("tanpa-media")}
                    className={`px-4 py-2 text-sm rounded-sm border transition ${
                      mediaFilter === "tanpa-media"
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:border-black"
                    }`}
                  >
                    Tanpa Media
                  </button>
                </div>
              </div>
            </div>
            {filteredReviews.length > 0 ? (
              <div className="space-y-8">
                {filteredReviews.map((review) => {
                  const reviewUser = users.find((u) => u.id === review.userId);
                  return (
                    <div key={review.id} className="flex gap-4 border-b pb-8">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-500 overflow-hidden">
                         {/* Optional: Jika user avatar juga dari cloudinary */}
                        {reviewUser?.avatar ? (
                             <img src={reviewUser.avatar} alt="avatar" className="w-full h-full object-cover"/>
                        ) : (
                             reviewUser ? reviewUser.name.charAt(0) : "A"
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">
                              {reviewUser ? reviewUser.name : "Anonim"}
                            </p>
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <p className="text-gray-700 mt-2">{review.comment}</p>
                        {review.imageUrl && (
                          <div className="mt-4">
                            {/* Gambar review biasanya sudah URL lengkap, jadi aman */}
                            <img
                              src={review.imageUrl}
                              alt="Ulasan produk"
                              className="max-w-xs rounded-md border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 bg-gray-50 p-6 rounded-sm">
                Tidak ada ulasan yang cocok dengan filter Anda.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;