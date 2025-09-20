import React from 'react';

const Jumbotron = () => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with elegant gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800"></div>
      
      {/* Geometric patterns */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rotate-45"></div>
      </div>
      
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300 mb-6 font-light">
            GROW THE FUTURE WITH JANAGRO
          </p>
          <h1 className="text-7xl md:text-9xl font-thin mb-8 tracking-tight">
            <span className="font-bold">JAN AGRO</span>
          </h1>
          <div className="w-24 h-[1px] bg-white mx-auto mb-8"></div>
          <h2 className="text-2xl md:text-4xl font-light mb-10 text-gray-200 tracking-wide">
            Sheer Driving Pleasure
          </h2>
        </div>
        
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Experience the perfect fusion of luxury, performance, and innovation. 
          Every BMW is crafted to deliver an extraordinary driving experience that transcends expectations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="group px-10 py-4 bg-white text-black rounded-sm font-medium transition-all duration-500 transform hover:scale-105 hover:shadow-2xl uppercase tracking-wider text-sm">
            <span className="group-hover:tracking-widest transition-all duration-300">Explore Models</span>
          </button>
          <button className="group px-10 py-4 border border-white text-white rounded-sm font-medium transition-all duration-500 hover:bg-white hover:text-black uppercase tracking-wider text-sm">
            <span className="group-hover:tracking-widest transition-all duration-300">Book Test Drive</span>
          </button>
        </div>
      </div>
      
      {/* Elegant scroll indicator */}
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