import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Ticket,
  Menu,
  X,
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk sidebar mobile

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

  const NavItem = ({ tab, icon: Icon, label }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setIsSidebarOpen(false); // Tutup sidebar saat item diklik (mobile)
      }}
      className={`flex items-center w-full px-3 py-3 rounded-lg transition-colors duration-200 ${
        activeTab === tab
          ? "bg-black text-white shadow-md"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className="mr-3 h-5 w-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 pt-20 sm:pt-24 text-black relative">
      {/* Overlay untuk Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Responsive */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen md:h-[calc(100vh-6rem)] w-64 bg-white shadow-xl p-6 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } pt-24 md:pt-6 overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-8 md:mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2">
          <NavItem tab="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem tab="users" icon={Users} label="Users" />
          <NavItem tab="produk" icon={Package} label="Product" />
          <NavItem tab="vouchers" icon={Ticket} label="Vouchers" />
          <NavItem tab="settings" icon={ShoppingCart} label="Orders" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden w-full">
        {/* Tombol Toggle Mobile (Muncul di atas konten) */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-bold shadow-md border border-gray-200"
          >
            <Menu size={20} />
            <span>Menu Admin</span>
          </button>
        </div>

        {renderContent()}
      </main>
    </div>
  );
}

export default Admin;