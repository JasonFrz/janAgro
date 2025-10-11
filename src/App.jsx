import React, { useState } from "react";
import Navbar from "./components/Navbar";
import ProfileSlide from "./components/ProfileSlide";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Location from "./pages/Location";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Pesanan from "./pages/Pesanan";
import "./index.css";

function App() {
  const [page, setPage] = useState({ name: "home", id: null });
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [checkouts, setCheckouts] = useState([]);

  const [users, setUsers] = useState([
    {
      id: 1,
      username: "johndoe",
      name: "John Doe",
      email: "user@example.com",
      password: "password123",
      joinDate: "2023",
      avatar: null,
      isBanned: false,
      noTelp: "81234567890",
      alamat: "Jl. Merdeka No. 1, Jakarta Pusat, DKI Jakarta, 10110",
    },
    {
      id: 2,
      username: "janedoe",
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password456",
      joinDate: "2024",
      avatar: null,
      isBanned: true,
      noTelp: "89876543210",
      alamat: "",
    },
  ]);
  const [adminUser, setAdminUser] = useState({
    id: 99,
    username: "admin",
    name: "Admin",
    email: "admin@gmail.com",
    password: "admin",
    joinDate: "2022",
    avatar: null,
    isBanned: false,
    noTelp: "81111111111",
    alamat: "Kantor Pusat JanAgro, Jl. Teknologi No. 10, Surabaya",
  });
  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      code: "HEMAT10",
      discountPercentage: 10,
      maxUses: 100,
      currentUses: 25,
      isActive: true,
    },
    {
      id: 2,
      code: "JANAGRO50",
      discountPercentage: 50,
      maxUses: 20,
      currentUses: 19,
      isActive: true,
    },
  ]);
  const [produk, setProduk] = useState([
    {
      _id: 1,
      name: "Organic Garden Booster",
      category: "Pupuk",
      price: 24.99,
      image: "🌱",
      description: "Premium organic fertilizer for all garden plants.",
      rating: 4.8,
      stock: 17,
      detail:
        "Pupuk organik premium untuk semua tanaman kebun, sangat bagus untuk meningkatkan kesuburan tanah dan hasil panen.",
    },
    {
      _id: 2,
      name: "Sekop Taman Pro",
      category: "Alat",
      price: 15.5,
      image: "🛠️",
      description: "Alat sekop tahan lama untuk kebutuhan berkebun.",
      rating: 4.5,
      stock: 8,
      detail:
        "Terbuat dari baja berkualitas tinggi, anti karat dan kokoh. Gagang ergonomis untuk kenyamanan maksimal.",
    },
    {
      _id: 3,
      name: "Bibit Tomat Cherry",
      category: "Bibit",
      price: 5.99,
      image: "🍅",
      description: "Bibit tomat cherry unggul, cepat berbuah.",
      rating: 4.9,
      stock: 50,
      detail:
        "Satu paket berisi 50 biji bibit tomat cherry pilihan. Tahan terhadap penyakit dan cocok untuk iklim tropis.",
    },
    {
      _id: 4,
      name: "Pestisida Organik Neem",
      category: "Pupuk",
      price: 12.0,
      image: "🌿",
      description: "Pestisida alami dari ekstrak daun neem.",
      rating: 4.6,
      stock: 0,
      detail:
        "Aman untuk tanaman dan lingkungan, efektif mengusir hama seperti kutu daun, ulat, dan tungau.",
    },
  ]);
  const [reviews] = useState([
    {
      id: 101,
      productId: 1,
      userId: 1,
      rating: 5,
      comment:
        "Pupuk terbaik! Tanaman saya tumbuh subur. Ini hasilnya setelah 2 minggu pemakaian.",
      date: "2025-10-01",
      imageUrl:
        "https://via.placeholder.com/400x300.png/A7D379/000000?text=Hasil+Panen",
    },
    {
      id: 102,
      productId: 3,
      userId: 2,
      rating: 4,
      comment:
        "Bibitnya tumbuh dengan baik, meskipun beberapa tidak berkecambah. Hasil tomatnya manis dan lezat.",
      date: "2025-09-28",
      imageUrl: null,
    },
    {
      id: 103,
      productId: 1,
      userId: 2,
      rating: 4,
      comment: "Cukup bagus, tapi baunya agak menyengat.",
      date: "2025-09-25",
      imageUrl: null,
    },
    {
      id: 104,
      productId: 2,
      userId: 1,
      rating: 5,
      comment:
        "Sekopnya kokoh dan sangat nyaman digenggam. Materialnya terasa premium. Worth every penny!",
      date: "2025-10-05",
      imageUrl:
        "https://via.placeholder.com/400x300.png/DDDDDD/000000?text=Sekop+Pro",
    },
    {
      id: 105,
      productId: 2,
      userId: 2,
      rating: 1,
      comment:
        "Baru dipakai sekali gagangnya sudah patah. Kualitasnya buruk sekali, tidak sesuai deskripsi.",
      date: "2025-10-06",
      imageUrl:
        "https://via.placeholder.com/400x300.png/FF7F7F/FFFFFF?text=Gagang+Patah",
    },
  ]);

  const handleAddToCart = (productId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { productId, quantity: 1 }];
      }
    });
    return "Produk ditambahkan ke keranjang!";
  };
  const handleUpdateCartQuantity = (productId, newQuantity) => {
    setCart(
      cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(0, newQuantity) }
          : item
      )
    );
  };
  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };
  const handleCheckout = (checkoutData) => {
    if (checkoutData.kodeVoucher) {
      const voucherUsed = vouchers.find(
        (v) => v.code === checkoutData.kodeVoucher
      );
      if (
        !voucherUsed ||
        !voucherUsed.isActive ||
        voucherUsed.currentUses >= voucherUsed.maxUses
      ) {
        return {
          success: false,
          message: `Voucher "${checkoutData.kodeVoucher}" tidak lagi valid atau sudah habis.`,
        };
      }
      setVouchers(
        vouchers.map((v) =>
          v.code === checkoutData.kodeVoucher
            ? { ...v, currentUses: v.currentUses + 1 }
            : v
        )
      );
    }
    const newCheckout = {
      ...checkoutData,
      id: Date.now(),
      tanggal: new Date().toISOString(),
      status: "diproses",
    };
    setCheckouts([...checkouts, newCheckout]);
    setCart([]);
    setPage({ name: "shop", id: null });
    console.log("Data Pesanan Baru:", newCheckout);
    return {
      success: true,
      message: "Checkout berhasil! Terima kasih telah berbelanja.",
    };
  };
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setCheckouts(
      checkouts.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };
  const handleLogin = (identifier, password) => {
    const userAccount =
      users.find((u) => u.email === identifier || u.username === identifier) ||
      (adminUser.email === identifier || adminUser.username === identifier
        ? adminUser
        : null);
    if (!userAccount) {
      return "Pengguna dengan email atau username tersebut tidak ditemukan.";
    }
    if (userAccount.password !== password) {
      return "Password yang Anda masukkan salah.";
    }
    if (userAccount.isBanned) {
      return "Akun ini telah ditangguhkan.";
    }
    const isAdminLogin = userAccount.id === adminUser.id;
    setUser(userAccount);
    setIsAdmin(isAdminLogin);
    if (isAdminLogin) {
      setPage({ name: "admin", id: null });
    }
    setShowProfile(false);
    return null;
  };
  const handleRegister = (username, name, email, password, noTelp) => {
    const cleanUsername = username.trim().toLowerCase();
    if (
      users.find((u) => u.username === cleanUsername) ||
      adminUser.username === cleanUsername
    )
      return "Username ini sudah digunakan.";
    if (users.find((u) => u.email === email) || adminUser.email === email)
      return "Email ini sudah terdaftar.";
    const newUser = {
      id: Date.now(),
      username: cleanUsername,
      name,
      email,
      password,
      noTelp,
      alamat: "",
      joinDate: new Date().getFullYear().toString(),
      avatar: null,
      isBanned: false,
    };
    setUsers([...users, newUser]);
    return null;
  };
  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setPage({ name: "home", id: null });
  };
  const handleAvatarChange = (newAvatarUrl) => {
    if (!user) return;
    const updatedUser = { ...user, avatar: newAvatarUrl };
    setUser(updatedUser);
    if (updatedUser.id === adminUser.id) {
      setAdminUser(updatedUser);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
    }
  };
  const handleProfileUpdate = (updatedData) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    if (updatedUser.id === adminUser.id) {
      setAdminUser(updatedUser);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
    }
  };
  const handlePasswordChange = (currentPassword, newPassword) => {
    if (!user) return { success: false, message: "No user logged in." };
    if (user.password !== currentPassword)
      return { success: false, message: "Current password incorrect." };
    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);
    if (updatedUser.id === adminUser.id) {
      setAdminUser(updatedUser);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
    }
    return { success: true, message: "Password updated successfully!" };
  };
  const handleUpdateUserByAdmin = (userId, updatedData) =>
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, ...updatedData } : u))
    );
  const handleDeleteUserByAdmin = (userId) =>
    setUsers(users.filter((u) => u.id !== userId));
  const handleToggleBanUser = (userId) =>
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, isBanned: !u.isBanned } : u))
    );
  const handleAddVoucher = (newData) => {
    const newVoucher = {
      ...newData,
      id: Date.now(),
      currentUses: 0,
      discountPercentage: parseInt(newData.discountPercentage, 10),
      maxUses: parseInt(newData.maxUses, 10),
    };
    setVouchers([...vouchers, newVoucher]);
  };
  const handleUpdateVoucher = (voucherId, updatedData) => {
    setVouchers(
      vouchers.map((v) =>
        v.id === voucherId
          ? {
              ...v,
              ...updatedData,
              discountPercentage: parseInt(updatedData.discountPercentage, 10),
              maxUses: parseInt(updatedData.maxUses, 10),
            }
          : v
      )
    );
  };
  const handleDeleteVoucher = (voucherId) =>
    setVouchers(vouchers.filter((v) => v.id !== voucherId));
  const handleAddProduk = (newData) => {
    const newProduk = { ...newData, _id: Date.now() };
    setProduk([...produk, newProduk]);
  };
  const handleUpdateProduk = (produkId, updatedData) => {
    setProduk(
      produk.map((p) => (p._id === produkId ? { ...p, ...updatedData } : p))
    );
  };
  const handleDeleteProduk = (produkId) => {
    setProduk(produk.filter((p) => p._id !== produkId));
  };

  const renderContent = () => {
    switch (page.name) {
      case "home":
        return <Home />;
      case "shop":
        return (
          <Shop
            produk={produk}
            user={user}
            setPage={setPage}
            onAddToCart={handleAddToCart}
            cartCount={cart.length}
          />
        );
      case "product-detail": {
        const selectedProduct = produk.find((p) => p._id === page.id);
        if (!selectedProduct) {
          return <Shop produk={produk} user={user} setPage={setPage} />;
        }
        return (
          <ProductDetail
            product={selectedProduct}
            reviews={reviews}
            users={users}
            user={user}
            setPage={setPage}
            onAddToCart={handleAddToCart}
            cartCount={cart.length}
          />
        );
      }
      case "cart":
        return (
          <Cart
            cart={cart}
            produk={produk}
            user={user}
            vouchers={vouchers}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemove={handleRemoveFromCart}
            onCheckout={handleCheckout}
            setPage={setPage}
          />
        );
      case "pesanan":
        return <Pesanan checkouts={checkouts} user={user} setPage={setPage} />;
      case "about":
        return <About />;
      case "admin":
        return isAdmin ? (
          <Admin
            users={users}
            vouchers={vouchers}
            produk={produk}
            checkouts={checkouts}
            onUpdateUser={handleUpdateUserByAdmin}
            onDeleteUser={handleDeleteUserByAdmin}
            onToggleBanUser={handleToggleBanUser}
            onAddVoucher={handleAddVoucher}
            onUpdateVoucher={handleUpdateVoucher}
            onDeleteVoucher={handleDeleteVoucher}
            onAddProduk={handleAddProduk}
            onUpdateProduk={handleUpdateProduk}
            onDeleteProduk={handleDeleteProduk}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        ) : (
          <Home />
        );
      case "location":
        return <Location />;
      case "profile":
        return (
          <Profile
            user={user}
            onAvatarChange={handleAvatarChange}
            onProfileUpdate={handleProfileUpdate}
            onPasswordChange={handlePasswordChange}
          />
        );
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        activeSection={page.name}
        setActiveSection={(sectionName) =>
          setPage({ name: sectionName, id: null })
        }
        setShowProfile={setShowProfile}
        user={user}
        isAdmin={isAdmin}
      />
      <main>{renderContent()}</main>
      <Footer />
      <ProfileSlide
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        setActiveSection={(sectionName) =>
          setPage({ name: sectionName, id: null })
        }
      />
    </div>
  );
}

export default App;
