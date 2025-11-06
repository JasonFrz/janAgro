import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Ticket,
} from "lucide-react";
import DashboardAdmin from "../admin/DashboardAdmin";
import UserAdmin from "../admin/UserAdmin";
import ProdukAdmin from "../admin/ProdukAdmin";
import SettingAdmin from "../admin/SettingAdmin";
import Voucher from "../admin/Voucher";

function Admin({
  users,
  vouchers,
  produk,
  checkouts,
  returns,
  cancellations,
  handleDelete,
  handleToggleBan,
  handleUpdate,
  onAddVoucher,
  onUpdateVoucher,
  onDeleteVoucher,
  onAddProduk,
  onUpdateProduk,
  onDeleteProduk,
  onUpdateOrderStatus,
  onApproveReturn,
  onRejectReturn,
  onApproveCancellation,
  onRejectCancellation,
}) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardAdmin users={users} vouchers={vouchers} produk={produk} />
        );
      case "users":
        return (
      <UserAdmin
        users={users}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onToggleBan={handleToggleBan}
      />

        );
      case "produk":
        // Teruskan props ke komponen ProdukAdmin
        return (
          <ProdukAdmin
            produk={produk}
            onAdd={onAddProduk}
            onUpdate={onUpdateProduk}
            onDelete={onDeleteProduk}
          />
        );
      case "vouchers":
        return (
          <Voucher
            vouchers={vouchers}
            onAdd={onAddVoucher}
            onUpdate={onUpdateVoucher}
            onDelete={onDeleteVoucher}
          />
        );
      case "settings":
        return (
          <SettingAdmin
            checkouts={checkouts}
            returns={returns}
            cancellations={cancellations}
            onUpdateStatus={onUpdateOrderStatus}
            onApproveReturn={onApproveReturn}
            onRejectReturn={onRejectReturn}
            onApproveCancellation={onApproveCancellation}
            onRejectCancellation={onRejectCancellation}
          />
        );
      default:
        return <DashboardAdmin users={users} vouchers={vouchers} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 pt-24 px-4 sm:px-6 lg:px-8">
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center w-full px-3 py-2 rounded ${
              activeTab === "dashboard"
                ? "bg-black text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {" "}
            <LayoutDashboard className="mr-2 h-5 w-5" /> Dashboard{" "}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center w-full px-3 py-2 rounded ${
              activeTab === "users"
                ? "bg-black text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {" "}
            <Users className="mr-2 h-5 w-5" /> Users{" "}
          </button>
          <button
            onClick={() => setActiveTab("produk")}
            className={`flex items-center w-full px-3 py-2 rounded ${
              activeTab === "produk"
                ? "bg-black text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {" "}
            <Package className="mr-2 h-5 w-5" /> Produk{" "}
          </button>
          <button
            onClick={() => setActiveTab("vouchers")}
            className={`flex items-center w-full px-3 py-2 rounded ${
              activeTab === "vouchers"
                ? "bg-black text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {" "}
            <Ticket className="mr-2 h-5 w-5" /> Vouchers{" "}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center w-full px-3 py-2 rounded ${
              activeTab === "settings"
                ? "bg-black text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {" "}
            <ShoppingCart className="mr-2 h-5 w-5" /> Pesanan{" "}
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-0 md:p-6 space-y-6">{renderContent()}</main>
    </div>
  );
}

export default Admin;
