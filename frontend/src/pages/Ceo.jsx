import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Ticket,
  FileText,
  MessageSquare,
  Menu, // Import Icon Menu
  X, // Import Icon Close
} from "lucide-react";
import DashboardCeo from "../ceo/DashboardCeo";
import ProdukCeo from "../ceo/ProdukCeo";
import PesananCeo from "../ceo/PesananCeo";
import VoucherCeo from "../ceo/VoucherCeo";
import UserCeo from "../ceo/UserCeo";
import UlasanCeo from "../ceo/UlasanCeo";
import { Link } from "react-router-dom";

function Ceo({
  users,
  vouchers,
  produk,
  checkouts,
  returns,
  cancellations,
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk Mobile Menu

  const NavButton = ({ tabName, icon, children }) => (
    <button
      onClick={() => {
        setActiveTab(tabName);
        setIsSidebarOpen(false); // Tutup sidebar saat klik di mobile
      }}
      className={`flex items-center w-full px-4 py-3 rounded-lg font-bold transition-all duration-200 border-2 ${
        activeTab === tabName
          ? "bg-black text-white border-black"
          : "bg-white text-black border-transparent hover:border-black hover:bg-gray-100"
      }`}
    >
      {icon} {children}
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardCeo
            users={users}
            vouchers={vouchers}
            produk={produk}
            checkouts={checkouts}
          />
        );
      case "produk":
        return (
          <ProdukCeo
            produk={produk}
            onAdd={onAddProduk}
            onUpdate={onUpdateProduk}
            onDelete={onDeleteProduk}
          />
        );
      case "vouchers":
        return (
          <VoucherCeo
            vouchers={vouchers}
            onAdd={onAddVoucher}
            onUpdate={onUpdateVoucher}
            onDelete={onDeleteVoucher}
          />
        );
      case "users":
        return <UserCeo />;
      case "pesanan":
        return (
          <PesananCeo
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
      case "ulasan":
        return <UlasanCeo />;
      default:
        return (
          <DashboardCeo
            users={users}
            vouchers={vouchers}
            produk={produk}
            checkouts={checkouts}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 pt-20 sm:pt-24 text-black relative">
      {/* Overlay untuk Mobile ketika sidebar terbuka */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen md:h-[calc(100vh-6rem)] w-72 bg-white shadow-2xl p-6 border-r-2 border-black z-40 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } pt-24 md:pt-6 overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
          <h1 className="text-3xl font-black">CEO PANEL</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>
        
        <nav className="space-y-3">
          <NavButton tabName="dashboard" icon={<LayoutDashboard className="mr-3 h-6 w-6" />}>
            Dashboard
          </NavButton>
          <NavButton tabName="users" icon={<Users className="mr-3 h-6 w-6" />}>
            Users
          </NavButton>
          <NavButton tabName="produk" icon={<Package className="mr-3 h-6 w-6" />}>
            Products
          </NavButton>
          <NavButton tabName="vouchers" icon={<Ticket className="mr-3 h-6 w-6" />}>
            Vouchers
          </NavButton>
          <NavButton tabName="pesanan" icon={<ShoppingCart className="mr-3 h-6 w-6" />}>
            Orders
          </NavButton>
          <NavButton tabName="ulasan" icon={<MessageSquare className="mr-3 h-6 w-6" />}>
            Reviews
          </NavButton>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 overflow-x-hidden w-full">
        {/* Tombol Toggle Mobile */}
        <div className="md:hidden mb-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-bold shadow-lg"
          >
            <Menu size={20} />
            <span>Menu Panel</span>
          </button>
        </div>
        
        {renderContent()}
      </main>
    </div>
  );
}

export default Ceo;