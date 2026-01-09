import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Header.css"
 
import Modal from "../../modal/components/Modal";
import Login from "@/pages/auth/components/Login";
import Register from "@/pages/auth/components/Register";
import { AuthContext } from "@/auth/AuthContext";
 
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
 
  // AUTH MODAL
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
 
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
 
  const [showMobileMenu, setShowMobileMenu] = useState(false);
 
  const handleProtectedNavigation = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
      setShowMobileMenu(false); // Close menu after navigation
    } else {
      setIsLogin(true);
      setShowAuth(true);
    }
  };
 
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
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
        <Link to="/" className="logo-box">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966486.png"
          />
          <h4 className="m-0 fw-bold">Dia Assist</h4>
        </Link>

        {/* Backdrop overlay for mobile menu */}
        {showMobileMenu && (
          <div 
            className="menu-backdrop"
            onClick={() => setShowMobileMenu(false)}
          />
        )}

        <ul className={`nav-links ${showMobileMenu ? "active" : ""}`}>
          <li onClick={() => {
            navigate("/");
            setShowMobileMenu(false);
          }}>Home</li>
          <li onClick={() => handleProtectedNavigation("/dashboard")}>Dashboard</li>
          <li onClick={() => handleProtectedNavigation("/predict")}>Predict</li>
          <li onClick={() => handleProtectedNavigation("/diet")}>Diet Plan</li>
          <li onClick={() => handleProtectedNavigation("/history")}>History</li>
          
          {/* Mobile Auth Button - Sign In or Sign Out */}
          {isAuthenticated ? (
            <li className="mobile-logout-btn" onClick={() => {
              logout();
              setShowMobileMenu(false);
              navigate("/");
            }}>
              Sign Out
            </li>
          ) : (
            <li className="mobile-signin-btn" onClick={() => {
              setIsLogin(true);
              setShowAuth(true);
              setShowMobileMenu(false);
            }}>
              
              Sign In
            </li>
          )}
        </ul>
 
        <button
          className="hamburger-btn"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <span className={showMobileMenu ? "open" : ""}></span>
          <span className={showMobileMenu ? "open" : ""}></span>
          <span className={showMobileMenu ? "open" : ""}></span>
        </button>
 
        <div className="action-buttons">
          {!isAuthenticated ? (
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
                        logout();
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