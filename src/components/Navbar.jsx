import React, { useState } from "react";
import {
  Menu,
  X,
  User,
  MapPin,
  ShoppingBag,
  Info,
  Home,
  Shield,
} from "lucide-react";
import { Navbar as FlowNav } from "flowbite-react";

const Navbar = ({
  activeSection,
  setActiveSection,
  setShowProfile,
  user,
  isAdmin,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "shop", label: "Shop", icon: ShoppingBag },
    { id: "about", label: "About", icon: Info },
    { id: "location", label: "Location", icon: MapPin },
  ];

  return (
    <FlowNav
      fluid
      className="fixed top-0 left-0 right-0 z-50 !bg-black backdrop-blur-md border-b border-gray-800 rounded-none"
    >
      <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <img src="image/janAgro.png" alt="logo" className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? "text-black bg-white shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => setActiveSection("admin")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeSection === "admin"
                  ? "text-black bg-white shadow-md"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Shield size={16} />
              <span>Admin</span>
            </button>
          )}

          {/* Profile — instantly opens view profile */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-all duration-200"
          >
            <User size={16} />
            <span>{user ? user.name : "Profile"}</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-gray-300 p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-3 space-y-2 bg-black/90 border-t border-gray-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? "text-black bg-white shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => {
                setActiveSection("admin");
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                activeSection === "admin"
                  ? "text-black bg-white shadow-md"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Shield size={20} />
              <span>Admin</span>
            </button>
          )}

          {/* Mobile Profile */}
          <button
            onClick={() => {
              setShowProfile(true);
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <User size={20} />
            <span>{user ? user.name : "Profile"}</span>
          </button>
        </div>
      )}
    </FlowNav>
  );
};

export default Navbar;
