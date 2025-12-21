import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/auth/AuthContext";
import "./Chatbot.css";

interface Message {
  text: string;
  sender: "user" | "bot";
}

interface ChatbotProps {
  isFullPage?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ isFullPage = false }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [open, setOpen] = useState(isFullPage ? true : false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi 👋 How can I help you?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Only hide floating button on protected pages if not authenticated
  if (!isFullPage && !isAuthenticated && loading && location.pathname !== "/") {
    return null; // Don't show floating button if not authenticated on protected pages
  }

  const toggleChat = () => setOpen(!open);

  // Enhanced sendMessage with error handling and login redirect
  const sendMessage = async () => {
    if (!input.trim()) return;

    // If not authenticated, redirect to home with login modal
    if (!isAuthenticated) {
      // Show login prompt on home page
      if (location.pathname === "/") {
        setError("Please login to use the chatbot");
        // Trigger login modal in home page (HeroSection handles this)
        window.dispatchEvent(new CustomEvent("openLoginModal"));
      } else {
        // Redirect to home for login on other pages
        navigate("/", { replace: true });
      }
      return;
    }

    const userMsg: Message = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      // Get token for API request
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/api/chat",
        { question: userMsg.text },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          },
          timeout: 10000 // 10 second timeout
        }
      );

      // Validate response
      if (!response.data || !response.data.answer) {
        throw new Error("Invalid response from chatbot");
      }

      const botMsg: Message = {
        text: response.data.answer,
        sender: "bot"
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
      console.error(" Chatbot Error:", error);

      let errorMessage = " Unable to connect to chatbot";

      // Handle specific error types
      if (error.response?.status === 401) {
        errorMessage = " Session expired. Please login again";
        // Clear auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpiry");
        // Redirect to login
        navigate("/");
      } else if (error.response?.status === 403) {
        errorMessage = " Access denied to chatbot";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = " Request timeout. Please try again";
      } else if (error.message === "Network Error") {
        errorMessage = " Network error. Please check your connection";
      } else if (error.response?.data?.message) {
        errorMessage = ` ${error.response.data.message}`;
      }

      const errorMsg: Message = {
        text: errorMessage,
        sender: "bot"
      };
      setMessages(prev => [...prev, errorMsg]);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Robo Button - Always show (visible on all pages including home) */}
      {!isFullPage && (
        <div 
          className="chatbot-btn" 
          onClick={toggleChat} 
          title={isAuthenticated ? "Chat with us" : "Login to chat"}
        >
          🤖
        </div>
      )}

      {/* Chat Window */}
      {open && (
        <div className={isFullPage ? "chatbot-container-fullpage" : "chatbot-container"}>
          <div className="chat-header">
            <span>Chat with us</span>
            {!isFullPage && (
              <button className="close-btn" onClick={toggleChat} aria-label="Close chat">
                ✖
              </button>
            )}
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.sender === "user" ? "user-msg" : "bot-msg"}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bot-msg loading-indicator">
                <span className="typing-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {error && (
            <div className="chat-error" role="alert">
              {error}
            </div>
          )}

          <div className="chat-footer">
            <input
              type="text"
              value={input}
              placeholder={isAuthenticated ? "Type a message..." : "Login to chat"}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  sendMessage();
                }
              }}
              disabled={isLoading}
              aria-label="Message input"
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              title="Send message"
            >
              {isLoading ? "⏳" : "➤"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
