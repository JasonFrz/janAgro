import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-4">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BMW</span>
                </div>
              </div>
              <span className="text-2xl font-light">BMW</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The Ultimate Driving Machine. Experience luxury, performance, and innovation 
              in every journey with BMW's commitment to excellence.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <Youtube size={16} />
              </a>
            </div>
          </div>
          
          {/* Models */}
          <div>
            <h3 className="font-semibold mb-6 text-lg">Models</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Electric Vehicles</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sedan Series</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SUV & SAV</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Coupe & Convertible</a></li>
              <li><a href="#" className="hover:text-white transition-colors">M Performance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">iX Series</a></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="font-semibold mb-6 text-lg">Services</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Service & Maintenance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">BMW Financing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Insurance Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Extended Warranty</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Roadside Assistance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Parts & Accessories</a></li>
            </ul>
          </div>
          
          {/* Contact & Support */}
          <div>
            <h3 className="font-semibold mb-6 text-lg">Contact & Support</h3>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <div>
                  <p>BMW Indonesia</p>
                  <p>Jl. Gajah Mada No. 188</p>
                  <p>Jakarta 10130, Indonesia</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone size={16} className="flex-shrink-0" />
                <div>
                  <p>+62 21 2635 9000</p>
                  <p className="text-xs">Customer Service</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail size={16} className="flex-shrink-0" />
                <div>
                  <p>info@bmw.co.id</p>
                  <p className="text-xs">General Inquiry</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3">Support Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Find a Dealer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Customer Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Opportunities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press & Media</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-md">
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to receive the latest BMW news, exclusive offers, and updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent"
              />
              <button className="px-6 py-3 bg-white text-black rounded-r-sm font-medium hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
              <p>&copy; 2025 BMW Group. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
                <a href="#" className="hover:text-white transition-colors">Legal Notice</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Available in:</span>
              <select className="bg-gray-800 border border-gray-700 rounded-sm px-3 py-1 text-white text-sm">
                <option>Indonesia</option>
                <option>English (Global)</option>
                <option>Deutsch</option>
                <option>Français</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;