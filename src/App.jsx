import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProfileSlide from './components/ProfileSlide';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Admin from './pages/Admin';
import Location from './pages/Location';
import Profile from './pages/Profile';
import './index.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Data dummy diperbarui dengan 'username'
  const [users, setUsers] = useState([
    { id: 1, username: 'johndoe', name: 'John Doe', email: 'user@example.com', password: 'password123', joinDate: '2023', avatar: null }
  ]);
  const [adminUser, setAdminUser] = useState({ 
    id: 99, username: 'admin', name: 'Admin', email: 'admin@gmail.com', password: 'admin', joinDate: '2022', avatar: null 
  });

  // Logika login diperbarui untuk menerima 'identifier' (email atau username)
  const handleLogin = (identifier, password) => {
    const isAdminLogin = 
      (adminUser.email === identifier || adminUser.username === identifier) && adminUser.password === password;

    if (isAdminLogin) {
      setUser(adminUser);
      setIsAdmin(true);
      setActiveSection('admin');
      setShowProfile(false);
      return null;
    }

    const foundUser = users.find(u => 
      (u.email === identifier || u.username === identifier) && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      setIsAdmin(false);
      setShowProfile(false);
      return null;
    } else {
      return 'Email/Username atau password yang Anda masukkan salah.';
    }
  };

  // Logika pendaftaran diperbarui untuk menerima 'username' dan memeriksanya
  const handleRegister = (username, name, email, password) => {
    const cleanUsername = username.trim().toLowerCase();
    
    if (users.find(u => u.username === cleanUsername) || adminUser.username === cleanUsername) {
      return 'Username ini sudah digunakan. Silakan pilih yang lain.';
    }
    
    if (users.find(u => u.email === email) || adminUser.email === email) {
      return 'Email ini sudah terdaftar. Silakan gunakan email lain.';
    }

    const newUser = {
      id: users.length + 1,
      username: cleanUsername,
      name,
      email,
      password,
      joinDate: new Date().getFullYear().toString(),
      avatar: null
    };
    setUsers([...users, newUser]);
    return null;
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setActiveSection('home');
  };

  const handleAvatarChange = (newAvatarUrl) => {
    if (user) {
      const updatedUser = { ...user, avatar: newAvatarUrl };
      setUser(updatedUser);
      
      if (updatedUser.id === adminUser.id) {
        setAdminUser(updatedUser);
      } else {
        setUsers(prevUsers => 
          prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u))
        );
      }
    }
  };

  const handleProfileUpdate = (newName) => {
    if (!user) return;
    const updatedUser = { ...user, name: newName };
    setUser(updatedUser);

    if (updatedUser.id === adminUser.id) {
      setAdminUser(updatedUser);
    } else {
      setUsers(prevUsers => 
        prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u))
      );
    }
  };

  const handlePasswordChange = (currentPassword, newPassword) => {
    if (!user) {
      return { success: false, message: 'No user is currently logged in.' };
    }
    if (user.password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);

    if (updatedUser.id === adminUser.id) {
      setAdminUser(updatedUser);
    } else {
      setUsers(prevUsers => 
        prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u))
      );
    }
    
    return { success: true, message: 'Password updated successfully!' };
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <Home />;
      case 'shop':
        return <Shop />;
      case 'about':
        return <About />;
      case 'admin':
        return isAdmin ? <Admin /> : <Home />;
      case 'location':
        return <Location />;
      case 'profile':
        return <Profile 
                  user={user} 
                  onAvatarChange={handleAvatarChange}
                  onProfileUpdate={handleProfileUpdate}
                  onPasswordChange={handlePasswordChange}
                  setActiveSection={setActiveSection} 
                />;
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
      
      <main>
        {renderContent()}
      </main>
      
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