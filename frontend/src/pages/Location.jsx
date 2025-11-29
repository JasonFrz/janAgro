import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MessageCircle, X, Send } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client'; // Import Client Socket

const Location = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  
  const { user, token } = useSelector((state) => state.users);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null); // Ref untuk socket connection

  // 1. Initial Load & Socket Setup
  useEffect(() => {
    if (user && token) {
      // Load history chat via HTTP
      fetchMessages();

      // Connect Socket
      socketRef.current = io(import.meta.env.VITE_API_URL || "http://localhost:3000");
      
      // Join Room User
      socketRef.current.emit("join_chat", user.id);

      // Listen Pesan Masuk (Realtime dari Admin)
      socketRef.current.on("receive_message", (message) => {
        setMessages((prev) => [...prev, message]);
      });
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [user, token]);

  // Auto Scroll
  useEffect(() => {
    if (isChatOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/my-chat`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Gagal load chat", error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    // Optimistic Update UI
    const tempMsg = { sender: 'user', text: inputMsg, timestamp: new Date() };
    setMessages((prev) => [...prev, tempMsg]);
    setInputMsg("");

    try {
      // Kirim ke DB (Server akan emit socket notifikasi ke Admin)
      await axios.post(`${API_URL}/chat/send`, 
        { text: tempMsg.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Gagal kirim pesan", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-20 pb-6 px-4 relative">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800 text-center">Our Location</h1>
      <p className="text-base sm:text-lg text-gray-600 mb-6 text-center">Pondok Chandra Indah, Surabaya, Indonesia</p>
      
      <div className="w-full max-w-3xl h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden shadow-lg bg-white">
        <iframe
          title="Pondok Chandra Indah, Surabaya"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.707892340273!2d112.7405217746105!3d-7.253716794774775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fb17a00a0fb1%3A0x5e8f91b8b6eec6b5!2sPondok%20Chandra%20Indah%2C%20Surabaya%2C%20Indonesia!5e0!3m2!1sen!2sid!4v1705785000000!5m2!1sen!2sid"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      {/* --- CHAT FEATURE --- */}
      {user && (
        <>
          {/* Floating Button (Pojok Kanan Bawah) */}
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center gap-2 border-2 border-white"
            >
              <MessageCircle size={28} />
              <span className="font-bold hidden sm:inline">Chat Admin</span>
            </button>
          )}

          {/* Chat Popup */}
          {isChatOpen && (
            <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[450px] bg-white rounded-xl shadow-2xl border-2 border-gray-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
              
              {/* Header */}
              <div className="bg-black text-white p-4 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg">Live Support</h3>
                    <p className="text-xs text-gray-300">Online • Balasan cepat</p>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="hover:text-red-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <MessageCircle size={40} className="mb-2 opacity-50" />
                    <p className="text-sm">Halo! Ada yang bisa kami bantu?</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-black text-white self-end rounded-br-none'
                          : 'bg-white border text-black self-start rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`text-[10px] block mt-1 text-right ${msg.sender === 'user' ? 'text-gray-400' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Tulis pesan..."
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-black text-sm"
                />
                <button 
                    type="submit" 
                    disabled={!inputMsg.trim()}
                    className="bg-black text-white p-2 rounded-full hover:bg-gray-800 disabled:bg-gray-300 transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Location;