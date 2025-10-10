import React, { useState } from "react";
import { LayoutDashboard, Users, Package, Settings } from "lucide-react";

import DashboardAdmin from "../admin/DashboardAdmin";
import UserAdmin from "../admin/UserAdmin";
import ProdukAdmin from "../admin/ProdukAdmin";
import SettingAdmin from "../admin/SettingAdmin";

function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardAdmin />;
      case "users":
        return <UserAdmin />;
      case "produk":
        return <ProdukAdmin />;
      case "settings":
        return <SettingAdmin />;
      default:
        return <DashboardAdmin />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-6">
        <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center w-full px-3 py-2 rounded ${
              activeTab === "dashboard" ? "bg-black text-white" : "hover:bg-gray-200"
            }`}
          >
            <LayoutDashboard className="mr-2 h-5 w-5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center w-full px-3 py-2 rounded ${
              activeTab === "users" ? "bg-black text-white" : "hover:bg-gray-200"
            }`}
          >
            <Users className="mr-2 h-5 w-5" /> Users
          </button>
          <button
            onClick={() => setActiveTab("produk")}
            className={`flex items-center w-full px-3 py-2 rounded ${
              activeTab === "produk" ? "bg-black text-white" : "hover:bg-gray-200"
            }`}
          >
            <Package className="mr-2 h-5 w-5" /> Produk
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center w-full px-3 py-2 rounded ${
              activeTab === "settings" ? "bg-black text-white" : "hover:bg-gray-200"
            }`}
          >
            <Settings className="mr-2 h-5 w-5" /> Settings
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 space-y-6 mt-16">
        {renderContent()}
      </main>
    </div>
  );
}

export default Admin;