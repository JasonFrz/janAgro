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
import "./index.css";

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
      code: "DISKONBESAR",
      discountPercentage: 50,
      maxUses: 20,
      currentUses: 19,
      isActive: true,
    },
    {
      id: 3,
      code: "WELCOME25",
      discountPercentage: 25,
      maxUses: 500,
      currentUses: 500,
      isActive: false,
    },
  ]);


  const handleLogin = (identifier, password) => {
    const potentialUser = users.find(
      (u) => u.email === identifier || u.username === identifier
    );
    if (potentialUser && potentialUser.isBanned)
      return "Akun ini telah ditangguhkan.";
    const isAdminLogin =
      (adminUser.email === identifier || adminUser.username === identifier) &&
      adminUser.password === password;
    if (isAdminLogin) {
      setUser(adminUser);
      setIsAdmin(true);
      setActiveSection("admin");
      setShowProfile(false);
      return null;
    }
    const foundUser = users.find(
      (u) =>
        (u.email === identifier || u.username === identifier) &&
        u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      setIsAdmin(false);
      setShowProfile(false);
      return null;
    }
    return "Email/Username atau password yang Anda masukkan salah.";
  };

  const handleRegister = (username, name, email, password) => {
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
    setActiveSection("home");
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
  const handleProfileUpdate = (newName) => {
    if (!user) return;
    const updatedUser = { ...user, name: newName };
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
  const handleAddVoucher = (id, newData) => {
    const newVoucher = { ...newData, id: Date.now(), currentUses: 0 };
    setVouchers([...vouchers, newVoucher]);
  };
  const handleUpdateVoucher = (voucherId, updatedData) =>
    setVouchers(
      vouchers.map((v) => (v.id === voucherId ? { ...v, ...updatedData } : v))
    );
  const handleDeleteVoucher = (voucherId) =>
    setVouchers(vouchers.filter((v) => v.id !== voucherId));
  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <Home />;
      case "shop":
        return <Shop />;
      case "about":
        return <About />;
      case "admin":
        return isAdmin ? (
          <Admin
            users={users}
            vouchers={vouchers}
            onUpdateUser={handleUpdateUserByAdmin}
            onDeleteUser={handleDeleteUserByAdmin}
            onToggleBanUser={handleToggleBanUser}
            onAddVoucher={handleAddVoucher}
            onUpdateVoucher={handleUpdateVoucher}
            onDeleteVoucher={handleDeleteVoucher}
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
            setActiveSection={setActiveSection}
          />
        );
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
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
        setActiveSection={setActiveSection}
      />
    </div>
  );
}

export default App;
