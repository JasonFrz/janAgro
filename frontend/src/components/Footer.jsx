import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './Footer.css'
import axios from "axios";

const Footer = () => {

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

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Grid Container: 1 kolom di HP, 2 di Tablet, 4 di Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-4 shrink-0">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <img src="/image/janAgro.png" alt="logo" className="w-6 h-6 object-contain" />
                </div>
              </div>
              <span className="text-xl md:text-2xl font-light">Jan Agro Nusantara</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 yapping">
              Empowering Farmers with Quality Products and Expert Support. 
              At Jan Agro, we are dedicated to providing innovative agricultural solutions that help farmers thrive and achieve sustainable growth.
            </p>
            
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
          
          <div>
            <h3 className="font-semibold mb-6 text-lg produk">Produk Jan Agro</h3>
            <ul className="space-y-3 text-sm text-gray-400">
             {produk.slice(0,6).map((p) => (
              <li key={p._id}>
                <Link to={`/product/${p._id}`} className="hover:text-white transition-colors block">{p.name}</Link>   
              </li>
              ))}
              <br />
              <Link to="/shop" className="hover:text-white transition-colors inline-block mt-2">Lihat Product Lainnya...</Link>   
            </ul>
          </div>

          
          {/* Contact Section - mengambil 2 kolom di tablet jika diperlukan, atau default grid flow */}
          <div className="sm:col-span-2 lg:col-span-2 grid sm:grid-cols-2 gap-8">
            <div>
                <h3 className="font-semibold mb-6 text-lg contact">Contact & Support</h3>
                <div className="space-y-4 text-sm text-gray-400">
                <div className="flex items-start space-x-3">
                    <MapPin size={16} className="mt-1 flex-shrink-0" />
                    <div>
                    <p>Jan Agro Indonesia</p>
                    <p>Pondok Chandra Indah No. 69</p>
                    <p>Surabaya 10130, Indonesia</p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-3">
                    <Phone size={16} className="flex-shrink-0" />
                    <div>
                    <p>+62 811 762 788</p>
                    <p className="text-xs">Customer Service</p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-3">
                    <Mail size={16} className="flex-shrink-0" />
                    <div>
                    <p className="janagronusantara@gmail.com break-all">janagronusantara@gmail.com</p>
                    <p className="text-xs">General Inquiry</p>
                    </div>
                </div>
                </div>
            </div>
            
            <div className="mt-0 sm:mt-0">
                <h4 className="font-medium mb-6 text-lg">Support Links</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link to="/location" className="hover:text-white transition-colors">Find a Warehouse</Link></li>
                    <li><Link to="/about" className="hover:text-white transition-colors">Customer Support</Link></li>
                    <li><a href="#" className="hover:text-white transition-colors">Career Opportunities</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Press & Media</a></li>
                </ul>
            </div>
          </div>
        </div>
        
        {/* Subscribe Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-md w-full">
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to receive the latest Jan Agro news, exclusive offers, and updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-sm sm:rounded-l-sm sm:rounded-r-none text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent w-full"
              />
              <button className="px-6 py-3 bg-white text-black rounded-sm sm:rounded-l-none sm:rounded-r-sm font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-gray-400 text-center sm:text-left">
              <p>&copy; 2025 Jan Agro Nusantara Group. All rights reserved.</p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
                <a href="#" className="hover:text-white transition-colors">Legal Notice</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Available in:</span>
              <select className="bg-gray-800 border border-gray-700 rounded-sm px-3 py-1 text-white text-sm focus:outline-none focus:border-white">
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