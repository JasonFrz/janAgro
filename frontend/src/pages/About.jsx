import React from "react";

const About = () => {
  const milestones = [
    {
      year: "1995–1998",
      event:
        "Trusted to supply the needs of farmers in Eastern Indonesia through the KUT and Corporate Farming programs.",
      icon: "🌾",
    },
    {
      year: "1997",
      event:
        "PT. Jan Agro Nusantara was founded in Makassar as a distributor of organic fertilizers for agriculture and aquaculture.",
      icon: "🏭",
    },
    {
      year: "2004",
      event:
        "The company moved to Surabaya to expand its marketing reach throughout Indonesia.",
      icon: "🚚",
    },
    {
      year: "2004–Present",
      event:
        "Focusing on the plantation segment, particularly palm oil. The marketing office is now located in Pekanbaru, Riau.",
      icon: "🌴",
    },
  ];

  const values = [
    {
      title: "Quality",
      icon: "✅",
      description:
        "Maintaining product quality to ensure optimal and sustainable agricultural and plantation yields.",
    },
    {
      title: "Innovation",
      icon: "💡",
      description:
        "Continuously innovating in the development of organic fertilizers and modern agricultural solutions.",
    },
    {
      title: "Sustainability",
      icon: "🌱",
      description:
        "Promoting environmentally friendly agricultural practices to preserve nature’s balance and improve farmer welfare.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <h1 className="text-6xl font-light text-black mb-6">
            About <span className="font-bold">PT. Jan Agro Nusantara</span>
          </h1>
          <div className="w-24 h-[1px] bg-black mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            PT. Jan Agro Nusantara was founded in 1997 in Makassar as a
            distributor of organic fertilizers for agriculture and aquaculture.
            Over time, the company has continued to grow, expanding its
            marketing reach and focusing on the plantation segment,
            particularly palm oil. Today, our marketing office is based in
            Pekanbaru, Riau.
          </p>
        </div>

        <div className="py-20 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-light text-center text-black mb-4">
              Our <span className="font-bold">Journey</span>
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

        <div className="py-20">
          <h2 className="text-4xl font-light text-center text-black mb-4">
            Company <span className="font-bold">Values</span>
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
        <div className="py-20 bg-white text-black -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-light mb-6">
              <span className="font-bold">Vision & Mission</span>
            </h2>
            <p className="text-xl leading-relaxed font-light mb-8">
              “To become a trusted organic fertilizer company that supports
              sustainable agriculture and improves the welfare of farmers
              throughout Indonesia.”
            </p>
            <p className="text-lg leading-relaxed">
              We are committed to providing high-quality, environmentally
              friendly products that meet the needs of the modern market.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
