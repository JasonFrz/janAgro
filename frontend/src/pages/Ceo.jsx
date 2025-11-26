import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Ticket,
  FileText,
  MessageSquare, // Import Icon Baru
} from "lucide-react";
import DashboardCeo from "../ceo/DashboardCeo";
import ProdukCeo from "../ceo/ProdukCeo";
import PesananCeo from "../ceo/PesananCeo";
import VoucherCeo from "../ceo/VoucherCeo";
import UserCeo from "../ceo/UserCeo";
import UlasanCeo from "../ceo/UlasanCeo"; // Import Komponen Baru
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

  const NavButton = ({ tabName, icon, children }) => (
    <button
      onClick={() => setActiveTab(tabName)}
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
      case "ulasan": // CASE BARU
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
    <div className="flex min-h-screen bg-gray-100 pt-24 text-black">
      <aside className="w-72 bg-white shadow-2xl p-6 hidden md:block border-r-2 border-black">
        <h1 className="text-3xl font-black mb-8 pb-4 border-b-2 border-black">
          CEO PANEL
        </h1>
        <nav className="space-y-3">
          <NavButton
            tabName="dashboard"
            icon={<LayoutDashboard className="mr-3 h-6 w-6" />}
          >
            Dashboard
          </NavButton>
          <NavButton tabName="users" icon={<Users className="mr-3 h-6 w-6" />}>
            Users
          </NavButton>
          <NavButton
            tabName="produk"
            icon={<Package className="mr-3 h-6 w-6" />}
          >
            Products
          </NavButton>
          <NavButton
            tabName="vouchers"
            icon={<Ticket className="mr-3 h-6 w-6" />}
          >
            Vouchers
          </NavButton>
          <NavButton
            tabName="pesanan"
            icon={<ShoppingCart className="mr-3 h-6 w-6" />}
          >
            Orders
          </NavButton>

          {/* TOMBOL BARU DI SINI */}
          <NavButton
            tabName="ulasan"
            icon={<MessageSquare className="mr-3 h-6 w-6" />}
          >
            Reviews
          </NavButton>
        </nav>
      </aside>
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default Ceo;
