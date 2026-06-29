import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// ADDED: Bring in your base URL environment variable for asset mapping
const BACKEND_URL = 
  import.meta.env.VITE_SITE_URL || 
  "http://localhost:5000";

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, settingsRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/settings`),
        ]);

        const catData = await catRes.json();
        const settingsData = await settingsRes.json();

        setCategories(
          Array.isArray(catData)
            ? catData
            : catData.data || []
        );

        setSettings(settingsData?.data || null);
      } catch (error) {
        console.log(error);
      }
    }

    loadData();
  }, []);

  const activeCategories = categories
    .filter(
      (item) =>
        item.status === "active" &&
        item.parent === null
    )
    .slice(0, 5);

  // ADDED: Safe formatting helper function for the logo image path
  const getLogoUrl = () => {
    if (!settings?.logo) return "/logo.png"; // Fallback to local image if empty
    if (settings.logo.startsWith("http")) return settings.logo; // Return if already an absolute link
    return `${BACKEND_URL}${settings.logo.startsWith("/") ? "" : "/"}${settings.logo}`;
  };

  return (
    <footer className="bg-[#1D3549] text-white border-t-4 border-[#1CA16B]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Company Info */}
          <div className="text-center lg:text-left">
            {/* CHANGED: Passing path through the getLogoUrl custom formatter */}
            <img
              src={getLogoUrl()}
              alt={settings?.companyName || "Logo"}
              className="h-14 w-auto object-contain mx-auto lg:mx-0"
            />

            <p className="mt-6 text-gray-300 leading-relaxed">
              Delivering premium products and innovative
              solutions for modern businesses worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-[#1CA16B] transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about-us"
                  className="text-gray-300 hover:text-[#1CA16B] transition"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="text-gray-300 hover:text-[#1CA16B] transition"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/contact-us"
                  className="text-gray-300 hover:text-[#1CA16B] transition"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-semibold mb-5">
              Categories
            </h3>

            <ul className="space-y-3">
              {activeCategories.map((category) => (
                <li key={category._id || category.id}>
                  <Link
                    to={`/products?category=${category.slug}`}
                    className="text-gray-300 hover:text-[#1CA16B] transition"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-semibold mb-5">
              Contact
            </h3>

            <ul className="space-y-4">
              <li>
                📍 {settings?.address}
              </li>

              <li>
                <a
                  href={`tel:${settings?.phone}`}
                  className="hover:text-[#1CA16B]"
                >
                  📞 {settings?.phone}
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${settings?.email}`}
                  className="hover:text-[#1CA16B]"
                >
                  {settings?.email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-[#19535B]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-gray-400 text-sm">
              {settings?.copyright ||
                "© 2026 All Rights Reserved."}
            </p>

            <div className="flex gap-6">

              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook
                </a>
              )}

              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              )}

              {settings?.linkedin && (
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              )}

            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}