import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on window resize if open
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <span className="text-white font-bold text-lg lg:text-xl">CP</span>
              </div>
              <span className="text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                Smart Parking Finder
              </span>
        
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {!isAdmin ? (
              <>
                <NavLink to="/parkings">Parking</NavLink>
                <NavLink to="/my-bookings">Bookings</NavLink>
                <NavLink to="/all-blogs">Blog</NavLink>
                <NavLink to="/about">About</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/admin">Explore</NavLink>
                <NavLink to="/admin/analytics">Analytics</NavLink>
                <NavLink to="/admin/users">Users</NavLink>
              </>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
       

            {/* Notification Bell */}
            <button className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors rounded-full hover:bg-gray-100">
              <span className="text-xl">🔔</span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* User Section */}
            {!user ? (
              <Link
                to="/login"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Link>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none group"
                >
                  <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-all">
                    {getUserInitials()}
                  </div>
                  <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                    {user?.name?.split(' ')[0] || "User"}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 transition-all duration-200 ease-out origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || "user@citypark.com"}</p>
                      {!isAdmin && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          <span>⭐</span> 
                        </div>
                      )}
                    </div>
                    <div className="py-1">
                      {!isAdmin ? (
                        <>
                          <DropdownLink to="/profile">Profile</DropdownLink>
                          <DropdownLink to="/my-bookings">My Bookings</DropdownLink>
                        </>
                      ) : (
                        <>
                          <DropdownLink to="/admin">Admin Panel</DropdownLink>
                          <DropdownLink to="/admin/reports">Reports</DropdownLink>
                          <DropdownLink to="/admin/settings">Settings</DropdownLink>
                        </>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-inner transition-all duration-200 ease-out">
          <div className="px-4 py-3 space-y-1">
            {!isAdmin ? (
              <>
                <MobileNavLink to="/parkings" onClick={() => setMobileMenuOpen(false)}>Parking</MobileNavLink>
                <MobileNavLink to="/my-bookings" onClick={() => setMobileMenuOpen(false)}>Bookings</MobileNavLink>
                <MobileNavLink to="/all-blogs" onClick={() => setMobileMenuOpen(false)}>Blog</MobileNavLink>
                <MobileNavLink to="/about" onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
              </>
            ) : (
              <>
                <MobileNavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>Explore</MobileNavLink>
                <MobileNavLink to="/admin/analytics" onClick={() => setMobileMenuOpen(false)}>Analytics</MobileNavLink>
                <MobileNavLink to="/admin/users" onClick={() => setMobileMenuOpen(false)}>Users</MobileNavLink>
              </>
            )}
            
            {/* Mobile Sell Again Button for logged in users */}
            {user && !isAdmin && (
              <Link
                to="/sell-again"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-3 mt-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 text-amber-800 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  <span>Sell Again</span>
                </span>
                <span className="text-sm bg-amber-200 px-2 py-0.5 rounded-full">+$500k</span>
              </Link>
            )}
            
            {!user && (
              <div className="pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-full font-semibold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// Helper Components for styling
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-3 py-2.5 text-base font-medium text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
  >
    {children}
  </Link>
);

const DropdownLink = ({ to, children, highlight }) => (
  <Link
    to={to}
    className={`block px-4 py-2.5 text-sm transition-colors ${
      highlight
        ? "text-amber-700 bg-amber-50 hover:bg-amber-100 font-medium"
        : "text-gray-700 hover:bg-gray-50"
    }`}
  >
    {children}
  </Link>
);