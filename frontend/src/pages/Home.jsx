import React from "react";
import { Link } from "react-router-dom";
import Jumbotron from "../components/Jumbotron";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Jumbotron />

      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              Why Choose Jan Agro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover why Jan Agro is a trusted partner in your agriculture and
              plantation solutions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">
                Quality Products
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We provide the best environmentally friendly organic fertilizers
                that increase yields without damaging soil fertility.
              </p>
            </div>
            <div className="text-center p-8 rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">
                Commitment & Trust
              </h3>
              <p className="text-gray-600 leading-relaxed">
                For more than two decades, we have been trusted to support
                agricultural and plantation programs throughout Indonesia.
              </p>
            </div>
            <div className="text-center p-8 rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                We continuously innovate to deliver modern agricultural products
                and technologies that meet today’s needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-black mb-2">28+</div>
              <div className="text-gray-600">Years of Experience</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-black mb-2">2.5M+</div>
              <div className="text-gray-600">Farmers Served</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-black mb-2">3+</div>
              <div className="text-gray-600">Offices in Indonesia</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-black mb-2">100%</div>
              <div className="text-gray-600">Partner Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Grow with Jan Agro?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Contact us for consultation or collaboration to improve your
            agricultural and plantation productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/location"
              className="px-8 py-4 bg-white text-black rounded-md font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Contact Us
            </Link>
            <Link
              to="/shop"
              className="px-8 py-4 border border-white text-white rounded-md font-medium transition-all duration-300 hover:bg-white hover:text-black"
            >
              View Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
