import React from "react";
import Jumbotron from "../components/Jumbotron";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Jumbotron />

      {/* WHY CHOOSE US SECTION */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              Mengapa Memilih Jan Agro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Temukan alasan mengapa Jan Agro menjadi mitra terpercaya dalam
              solusi pertanian dan perkebunan Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">
                Produk Berkualitas
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Kami menyediakan pupuk organik terbaik yang ramah lingkungan,
                meningkatkan hasil panen tanpa merusak kesuburan tanah.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">
                Komitmen & Kepercayaan
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Lebih dari dua dekade kami dipercaya untuk mendukung program
                pertanian dan perkebunan di seluruh Indonesia.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">Inovasi</h3>
              <p className="text-gray-600 leading-relaxed">
                Kami terus berinovasi untuk menghadirkan produk dan teknologi
                pertanian modern yang sesuai kebutuhan zaman.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-black mb-2">28+</div>
              <div className="text-gray-600">Tahun Pengalaman</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-black mb-2">2.5M+</div>
              <div className="text-gray-600">Petani Terlayani</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-black mb-2">3+</div>
              <div className="text-gray-600">Kantor di Indonesia</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-black mb-2">100%</div>
              <div className="text-gray-600">Kepuasan Mitra</div>
            </div>
          </div>
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Siap Bertumbuh Bersama Jan Agro?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Hubungi kami untuk konsultasi atau kerja sama dalam meningkatkan
            hasil pertanian dan perkebunan Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-black rounded-md font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              Hubungi Kami
            </button>
            <button className="px-8 py-4 border border-white text-white rounded-md font-medium transition-all duration-300 hover:bg-white hover:text-black">
              Lihat Produk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
