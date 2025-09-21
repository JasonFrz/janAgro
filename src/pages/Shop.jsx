import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [produk, setProduk] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/Produk")
      .then(res => res.json())
      .then(data => setProduk(data))
      .catch(err => console.error(err));
  }, []);

  const filteredProduk = produk.filter(item => {
    const matchesCategory =
      selectedCategory === 'all' ||
      item.type.toLowerCase() === selectedCategory;
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-black mb-4">
            Jan Agro <span className="font-bold">Shop</span>
          </h1>
          <div className="w-24 h-[1px] bg-black mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-light">
            Discover our complete range of Fertilizers & Tools
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-sm border transition ${
                selectedCategory === 'all'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-black'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('pupuk')}
              className={`px-4 py-2 rounded-sm border transition ${
                selectedCategory === 'pupuk'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-black'
              }`}
            >
              Pupuk
            </button>
            <button
              onClick={() => setSelectedCategory('alat')}
              className={`px-4 py-2 rounded-sm border transition ${
                selectedCategory === 'alat'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-black'
              }`}
            >
              Alat
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProduk.map((item) => (
            <div
              key={item._id || item.id}
              className="group bg-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100"
            >
              <div className="relative h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={item.image}
                  alt={item.nama}
                  className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-black mb-1 group-hover:text-gray-700 transition-colors">
                    {item.nama}
                  </h3>
                  <p className="text-gray-600 text-sm uppercase tracking-wide">
                    {item.type}
                  </p>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {item.description || "Tidak ada deskripsi"}
                </p>

                <div className="mb-6">
                  <p className="text-black font-semibold text-lg">
                    Rp {item.harga.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Stok: {item.stok}</p>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-black text-white py-3 px-4 rounded-sm transition-all duration-300 hover:bg-gray-800 text-sm font-medium uppercase tracking-wide">
                    View Details
                  </button>
                  <button className="border border-gray-300 hover:border-black text-gray-700 hover:text-black py-3 px-4 rounded-sm transition-all duration-300 text-sm font-medium uppercase tracking-wide">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProduk.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
