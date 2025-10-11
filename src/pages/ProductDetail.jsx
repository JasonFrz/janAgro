import React, { useState } from "react";
import { Star, ArrowLeft } from "lucide-react";

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

const ProductDetail = ({ product, reviews, users, setPage }) => {
  const [ratingFilter, setRatingFilter] = useState(0);
  const [mediaFilter, setMediaFilter] = useState("all");

  // useMemo dihapus, filter dijalankan pada setiap render
  const filteredReviews = reviews
    .filter((review) => review.productId === product._id)
    .filter((review) => {
      if (ratingFilter === 0) return true;
      return review.rating === ratingFilter;
    })
    .filter((review) => {
      if (mediaFilter === "all") return true;
      if (mediaFilter === "dengan-media") return review.imageUrl !== null;
      if (mediaFilter === "tanpa-media") return review.imageUrl === null;
      return true;
    });

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => setPage({ name: "shop" })}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition"
        >
          <ArrowLeft size={20} />
          Kembali ke Toko
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 flex items-center justify-center bg-gray-100 rounded-sm text-8xl h-96">
            {product.image}
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
                Stok Terbatas: Tinggal {product.stock} buah!
              </p>
            )}
            <button
              disabled={product.stock === 0}
              className="w-full bg-black text-white py-4 px-4 rounded-sm transition-all duration-300 hover:bg-gray-800 text-sm font-medium uppercase tracking-wide disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
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
                const user = users.find((u) => u.id === review.userId);
                return (
                  <div key={review.id} className="flex gap-4 border-b pb-8">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-500">
                      {user ? user.name.charAt(0) : "A"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">
                            {user ? user.name : "Anonymous"}
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
              Tidak ada ulasan yang sesuai dengan filter Anda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
