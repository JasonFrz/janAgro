import React from "react";

const About = () => {
  const milestones = [
    { year: "1995–1998", event: "Diberi kepercayaan untuk mensuplai kebutuhan petani di Indonesia Timur dalam program KUT dan Corporate Farming.", icon: "🌾" },
    { year: "1997", event: "PT. Jan Agro Nusantara didirikan di Makassar sebagai distributor pupuk organik untuk pertanian dan tambak.", icon: "🏭" },
    { year: "2004", event: "Perusahaan pindah ke Surabaya untuk memperluas jangkauan pemasaran ke seluruh Indonesia.", icon: "🚚" },
    { year: "2004–Sekarang", event: "Berfokus pada segmen perkebunan, khususnya kelapa sawit. Kantor pemasaran kini berada di Pekanbaru, Riau.", icon: "🌴" },
  ];

  const values = [
    {
      title: "Kualitas",
      icon: "✅",
      description:
        "Menjaga mutu produk agar hasil pertanian dan perkebunan semakin optimal dan berkelanjutan.",
    },
    {
      title: "Inovasi",
      icon: "💡",
      description:
        "Terus berinovasi dalam pengembangan pupuk organik dan solusi pertanian modern.",
    },
    {
      title: "Keberlanjutan",
      icon: "🌱",
      description:
        "Mendorong praktik pertanian ramah lingkungan untuk menjaga keseimbangan alam dan kesejahteraan petani.",
    },
    {
      title: "Kemitraan",
      icon: "🤝",
      description:
        "Membangun hubungan jangka panjang dengan petani dan mitra usaha di seluruh Indonesia.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center py-20">
          <h1 className="text-6xl font-light text-black mb-6">
            Tentang <span className="font-bold">PT. Jan Agro Nusantara</span>
          </h1>
          <div className="w-24 h-[1px] bg-black mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            PT. Jan Agro Nusantara didirikan pada tahun 1997 di Makassar sebagai
            distributor pupuk organik untuk pertanian dan tambak. Seiring
            perkembangan waktu, perusahaan terus tumbuh, memperluas jangkauan
            pemasaran, dan berfokus pada segmen perkebunan, khususnya kelapa
            sawit. Kini, kantor pemasaran kami berpusat di Pekanbaru, Riau.
          </p>
        </div>

        {/* Journey */}
        <div className="py-20 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-light text-center text-black mb-4">
              Perjalanan <span className="font-bold">Kami</span>
            </h2>
            <div className="w-24 h-[1px] bg-black mx-auto mb-12"></div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-full bg-gray-300"></div>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${
                      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`w-1/2 ${
                        index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                      }`}
                    >
                      <div className="bg-white p-6 rounded-sm shadow-md border border-gray-100">
                        <div className="text-3xl mb-3">{milestone.icon}</div>
                        <div className="text-2xl font-bold text-black mb-2">
                          {milestone.year}
                        </div>
                        <p className="text-gray-700">{milestone.event}</p>
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-black rounded-full relative z-10"></div>
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="py-20">
          <h2 className="text-4xl font-light text-center text-black mb-4">
            Nilai <span className="font-bold">Perusahaan</span>
          </h2>
          <div className="w-24 h-[1px] bg-black mx-auto mb-12"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group text-center p-8 rounded-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-800 transition-colors">
                  <span className="text-white text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="py-20 bg-black text-white -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-light mb-6">
              Visi & <span className="font-bold">Misi</span>
            </h2>
            <p className="text-xl leading-relaxed font-light mb-8">
              “Menjadi perusahaan pupuk organik terpercaya yang mendukung
              pertanian berkelanjutan dan meningkatkan kesejahteraan petani di
              seluruh Indonesia.”
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Kami berkomitmen untuk menyediakan produk berkualitas tinggi,
              ramah lingkungan, dan sesuai kebutuhan pasar modern.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
