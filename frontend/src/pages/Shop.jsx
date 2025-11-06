import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Truck,
} from "lucide-react";

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

const Shop = ({ user, onAddToCart, cartCount }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);


  const [produk, setProduk] = useState([]);

useEffect(() => {
  fetchProduk();
}, []);

const fetchProduk = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/products/get-all-products");
    if (res.data.success) {
      setProduk(res.data.data);
    }
  } catch (err) {
    console.error("Gagal fetch produk:", err);
  }
};


  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAddToCartClick = (productId) => {
    const productToAdd = produk.find(p => p._id === productId);
    if (productToAdd && productToAdd.stock === 0) {
      setNotification({
        type: "error",
        message: "Produk ini sedang tidak tersedia (Out of Stock).",
      });
      return;
    }

    if (!user) {
      setNotification({
        type: "error",
        message: "Silakan login terlebih dahulu.",
      });
    } else {
      const successMessage = onAddToCart(productId);
      setNotification({ type: "success", message: successMessage });
    }
  };

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
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12"> <h1 className="text-5xl font-light text-black mb-4"> Jan Agro <span className="font-bold">Shop</span> </h1> <div className="w-24 h-[1px] bg-black mx-auto mb-6"></div> <p className="text-xl text-gray-600 font-light"> Discover our complete range of Fertilizers, Tools & Seeds </p> </div>
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"> <div className="relative flex-1 w-full md:max-w-md"> <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} /> <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:ring-2 focus:ring-black focus:border-transparent transition-all" /> </div> <div className="flex gap-3 flex-wrap justify-center"> <button onClick={() => setSelectedCategory("all")} className={`px-4 py-2 rounded-sm border transition ${ selectedCategory === "all" ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:border-black" }`} > All </button> <button onClick={() => setSelectedCategory("Pupuk")} className={`px-4 py-2 rounded-sm border transition ${ selectedCategory === "Pupuk" ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:border-black" }`} > Pupuk </button> <button onClick={() => setSelectedCategory("Alat")} className={`px-4 py-2 rounded-sm border transition ${ selectedCategory === "Alat" ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:border-black" }`} > Alat </button> <button onClick={() => setSelectedCategory("Bibit")} className={`px-4 py-2 rounded-sm border transition ${ selectedCategory === "Bibit" ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:border-black" }`} > Bibit </button> </div> </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProduk.map((item) => (
              <div
                key={item._id}
                className={`group bg-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 ${
                  item.stock === 0 ? "grayscale" : ""
                }`}
              >
                <div className="relative h-56 bg-gray-100 flex items-center justify-center overflow-hidden text-6xl transform group-hover:scale-110 transition-transform duration-500"> {item.image || "🪴"} {item.stock === 0 && ( <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"> <span className="text-white text-xl font-bold uppercase tracking-widest"> Out of Stock </span> </div> )} </div>
                <div className="p-6">
                  <div className="mb-4"> <h3 className="text-xl font-bold text-black mb-1 group-hover:text-gray-700 transition-colors"> {item.name} </h3> <p className="text-gray-600 text-sm uppercase tracking-wide"> {item.category} </p> </div>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  <div className="mb-6"> <p className="text-black font-semibold text-lg"> Rp {item.price.toLocaleString("id-ID")} </p> </div>
                  <div className="flex space-x-3">
                    <Link
                      to={`/product/${item._id}`}
                      className="flex-1 text-center bg-black text-white py-3 px-4 rounded-sm transition-all duration-300 hover:bg-gray-800 text-sm font-medium uppercase tracking-wide"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCartClick(item._id)}
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