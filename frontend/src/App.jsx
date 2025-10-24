import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
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
import Review from "./pages/Review";
import LaporanPesanan from "./laporan/LaporanPesanan";
import PengembalianBarang from "./pages/PengembalianBarang";
import "./index.css";

function App() {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);

  const navigate = useNavigate();

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
      alamat: "Jl. Mawar No. 5, Bandung, Jawa Barat, 40111",
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
  const [reviews, setReviews] = useState([
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
  ]);
  const [checkouts, setCheckouts] = useState([
    {
      id: 1001,
      userId: 1,
      nama: "John Doe",
      alamat: "Jl. Merdeka No. 1, Jakarta Pusat",
      noTelpPenerima: "81234567890",
      items: [
        {
          _id: 1,
          name: "Organic Garden Booster",
          image: "🌱",
          price: 24.99,
          quantity: 2,
        },
      ],
      subtotal: 49.98,
      diskon: 0,
      kodeVoucher: null,
      kurir: { biaya: 10000 },
      totalHarga: 59980,
      metodePembayaran: "Transfer Bank",
      tanggal: "2025-08-10T10:30:00Z",
      status: "selesai",
    },
    {
      id: 1002,
      userId: 2,
      nama: "Jane Doe",
      alamat: "Jl. Mawar No. 5, Bandung",
      noTelpPenerima: "89876543210",
      items: [
        {
          _id: 2,
          name: "Sekop Taman Pro",
          image: "🛠️",
          price: 15.5,
          quantity: 1,
        },
      ],
      subtotal: 15.5,
      diskon: 0,
      kodeVoucher: null,
      kurir: { biaya: 10000 },
      totalHarga: 25500,
      metodePembayaran: "COD",
      tanggal: "2025-09-20T14:00:00Z",
      status: "dikirim",
    },
    {
      id: 1003,
      userId: 1,
      nama: "John Doe",
      alamat: "Jl. Merdeka No. 1, Jakarta Pusat",
      noTelpPenerima: "81234567890",
      items: [
        {
          _id: 4,
          name: "Pestisida Organik Neem",
          image: "🌿",
          price: 12.0,
          quantity: 1,
        },
      ],
      subtotal: 12.0,
      diskon: 0,
      kodeVoucher: null,
      kurir: { biaya: 10000 },
      totalHarga: 22000,
      metodePembayaran: "Kartu Kredit",
      tanggal: "2025-10-12T09:15:00Z",
      status: "pembatalan diajukan",
    },
    {
      id: 1004,
      userId: 1,
      nama: "John Doe",
      alamat: "Jl. Merdeka No. 1, Jakarta Pusat",
      noTelpPenerima: "81234567890",
      items: [
        {
          _id: 3,
          name: "Bibit Tomat Cherry",
          image: "🍅",
          price: 5.99,
          quantity: 3,
        },
      ],
      subtotal: 17.97,
      diskon: 0,
      kodeVoucher: null,
      kurir: { biaya: 10000 },
      totalHarga: 27970,
      metodePembayaran: "Transfer Bank",
      tanggal: "2025-10-01T11:00:00Z",
      status: "sampai",
    },
    {
      id: 1005,
      userId: 2,
      nama: "Jane Doe",
      alamat: "Jl. Mawar No. 5, Bandung",
      noTelpPenerima: "89876543210",
      items: [
        {
          _id: 2,
          name: "Sekop Taman Pro",
          image: "🛠️",
          price: 15.5,
          quantity: 1,
        },
      ],
      subtotal: 15.5,
      diskon: 0,
      kodeVoucher: null,
      kurir: { biaya: 10000 },
      totalHarga: 25500,
      metodePembayaran: "COD",
      tanggal: "2025-07-15T10:00:00Z",
      status: "pengembalian ditolak",
    },
    {
      id: 1006,
      userId: 1,
      nama: "John Doe",
      alamat: "Jl. Merdeka No. 1, Jakarta Pusat",
      noTelpPenerima: "81234567890",
      items: [
        {
          _id: 2,
          name: "Sekop Taman Pro",
          image: "🛠️",
          price: 15.5,
          quantity: 1,
        },
      ],
      subtotal: 15.5,
      diskon: 0,
      kodeVoucher: null,
      kurir: { biaya: 10000 },
      totalHarga: 25500,
      metodePembayaran: "Transfer Bank",
      tanggal: "2025-06-20T10:00:00Z",
      status: "dibatalkan",
    },
    {
      id: 1007,
      userId: 1,
      nama: "John Doe",
      alamat: "Jl. Merdeka No. 1, Jakarta Pusat",
      noTelpPenerima: "81234567890",
      items: [
        {
          _id: 4,
          name: "Pestisida Organik Neem",
          image: "🌿",
          price: 12.0,
          quantity: 2,
        },
      ],
      subtotal: 24.0,
      diskon: 0,
      kodeVoucher: null,
      kurir: { biaya: 10000 },
      totalHarga: 34000,
      metodePembayaran: "Kartu Kredit",
      tanggal: "2025-10-14T09:00:00Z",
      status: "diproses",
    },
  ]);
  const [returns, setReturns] = useState([
    {
      id: 1,
      orderId: 1005,
      reason:
        "Barang yang diterima tidak sesuai dengan deskripsi, gagangnya terasa ringkih.",
      videos: ["dummy_video_1.mp4"],
      photos: [
        "dummy_photo_1.jpg",
        "dummy_photo_2.jpg",
        "dummy_photo_3.jpg",
        "dummy_photo_4.jpg",
        "dummy_photo_5.jpg",
        "dummy_photo_6.jpg",
      ],
    },
  ]);
  const [cancellations, setCancellations] = useState([
    {
      id: 1,
      orderId: 1003,
      reason: "Saya salah memasukkan alamat pengiriman.",
    },
    { id: 2, orderId: 1006, reason: "Tidak sengaja melakukan pemesanan." },
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
    const newCheckout = {
      ...checkoutData,
      id: Date.now(),
      tanggal: new Date().toISOString(),
      status: "diproses",
    };
    setCheckouts([...checkouts, newCheckout]);
    setCart([]);
    navigate("/pesanan");
    return {
      success: true,
      message: "Checkout berhasil! Terima kasih telah berbelanja.",
    };
  };

  const handleLogin = (identifier, password) => {
    const userAccount =
      users.find((u) => u.email === identifier || u.username === identifier) ||
      (adminUser.email === identifier || adminUser.username === identifier
        ? adminUser
        : null);
    if (!userAccount)
      return "Pengguna dengan email atau username tersebut tidak ditemukan.";
    if (userAccount.password !== password)
      return "Password yang Anda masukkan salah.";
    if (userAccount.isBanned) return "Akun ini telah ditangguhkan.";
    const isAdminLogin = userAccount.id === adminUser.id;
    setUser(userAccount);
    setIsAdmin(isAdminLogin);
    if (isAdminLogin) {
      navigate("/admin");
    }
    setShowProfile(false);
    return null;
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    navigate("/");
  };

  const handleRequestReturn = (returnData) => {
    setReturns([...returns, { ...returnData, id: Date.now() }]);
    setCheckouts(
      checkouts.map((order) =>
        order.id === returnData.orderId
          ? { ...order, status: "pengembalian" }
          : order
      )
    );
    navigate("/pesanan");
  };

  const handleAddReview = (reviewData) => {
    if (!user) return;
    const newReview = {
      ...reviewData,
      id: Date.now(),
      userId: user.id,
      date: new Date().toISOString().split("T")[0],
    };
    setReviews([...reviews, newReview]);
    navigate("/pesanan");
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
  const handleConfirmOrderFinished = (orderId) => {
    setCheckouts(
      checkouts.map((order) =>
        order.id === orderId ? { ...order, status: "selesai" } : order
      )
    );
  };
  const handleApproveReturn = (orderId) => {
    setCheckouts(
      checkouts.map((order) =>
        order.id === orderId
          ? { ...order, status: "pengembalian berhasil" }
          : order
      )
    );
  };
  const handleRejectReturn = (orderId) => {
    setCheckouts(
      checkouts.map((order) =>
        order.id === orderId
          ? { ...order, status: "pengembalian ditolak" }
          : order
      )
    );
  };
  const handleRequestCancellation = (orderId, reason) => {
    setCancellations([...cancellations, { id: Date.now(), orderId, reason }]);
    setCheckouts(
      checkouts.map((o) =>
        o.id === orderId ? { ...o, status: "pembatalan diajukan" } : o
      )
    );
  };
  const handleApproveCancellation = (orderId) => {
    setCheckouts(
      checkouts.map((o) =>
        o.id === orderId ? { ...o, status: "dibatalkan" } : o
      )
    );
  };
  const handleRejectCancellation = (orderId) => {
    setCheckouts(
      checkouts.map((o) =>
        o.id === orderId ? { ...o, status: "diproses" } : o
      )
    );
  };
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setCheckouts(
      checkouts.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const [allProducts, setAllProducts] = useState([]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar setShowProfile={setShowProfile} user={user} isAdmin={isAdmin} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/shop"
            element={
              <Shop
                produk={produk}
                user={user}
                onAddToCart={handleAddToCart}
                cartCount={cart.length}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetailWrapper
                produk={produk}
                reviews={reviews}
                users={users}
                user={user}
                onAddToCart={handleAddToCart}
                cartCount={cart.length}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                produk={produk}
                user={user}
                vouchers={vouchers}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemove={handleRemoveFromCart}
                onCheckout={handleCheckout}
              />
            }
          />
          <Route
            path="/pesanan"
            element={
              <Pesanan
                checkouts={checkouts}
                user={user}
                reviews={reviews}
                onConfirmFinished={handleConfirmOrderFinished}
                onRequestCancellation={handleRequestCancellation}
              />
            }
          />
          <Route
            path="/review/:productId"
            element={
              <ReviewWrapper produk={produk} onAddReview={handleAddReview} />
            }
          />
          <Route
            path="/pengembalian-barang/:orderId"
            element={
              <PengembalianBarangWrapper
                checkouts={checkouts}
                onSubmitReturn={handleRequestReturn}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/location" element={<Location />} />
          <Route
            path="/profile"
            element={
              user ? (
                <Profile
                  user={user}
                  onAvatarChange={handleAvatarChange}
                  onProfileUpdate={handleProfileUpdate}
                  onPasswordChange={handlePasswordChange}
                />
              ) : (
                <Home />
              )
            }
          />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <Admin
                  users={users}
                  vouchers={vouchers}
                  produk={produk}
                  checkouts={checkouts}
                  returns={returns}
                  cancellations={cancellations}
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
                  onApproveReturn={handleApproveReturn}
                  onRejectReturn={handleRejectReturn}
                  onApproveCancellation={handleApproveCancellation}
                  onRejectCancellation={handleRejectCancellation}
                />
              ) : (
                <Home />
              )
            }
          />
          <Route
            path="/laporan"
            element={
              isAdmin ? <LaporanPesanan checkouts={checkouts} /> : <Home />
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
      <ProfileSlide
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
      />
    </div>
  );
}

const ProductDetailWrapper = ({
  produk,
  reviews,
  users,
  user,
  onAddToCart,
  cartCount,
}) => {
  const { id } = useParams();
  const selectedProduct = produk.find((p) => p._id === parseInt(id));
  return (
    <ProductDetail
      product={selectedProduct}
      reviews={reviews}
      users={users}
      user={user}
      onAddToCart={onAddToCart}
      cartCount={cartCount}
    />
  );
};

const ReviewWrapper = ({ produk, onAddReview }) => {
  const { productId } = useParams();
  const productToReview = produk.find((p) => p._id === parseInt(productId));
  return <Review product={productToReview} onAddReview={onAddReview} />;
};

const PengembalianBarangWrapper = ({ checkouts, onSubmitReturn }) => {
  const { orderId } = useParams();
  const orderToReturn = checkouts.find(
    (order) => order.id === parseInt(orderId)
  );
  return (
    <PengembalianBarang order={orderToReturn} onSubmitReturn={onSubmitReturn} />
  );
};

export default App;
