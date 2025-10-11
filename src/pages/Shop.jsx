import React, { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";

const Shop = ({ produk = [], setPage, onAddToCart, cartCount }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProduk = produk.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <button
        onClick={() => setPage({ name: "cart" })}
        className="fixed top-24 right-4 sm:right-8 z-30 bg-white p-4 rounded-full shadow-lg border transition-transform hover:scale-110"
        aria-label="Buka Keranjang"
      >
        <ShoppingCart size={24} className="text-black" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
            {cartCount}
          </span>
        )}
      </button>

      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            {" "}
            <h1 className="text-5xl font-light text-black mb-4">
              {" "}
              Jan Agro <span className="font-bold">Shop</span>{" "}
            </h1>{" "}
            <div className="w-24 h-[1px] bg-black mx-auto mb-6"></div>{" "}
            <p className="text-xl text-gray-600 font-light">
              {" "}
              Discover our complete range of Fertilizers, Tools & Seeds{" "}
            </p>{" "}
          </div>
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            {" "}
            <div className="relative flex-1 w-full md:max-w-md">
              {" "}
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />{" "}
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />{" "}
            </div>{" "}
            <div className="flex gap-3 flex-wrap justify-center">
              {" "}
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-sm border transition ${
                  selectedCategory === "all"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-black"
                }`}
              >
                All
              </button>{" "}
              <button
                onClick={() => setSelectedCategory("Pupuk")}
                className={`px-4 py-2 rounded-sm border transition ${
                  selectedCategory === "Pupuk"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-black"
                }`}
              >
                Pupuk
              </button>{" "}
              <button
                onClick={() => setSelectedCategory("Alat")}
                className={`px-4 py-2 rounded-sm border transition ${
                  selectedCategory === "Alat"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-black"
                }`}
              >
                Alat
              </button>{" "}
              <button
                onClick={() => setSelectedCategory("Bibit")}
                className={`px-4 py-2 rounded-sm border transition ${
                  selectedCategory === "Bibit"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-black"
                }`}
              >
                Bibit
              </button>{" "}
            </div>{" "}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProduk.map((item) => (
              <div
                key={item._id}
                className={`group bg-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 ${
                  item.stock === 0 ? "grayscale" : ""
                }`}
              >
                <div className="relative h-56 bg-gray-100 flex items-center justify-center overflow-hidden text-6xl transform group-hover:scale-110 transition-transform duration-500">
                  {" "}
                  {item.image || "🪴"}{" "}
                  {item.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      {" "}
                      <span className="text-white text-xl font-bold uppercase tracking-widest">
                        Out of Stock
                      </span>{" "}
                    </div>
                  )}{" "}
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    {" "}
                    <h3 className="text-xl font-bold text-black mb-1 group-hover:text-gray-700 transition-colors">
                      {item.name}
                    </h3>{" "}
                    <p className="text-gray-600 text-sm uppercase tracking-wide">
                      {item.category}
                    </p>{" "}
                  </div>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  <div className="mb-6">
                    {" "}
                    <p className="text-black font-semibold text-lg">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>{" "}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() =>
                        setPage({ name: "product-detail", id: item._id })
                      }
                      disabled={item.stock === 0}
                      className="flex-1 bg-black text-white py-3 px-4 rounded-sm transition-all duration-300 hover:bg-gray-800 text-sm font-medium uppercase tracking-wide disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onAddToCart(item._id)}
                      disabled={item.stock === 0}
                      className="border border-gray-300 hover:border-black text-gray-700 hover:text-black py-3 px-4 rounded-sm transition-all duration-300 text-sm font-medium uppercase tracking-wide disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-200"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
