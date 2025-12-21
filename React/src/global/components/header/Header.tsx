import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Header.css";

import Modal from "../Modal";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { AuthContext } from "@/auth/AuthContext"; //  Import AuthContext

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  // AUTH MODAL
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // PROFILE DROPDOWN
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // MOBILE MENU
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleProtectedNavigation = (path: string) => {
    if (!isAuthenticated) {
      setIsLogin(true);
      setShowAuth(true);
    } else {
      navigate(path);
      setShowMobileMenu(false); // Close menu after navigation
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when clicking a nav link (already done in handleProtectedNavigation)
  // Also close menu when clicking outside on mobile
  useEffect(() => {
    const handleMobileMenuClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hamburgerBtn = document.querySelector(".hamburger-btn");
      const navLinks = document.querySelector(".nav-links");
      
      if (
        showMobileMenu &&
        !hamburgerBtn?.contains(target) &&
        !navLinks?.contains(target)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleMobileMenuClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleMobileMenuClickOutside);
  }, [showMobileMenu]);

  return (
    <>
      <nav className="navbar-custom container-fluid">
        {/* Logo */}
        <Link to="/" className="logo-box">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966486.png"
            alt="logo"
          />
          <h4 className="m-0 fw-bold">Dia Assist</h4>
        </Link>

        {/* Nav Links */}
        <ul className={`nav-links ${showMobileMenu ? "active" : ""}`}>
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => handleProtectedNavigation("/dashboard")}>Dashboard</li>
          <li onClick={() => handleProtectedNavigation("/predict")}>Predict</li>
          <li onClick={() => handleProtectedNavigation("/diet")}>Diet Plan</li>
          <li onClick={() => handleProtectedNavigation("/history")}>History</li>
        </ul>

        {/* Hamburger Menu Button (Mobile) */}
        <button 
          className="hamburger-btn" 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle menu"
        >
          <span className={showMobileMenu ? "open" : ""}></span>
          <span className={showMobileMenu ? "open" : ""}></span>
          <span className={showMobileMenu ? "open" : ""}></span>
        </button>

        {/* RIGHT SIDE */}
        <div className="action-buttons">
          {!isAuthenticated ? (
            /* SIGN IN */
            <button
              className="sign-btn"
              onClick={() => {
                setIsLogin(true);
                setShowAuth(true);
              }}
            >
              Sign In
            </button>
          ) : (
            /* PROFILE */
            user && (
              <div className="profile-wrapper" ref={profileRef}>
                <div
                  className="profile-avatar"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {showProfile && (
                  <div className="profile-dropdown">
                    <div className="profile-info">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>

                    <button
                      className="logout-btn"
                      onClick={() => {
                        logout(); //  Use context logout
                        setShowProfile(false);
                        navigate("/");
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </nav>

      {/* AUTH MODAL */}
      <Modal isOpen={showAuth} onClose={() => setShowAuth(false)}>
        {isLogin ? (
          <Login
            switchToRegister={() => setIsLogin(false)}
            onSuccess={() => setShowAuth(false)}
          />
        ) : (
          <Register switchToLogin={() => setIsLogin(true)} />
        )}
      </Modal>
    </>
  );
};

export default Navbar;
