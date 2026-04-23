import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";

// ─── Small reusable helpers ────────────────────────────────────────────────

/** A single desktop nav link with an animated underline */
const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      className={`relative px-1 py-1 text-sm font-semibold tracking-wide transition-colors duration-200
        ${active ? "text-emerald-600" : "text-gray-500 hover:text-gray-900"}`}
    >
      {children}
      {/* animated underline */}
      <span
        className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-emerald-500 transition-all duration-300
          ${active ? "w-full" : "w-0 group-hover:w-full"}`}
      />
    </Link>
  );
};

/** Mobile full-width nav link */
const MobileNavLink = ({ to, children, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150
        ${active
          ? "bg-emerald-50 text-emerald-700"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
    >
      {children}
    </Link>
  );
};

/** Dropdown menu item */
const DropdownItem = ({ to, icon, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
  >
    <span className="text-base leading-none">{icon}</span>
    {children}
  </Link>
);

// ─── NAV CONFIG ────────────────────────────────────────────────────────────

const USER_LINKS = [
  { to: "/parkings",    label: "Parking",   icon: "🅿️"  },
  { to: "/my-bookings", label: "Bookings",  icon: "📋"  },
  { to: "/all-blogs",   label: "Blog",      icon: "📰"  },
  { to: "/about",       label: "About",     icon: "ℹ️"  },
];

const ADMIN_LINKS = [
  { to: "/admin",            label: "Explore",   icon: "🗺️"  },
  { to: "/admin/analytics",  label: "Analytics", icon: "📊"  },
  { to: "/admin/users",      label: "Users",     icon: "👥"  },
];

const USER_MENU_LINKS = [
  { to: "/profile",     icon: "👤", label: "Profile"     },
  { to: "/my-bookings", icon: "📋", label: "My Bookings" },
];

const ADMIN_MENU_LINKS = [
  { to: "/admin",          icon: "🛠️", label: "Admin Panel" },
  { to: "/admin/reports",  icon: "📈", label: "Reports"     },
  { to: "/admin/settings", icon: "⚙️", label: "Settings"    },
];

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────

export default function Navbar() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const navLinks    = isAdmin ? ADMIN_LINKS     : USER_LINKS;
  const menuLinks   = isAdmin ? ADMIN_MENU_LINKS : USER_MENU_LINKS;
  const userInitial = user?.name?.charAt(0).toUpperCase() ?? "U";
  const firstName   = user?.name?.split(" ")[0] ?? "User";

  // close user-menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <>
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600
                              flex items-center justify-center shadow-sm
                              group-hover:scale-105 transition-transform duration-200">
                <span className="text-white text-sm font-black tracking-tighter">SP</span>
              </div>
              <span className="hidden sm:block font-black text-lg text-gray-900 tracking-tight">
                Smart<span className="text-emerald-600">Parking</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to}>{label}</NavLink>
              ))}
            </div>

            {/* Right cluster */}
            <div className="flex items-center gap-2">

              {/* Notification */}
              <button
                aria-label="Notifications"
                className="relative w-9 h-9 flex items-center justify-center rounded-xl
                           text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* red dot */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              {/* Auth area */}
              {!user ? (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
                             bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold
                             shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Get Started
                </Link>
              ) : (
                /* User avatar + dropdown */
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    aria-expanded={userMenuOpen}
                    className="flex items-center gap-2 rounded-xl px-2 py-1.5
                               hover:bg-gray-100 transition-colors duration-150 focus:outline-none"
                  >
                    {/* Avatar circle */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600
                                    flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {userInitial}
                    </div>
                    <span className="hidden md:block text-sm font-semibold text-gray-800">{firstName}</span>
                    <svg
                      className={`hidden md:block w-3.5 h-3.5 text-gray-400 transition-transform duration-200
                                  ${userMenuOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white
                                    border border-gray-100 shadow-xl shadow-gray-200/60
                                    ring-1 ring-black/5 overflow-hidden
                                    animate-in fade-in slide-in-from-top-2 duration-150 z-50">

                      {/* User info header */}
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                        {!isAdmin && (
                          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold
                                           text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            ✦ Free Plan
                          </span>
                        )}
                        {isAdmin && (
                          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold
                                           text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                            ⚡ Admin
                          </span>
                        )}
                      </div>

                      {/* Menu links */}
                      <div className="py-1">
                        {menuLinks.map(({ to, icon, label }) => (
                          <DropdownItem key={to} to={to} icon={icon} onClick={() => setUserMenuOpen(false)}>
                            {label}
                          </DropdownItem>
                        ))}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium
                                     text-red-600 hover:bg-red-50 transition-colors duration-150"
                        >
                          <span className="text-base">↩</span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl
                           text-gray-600 hover:bg-gray-100 transition-colors duration-150"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ──────────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-0.5">

              {navLinks.map(({ to, label, icon }) => (
                <MobileNavLink key={to} to={to} onClick={() => setMobileOpen(false)}>
                  <span>{icon}</span> {label}
                </MobileNavLink>
              ))}

              {/* Get started button for guests */}
              {!user && (
                <div className="pt-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center w-full py-3 rounded-xl
                               bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold
                               transition-colors duration-150"
                  >
                    Get Started →
                  </Link>
                </div>
              )}

              {/* Logged-in user quick actions */}
              {user && !isAdmin && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="px-4 pb-1 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                    Account
                  </p>
                  {menuLinks.map(({ to, icon, label }) => (
                    <MobileNavLink key={to} to={to} onClick={() => setMobileOpen(false)}>
                      <span>{icon}</span> {label}
                    </MobileNavLink>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}