import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Ticket,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
// Import komponen halaman Anda (sesuaikan path jika perlu)
import DashboardCeo from "../ceo/DashboardCeo";
import ProdukCeo from "../ceo/ProdukCeo";
import PesananCeo from "../ceo/PesananCeo";
import VoucherCeo from "../ceo/VoucherCeo";
import UserCeo from "../ceo/UserCeo";
import UlasanCeo from "../ceo/UlasanCeo";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const NavButton = ({ tabName, icon, children }) => (
    <button
      onClick={() => {
        setActiveTab(tabName);
        setIsSidebarOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 rounded-lg font-bold transition-all duration-200 border-2 mb-2 ${
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
    // CONTAINER UTAMA
    // pt-20: Memberi padding atas agar konten tidak tertutup Navbar Fixed (asumsi tinggi navbar 5rem/80px)
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-black pt-20">
      
      {/* OVERLAY MOBILE */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 
        SIDEBAR COMPONENT 
        ------------------
        Mobile: 'fixed' (melayang), z-50.
        Desktop (md): 
          - 'md:sticky': Membuat sidebar menempel saat discroll.
          - 'md:top-20': INI KUNCINYA. Memberi jarak 80px dari atas agar TIDAK NABRAK Navbar.
          - 'md:h-[calc(100vh-5rem)]': Mengatur tinggi sidebar agar pas mengisi sisa layar (Layar - Tinggi Navbar).
      */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r-2 border-black
          transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          
          md:translate-x-0 
          md:sticky 
          md:top-20 
          md:h-[calc(100vh-5rem)] 
          md:overflow-y-auto
        `}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
            <h1 className="text-3xl font-black tracking-tighter">CEO PANEL</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden hover:bg-gray-100 p-1 rounded-md transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
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

          <div className="pt-6 mt-auto">
             <p className="text-xs text-gray-400 font-bold">Panel CEO v1.0</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 w-full p-4 sm:p-6 md:p-8 overflow-hidden min-h-[80vh]">
        <div className="md:hidden mb-6 flex items-center justify-between bg-white border-2 border-black p-4 rounded-lg shadow-md">
          <span className="font-bold text-lg">Menu Panel</span>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-bold active:scale-95 transition-transform"
          >
            <Menu size={20} />
            <span>Buka Menu</span>
          </button>
        </div>

        <div className="animate-fade-in-up">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default Ceo;