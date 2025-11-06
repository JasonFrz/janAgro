import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProfileSlide from "./components/ProfileSlide";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Ceo from "./pages/Ceo";
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
  const [isPemilik, setIsPemilik] = useState(false);
  const [cart, setCart] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            
            const data = await response.json();
            setUser(data.user);
            if (data.user.role === "Admin") {
              setIsAdmin(true);
            }
            if (data.user.role === "Pemilik") {
              setIsPemilik(true);
            }
          } else {
            localStorage.removeItem("token");
            setIsAdmin(false); // Pastikan state kembali false saat token invalid
            setIsPemilik(false);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          localStorage.removeItem("token");
          setIsAdmin(false);
          setIsPemilik(false);
        }
      }
    };

    
    // Fetch products
    // --- (Inside App.jsx's useEffect) ---

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (response.ok) {
          const data = await response.json();

          // --- THIS IS THE MOST IMPORTANT LOG ---
          // --- WHAT DOES THIS SAY IN YOUR CONSOLE? ---
          console.log("API response for products:", data);

          // This line assumes 'data' is an array [...]
          // or an object { products: [...] }
          setProduk(data.products || data);
        } else {
          console.error("Failed to fetch products");
          setProduk([]); // Set to empty on failure
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProduk([]); // Set to empty on failure
      }
    };

    fetchUserProfile();
    fetchProducts();
  }, []);


    useEffect(() => {
    if (user && user.role) {
      const role = user.role.toLowerCase();
      setIsAdmin(role === "admin");
      setIsPemilik(role === "pemilik");
    } else {
      setIsAdmin(false);
      setIsPemilik(false);
    }
  }, [user]);
  // You would also add functions here to fetch reviews, checkouts, etc.

  const [users, setUsers] = useState([]);

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
  const [produk, setProduk] = useState([]);
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
    // --- FIX ---
    // If no productId is given, do nothing. This stops the crash.
    if (!productId) {
      console.error("handleAddToCart called with undefined productId");
      return;
    }
    // --- END FIX ---

    const productIdStr = productId.toString();

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.productId && item.productId.toString() === productIdStr
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.productId && item.productId.toString() === productIdStr
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        console.log("Adding new item to cart:", productId);
        return [...prevCart, { productId: productId, quantity: 1 }];
      }
    });
    return "Produk ditambahkan ke keranjang!";
  };

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    // --- FIX ---
    if (!productId) {
      console.error("handleUpdateCartQuantity called with undefined productId");
      return;
    }
    // --- END FIX ---

    const productIdStr = productId.toString();

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId && item.productId.toString() === productIdStr
          ? { ...item, quantity: Math.max(0, newQuantity) }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    // --- FIX ---
    if (!productId) {
      console.error("handleRemoveFromCart called with undefined productId");
      return;
    }
    // --- END FIX ---

    const productIdStr = productId.toString();

    setCart((prevCart) =>
      prevCart.filter(
        (item) => !item.productId || item.productId.toString() !== productIdStr
      )
    );
  };

  const handleCheckout = (checkoutData) => {
    // This would be an API call
    console.log("Checkout:", checkoutData);
    setCart([]);
    navigate("/pesanan");
    return {
      success: true,
      message: "Checkout berhasil! Terima kasih telah berbelanja.",
    };
  };

  // --- handleLogin, handleRegister, and handleLogout logic moved to ProfileSlide.jsx ---

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

  // const [allProducts, setAllProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products/get-all-products`);
      if (response.ok) {
        const result = await response.json();
        setProduk(result.data || []);
      } else {
        console.error("Gagal mengambil data produk");
        setProduk([]);
      }
    } catch (error) {
      console.error("Error saat mengambil data produk:", error);
      setProduk([]);
    }
  };

  // [CREATE] Mengirim data produk baru ke server
  const handleAddProduk = async (newData) => {
    try {
      const response = await fetch(`${API_URL}/products/add-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Jika perlu
        },
        body: JSON.stringify(newData),
      });

      const result = await response.json();
      if (response.ok) {
        setProduk([...produk, result.data]);
        alert(result.message);
      } else {
        alert(result.message || "Gagal menambahkan produk.");
      }
    } catch (error) {
      console.error("Error saat menambahkan produk:", error);
      alert("Terjadi kesalahan pada server.");
    }
  };

  // [UPDATE] Mengirim data produk yang diperbarui ke server
  const handleUpdateProduk = async (produkId, updatedData) => {
    try {
      const response = await fetch(
        `${API_URL}/products/update-product/${produkId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Jika perlu
          },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setProduk(produk.map((p) => (p._id === produkId ? result.data : p)));
        alert(result.message);
      } else {
        alert(result.message || "Gagal memperbarui produk.");
      }
    } catch (error) {
      console.error("Error saat memperbarui produk:", error);
      alert("Terjadi kesalahan pada server.");
    }
  };

  // [DELETE] Menghapus produk dari server
  const handleDeleteProduk = async (produkId) => {
    try {
      const response = await fetch(
        `${API_URL}/products/delete-product/${produkId}`,
        {
          method: "DELETE",
          headers: {
            // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Jika perlu
          },
        }
      );

      const result = await response.json();
      if (response.ok) {
        setProduk(produk.filter((p) => p._id !== produkId));
        alert(result.message);
      } else {
        alert(result.message || "Gagal menghapus produk.");
      }
    } catch (error) {
      console.error("Error saat menghapus produk:", error);
      alert("Terjadi kesalahan pada server.");
    }
  };

  const fetchVouchers = async () => {
    try {
      const response = await fetch(`${API_URL}/vouchers/get-all-vouchers`);
      if (response.ok) {
        const result = await response.json();
        setVouchers(result.data || []);
      } else {
        console.error("Gagal mengambil data voucher");
      }
    } catch (error) {
      console.error("Error saat mengambil data voucher:", error);
    }
  };

  const handleAddVoucher = async (voucherData) => {
    try {
      const response = await fetch(`${API_URL}/vouchers/add-voucher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(voucherData),
      });
      const result = await response.json();
      if (response.ok) {
        setVouchers([result.data, ...vouchers]); // Tambahkan di awal array
        alert(result.message);
      } else {
        alert(result.message || "Gagal menambahkan voucher.");
      }
    } catch (error) {
      alert("Terjadi kesalahan pada server.");
    }
  };

  const handleUpdateVoucher = async (voucherId, updatedData) => {
    try {
      const response = await fetch(
        `${API_URL}/vouchers/update-voucher/${voucherId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setVouchers(
          vouchers.map((v) => (v._id === voucherId ? result.data : v))
        );
        alert(result.message);
      } else {
        alert(result.message || "Gagal memperbarui voucher.");
      }
    } catch (error) {
      alert("Terjadi kesalahan pada server.");
    }
  };

  // [DELETE] Menghapus voucher
  const handleDeleteVoucher = async (voucherId) => {
    try {
      const response = await fetch(
        `${API_URL}/vouchers/delete-voucher/${voucherId}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (response.ok) {
        setVouchers(vouchers.filter((v) => v._id !== voucherId));
        alert(result.message);
      } else {
        alert(result.message || "Gagal menghapus voucher.");
      }
    } catch (error) {
      alert("Terjadi kesalahan pada server.");
    }
  };

  // useEffect untuk memuat data saat komponen pertama kali dirender
  useEffect(() => {
    // fetchUserProfile(); // Panggil fungsi untuk mengambil data user
    fetchVouchers();
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        setShowProfile={setShowProfile}
        user={user}
        isAdmin={isAdmin}
        isPemilik={isPemilik}
      />
      <main>
        <Routes>
          <Route path="/" element={<Home API_URL={API_URL} />} />
          <Route
            path="/shop"
            element={
              <Shop
                produk={produk}
                user={user}
                onAddToCart={handleAddToCart}
                cartCount={cart.length}
                API_URL={API_URL}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetailWrapper
                produk={produk}
                reviews={reviews}
                // users={users} // This data is not available yet
                user={user}
                onAddToCart={handleAddToCart}
                cartCount={cart.length}
                API_URL={API_URL}
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
                API_URL={API_URL}
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
                // onConfirmFinished={handleConfirmOrderFinished}
                // onRequestCancellation={handleRequestCancellation}
                API_URL={API_URL}
              />
            }
          />
          <Route
            path="/review/:productId"
            element={
              <ReviewWrapper
                produk={produk}
                // onAddReview={handleAddReview}
                API_URL={API_URL}
              />
            }
          />
          <Route
            path="/pengembalian-barang/:orderId"
            element={
              <PengembalianBarangWrapper
                checkouts={checkouts}
                // onSubmitReturn={handleRequestReturn}
                API_URL={API_URL}
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
                  // onAvatarChange={handleAvatarChange}
                  // onProfileUpdate={handleProfileUpdate}
                  // onPasswordChange={handlePasswordChange}
                  API_URL={API_URL}
                />
              ) : (
                <Home API_URL={API_URL} /> // Redirect to Home if no user
              )
            }
          />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <Admin
                  // users={users}
                  vouchers={vouchers}
                  onAddVoucher={handleAddVoucher}
                  onUpdateVoucher={handleUpdateVoucher}
                  onDeleteVoucher={handleDeleteVoucher}
                  produk={produk}
                  checkouts={checkouts}
                  // returns={returns}
                  // cancellations={cancellations}
                  // ... (pass other admin props & handlers) ..
                  // .
                  onAddProduk={handleAddProduk}
                  onUpdateProduk={handleUpdateProduk}
                  onDeleteProduk={handleDeleteProduk}
                  API_URL={API_URL}
                />
              ) : (
                <Home API_URL={API_URL} /> // Redirect to Home if not admin
              )
            }
          />
          <Route
            path="/ceo"
            element={
              isPemilik ? (
                <Ceo
                  users={users}
                  vouchers={vouchers}
                  produk={produk}
                  checkouts={checkouts}
                  returns={returns}
                  cancellations={cancellations}
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
                <Home API_URL={API_URL} /> // Redirect jika bukan pemilik
              )
            }
          />
          <Route
            path="/laporan"
            element={
              isAdmin || isPemilik ? (
                <LaporanPesanan checkouts={checkouts} />
              ) : (
                <Home API_URL={API_URL} />
              )
            }
          />
          <Route path="*" element={<Home API_URL={API_URL} />} />
        </Routes>
      </main>

      <Footer />
      <ProfileSlide
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        setUser={setUser}
        setIsAdmin={setIsAdmin}
        setShowProfile={setShowProfile}
        API_URL={API_URL}
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
  API_URL,
}) => {
  const { id } = useParams();
  // Find product from the fetched list
  const selectedProduct = produk.find((p) => p._id === id);

  // You might need to add a check here if 'produk' is still loading
  if (produk.length === 0) {
    return <div>Loading product...</div>; // Or a loading spinner
  }

  // Handle if product not found (e.g., bad ID)
  if (!selectedProduct) {
    return <div>Product not found.</div>;
  }

  return (
    <ProductDetail
      product={selectedProduct}
      reviews={reviews}
      users={users}
      user={user}
      onAddToCart={onAddToCart}
      cartCount={cartCount}
      API_URL={API_URL}
    />
  );
};

const ReviewWrapper = ({ produk, onAddReview, API_URL }) => {
  const { productId } = useParams();
  const productToReview = produk.find((p) => p._id === productId);

  if (produk.length === 0) {
    return <div>Loading product...</div>;
  }

  return (
    <Review
      product={productToReview}
      onAddReview={onAddReview}
      API_URL={API_URL}
    />
  );
};

const PengembalianBarangWrapper = ({ checkouts, onSubmitReturn, API_URL }) => {
  const { orderId } = useParams();
  const orderToReturn = checkouts.find(
    (order) => order.id === parseInt(orderId)
  );

  if (checkouts.length === 0) {
    return <div>Loading order...</div>;
  }

  return (
    <PengembalianBarang
      order={orderToReturn}
      onSubmitReturn={onSubmitReturn}
      API_URL={API_URL}
    />
  );
};

export default App;
