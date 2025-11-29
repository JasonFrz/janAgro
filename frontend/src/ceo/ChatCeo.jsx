import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Send, User, MessageSquare, AlertTriangle } from "lucide-react";

// --- LOGIC URL CLEANER (Agar tidak double /api/api) ---
const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
// Hapus slash di akhir jika ada
const cleanBaseUrl = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
// Socket URL (Biasanya hanya host, misal localhost:3000 tanpa /api)
const SOCKET_URL = cleanBaseUrl.replace(/\/api$/, "");
// API URL (Pastikan berakhiran /api)
const API_BASE = cleanBaseUrl.endsWith("/api")
  ? cleanBaseUrl
  : `${cleanBaseUrl}/api`;

// Inisialisasi Socket
const socket = io(SOCKET_URL);

const ChatCeo = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  // Helper: Decode JWT
  const debugTokenRole = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const decoded = JSON.parse(jsonPayload);

      console.log("🔍 DEBUG INFO:");
      console.log("- URL API Final:", API_BASE);
      console.log("- Role di Token:", decoded.role);

      if (decoded.role !== "Pemilik") {
        console.warn(
          "⚠️ PERINGATAN ROLE: Middleware Backend mewajibkan 'Pemilik' (P Besar). Role Anda: '" +
            decoded.role +
            "'"
        );
      }
    } catch (e) {
      console.error("Gagal decode token", e);
    }
  };

  useEffect(() => {
    if (token) {
      debugTokenRole(token);
      fetchChats();
    } else {
      setErrorMsg("Token tidak ditemukan. Silakan Login ulang.");
    }

    socket.emit("join_admin");

    socket.on("receive_message", (data) => {
      setChats((prevChats) => {
        const existingIdx = prevChats.findIndex(
          (c) => c.userId._id === data.userId
        );
        let newChats = [...prevChats];

        if (existingIdx !== -1) {
          const updatedChat = { ...newChats[existingIdx] };
          updatedChat.messages = [...updatedChat.messages, data.message];
          updatedChat.lastMessageAt = new Date();
          newChats.splice(existingIdx, 1);
          newChats.unshift(updatedChat);
        } else {
          fetchChats();
        }
        return newChats;
      });

      setSelectedChat((prev) => {
        if (prev && prev.userId._id === data.userId) {
          return {
            ...prev,
            messages: [...prev.messages, data.message],
          };
        }
        return prev;
      });
    });

    return () => {
      socket.off("receive_message");
    };
  }, [token]);

  const fetchChats = async () => {
    try {
      setErrorMsg(null);
      // URL sudah dipastikan benar oleh logic di atas
      const response = await axios.get(`${API_BASE}/chat/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setChats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      if (error.response?.status === 404) {
        setErrorMsg(`URL Salah (404): ${error.config.url}`);
      } else if (error.response?.status === 403) {
        setErrorMsg(
          "AKSES DITOLAK (403): Role user di database harus 'Pemilik' (P besar)."
        );
      } else {
        setErrorMsg("Gagal memuat chat. Pastikan server backend jalan.");
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChat) return;

    const optimisticMsg = {
      sender: "admin",
      text: replyText,
      timestamp: new Date(),
    };
    setSelectedChat((prev) => ({
      ...prev,
      messages: [...prev.messages, optimisticMsg],
    }));
    setChats((prev) => {
      const idx = prev.findIndex((c) => c._id === selectedChat._id);
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx].messages.push(optimisticMsg);
      return updated;
    });

    const msgToSend = replyText;
    setReplyText("");

    try {
      await axios.post(
        `${API_BASE}/chat/admin/reply`,
        { targetUserId: selectedChat.userId._id, text: msgToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Gagal reply:", error);
      alert("Gagal mengirim pesan.");
    }
  };

  // Tampilan Error
  if (errorMsg) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-white border-4 border-black mt-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center p-8 max-w-lg">
          <AlertTriangle size={64} className="mx-auto mb-4 text-black" />
          <h2 className="text-2xl font-black uppercase mb-2">
            Terjadi Masalah
          </h2>
          <p className="font-mono text-sm mb-6 bg-red-100 p-4 border border-red-300 break-words">
            {errorMsg}
          </p>
          <div className="text-xs text-left bg-gray-100 p-4 border border-gray-300">
            <strong>Checklist Perbaikan:</strong>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              <li>
                Jika error <b>403</b>: Buka MongoDB, cari user Anda, ubah field{" "}
                <code>role</code> menjadi <b>Pemilik</b> (Persis seperti ini).
              </li>
              <li>
                Jika error <b>404</b>: Cek console browser (F12) untuk melihat
                URL API Final yang salah.
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[80vh] bg-white border-4 border-black font-sans text-black mt-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {/* SIDEBAR */}
      <div className="w-1/3 border-r-4 border-black flex flex-col bg-gray-50">
        <div className="p-6 border-b-4 border-black bg-black text-white">
          <h2 className="font-black text-2xl tracking-tighter uppercase">
            INBOX
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-6 text-center text-gray-400 font-mono text-sm">
              Belum ada percakapan
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`p-5 border-b-2 border-black cursor-pointer transition-all duration-200 group relative
                  ${
                    selectedChat?._id === chat._id
                      ? "bg-black text-white"
                      : "hover:bg-gray-200 bg-white text-black"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 border-2 border-black flex items-center justify-center font-bold text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                      ${
                        selectedChat?._id === chat._id
                          ? "bg-white text-black"
                          : "bg-white text-black"
                      }
                  `}
                  >
                    {chat.userId?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-black text-base uppercase truncate">
                      {chat.userId?.name || "Unknown"}
                    </h4>
                    <p
                      className={`text-xs font-mono truncate mt-1 ${
                        selectedChat?._id === chat._id
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      {chat.messages[chat.messages.length - 1]?.text || "..."}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="w-2/3 flex flex-col bg-white relative">
        {selectedChat ? (
          <>
            <div className="p-4 border-b-4 border-black flex items-center justify-between bg-white z-10">
              <div>
                <h2 className="font-black text-xl uppercase tracking-tight">
                  {selectedChat.userId?.name}
                </h2>
                <span className="text-xs font-mono bg-black text-white px-2 py-1">
                  ID: {selectedChat.userId?._id}
                </span>
              </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
              {selectedChat.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[70%] p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    msg.sender === "admin"
                      ? "self-end bg-black text-white"
                      : "self-start bg-white text-black"
                  }`}
                >
                  <p className="text-sm font-bold leading-relaxed">
                    {msg.text}
                  </p>
                  <span
                    className={`text-[10px] block mt-3 text-right font-mono uppercase tracking-widest ${
                      msg.sender === "admin" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleReply}
              className="p-0 border-t-4 border-black bg-white flex"
            >
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="TYPE MESSAGE..."
                className="flex-1 px-6 py-5 focus:outline-none font-mono text-sm placeholder:text-gray-400 bg-white text-black"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="bg-black text-white px-10 border-l-4 border-black font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                SEND
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <div className="p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white text-center">
              <MessageSquare
                size={64}
                strokeWidth={2.5}
                className="mx-auto mb-4"
              />
              <h3 className="font-black text-xl uppercase">No Chat Selected</h3>
              <p className="font-mono text-sm mt-2 text-gray-500">
                Select a user from the sidebar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatCeo;
