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

    const renderContent = () => {
      switch (activeSection) {
        case 'home':
          return <Home />;
        case 'shop':
          return <Shop />;
        case 'about':
          return <About />;
        case 'admin':
          return <Admin />;
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
          setUser={setUser}
          setIsAdmin={setIsAdmin}
        />
      </div>
    );
  }

  export default App;