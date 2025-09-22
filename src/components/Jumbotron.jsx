import React, { useState, useEffect } from "react";

const Jumbotron = () => {
  const images = [
    "/image/sawah1.jpg",
    "/image/sawah2.jpg",
    "/image/sawah3.jpg",
    "/image/sawah4.jpg",
    "/image/sawah5.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      className="relative h-screen flex items-center justify-center overflow-hidden bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${images[currentIndex]})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300 mb-6 font-light">
            GROW THE FUTURE WITH JAN AGRO NUSANTARA
          </p>
          <h1 className="text-7xl md:text-9xl font-thin mb-8 tracking-tight">
            <span className="font-bold">JAN AGRO</span>
          </h1>
          <div className="w-24 h-[2px] bg-white mx-auto mb-8"></div>
          <h2 className="text-2xl md:text-4xl font-light mb-10 text-gray-200 tracking-wide">
            Your Trusted Partner in Agricultural Solutions
          </h2>
        </div>

        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Empowering Farmers with Quality Products and Expert Support. At Jan
          Agro Nusantara, we are dedicated to providing innovative agricultural
          solutions that help farmers thrive and achieve sustainable growth.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="group px-10 py-4 bg-white text-black rounded-sm font-medium transition-all duration-500 transform hover:scale-105 hover:shadow-2xl uppercase tracking-wider text-sm">
            <span className="group-hover:tracking-widest transition-all duration-300">
              Explore Models
            </span>
          </button>
          <button className="group px-10 py-4 border border-white text-white rounded-sm font-medium transition-all duration-500 hover:bg-white hover:text-black uppercase tracking-wider text-sm">
            <span className="group-hover:tracking-widest transition-all duration-300">
              Book Test Drive
            </span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center">
          <div className="w-[1px] h-16 bg-white/30 mb-3"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <p className="text-white/50 text-xs mt-3 tracking-widest">SCROLL</p>
        </div>
      </div>
    </div>
  );
};

export default Jumbotron;
