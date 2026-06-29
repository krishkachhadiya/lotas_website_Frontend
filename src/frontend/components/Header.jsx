import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// ADDED: Pull your base URL environment variable for images
const BACKEND_URL = 
  import.meta.env.VITE_SITE_URL || 
  "http://localhost:5000";

const MENU_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Products", href: "/products" },
  { label: "Contact Us", href: "/contact-us" },
];

export default function Header() {
  const location = useLocation();
  const pathname = location.pathname;

  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch(`${API_URL}/settings`);
        const result = await response.json();

        if (result.success) {
          setSettings(result.data);
        }
      } catch (error) {
        console.error("Failed fetching settings:", error);
      }
    }

    fetchSettings();
  }, []);

  function isActiveRoute(href) {
    return pathname === href;
  }

  // Helper to format logo path securely
  const getLogoUrl = () => {
    if (!settings?.logo) return "/logo.png"; // Fallback to local default if missing
    if (settings.logo.startsWith("http")) return settings.logo; // Already absolute URL
    return `${BACKEND_URL}${settings.logo.startsWith("/") ? "" : "/"}${settings.logo}`;
  };


  return (
    <header className="sticky top-0 z-50 bg-[#1D3549] shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
          {/* Logo */}
          <Link to="/">
            <img
              src={getLogoUrl()} // CHANGED: Now using the helper to append backend domain
              alt={settings?.companyName || "Logo"}
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`relative font-medium py-2 transition-all duration-300 ${
                  isActiveRoute(item.href)
                    ? "text-[#1CA16B]"
                    : "text-white/80 hover:text-[#1CA16B]"
                }`}
              >
                {item.label}

                {isActiveRoute(item.href) && (
                  <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#1CA16B] rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-3xl"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1D3549] border-t border-white/10">
          <div className="flex flex-col px-4 py-4">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={`py-3 border-b border-white/10 ${
                  isActiveRoute(item.href)
                    ? "text-[#1CA16B]"
                    : "text-white/80"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              to="/contact-us"
              onClick={() => setMenuOpen(false)}
              className="mt-4 bg-[#1CA16B] text-center py-3 rounded-lg font-medium"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}