import React from 'react';
import Jumbotron from '../components/Jumbotron';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Jumbotron />
      
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Why Choose Jan Agro?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what makes Jan Agro your trusted partner in agricultural solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">Performance</h3>
              <p className="text-gray-600 leading-relaxed">Cutting-edge engineering and innovative technology for unmatched driving dynamics.</p>
            </div>
            
            <div className="text-center p-8 rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">👑</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">Luxury</h3>
              <p className="text-gray-600 leading-relaxed">Premium materials and meticulous craftsmanship in every detail.</p>
            </div>
            
            <div className="text-center p-8 rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">Leading the future of mobility with advanced autonomous and electric technologies.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-black mb-2">28+</div>
              <div className="text-gray-600">Years of Excellence</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-black mb-2">2.5M+</div>
              <div className="text-gray-600">Fertillizer Used</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-black mb-2">3+</div>
              <div className="text-gray-600">City In Indonesian</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-black mb-2">25+</div>
              <div className="text-gray-600">Award-Winning Models</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Experience Jan Agro?</h2>
          <p className="text-xl text-gray-300 mb-8">Schedule your test drive today and feel the difference.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-black rounded-md font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              Schedule Test Drive
            </button>
            <button className="px-8 py-4 border border-white text-white rounded-md font-medium transition-all duration-300 hover:bg-white hover:text-black">
              Browse Models
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;