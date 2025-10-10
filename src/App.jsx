import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProfileSlide from './components/ProfileSlide';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Admin from './pages/Admin';
import Location from './pages/Location';
import './index.css' 

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'user@example.com', password: 'password123', joinDate: '2023' }
    
  ]);
  const adminUser = { id: 99, name: 'Admin', email: 'admin@gmail.com', password: 'admin', joinDate: '2022' };

  const handleLogin = (email, password) => {
    if (email === adminUser.email && password === adminUser.password) {
      setUser(adminUser);
      setIsAdmin(true);
      setActiveSection('admin');
      setShowProfile(false);
      return null; 
    }

    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      setIsAdmin(false);
      setShowProfile(false);
      return null; 
    } else {
      return 'Email atau password yang Anda masukkan salah.'; // Gagal, kembalikan pesan error
    }
  };

  const handleRegister = (name, email, password) => {
    if (users.find(u => u.email === email) || email === adminUser.email) {
      return 'Email ini sudah terdaftar. Silakan gunakan email lain.'; // Gagal, kembalikan pesan error
    }
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password,
      joinDate: new Date().getFullYear().toString()
    };
    setUsers([...users, newUser]);
    return null; 
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setActiveSection('home');
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
      />
    </div>
  );
}

export default App;