"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [admin, setAdmin] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ======================
    // CHECK LOGIN
    // ======================

    useEffect(() => {
        const storedAdmin = sessionStorage.getItem("admin");
        const token = localStorage.getItem("adminToken");

        if (storedAdmin && token) {
            const sessionAdmin = JSON.parse(storedAdmin);

            // ======================
            // ADMIN USER — full access, no role refresh needed
            // ======================

            if (sessionAdmin.role === "admin") {
                setAdmin(sessionAdmin);
                setIsLoggedIn(true);
                return;
            }

            // ======================
            // REFRESH ROLE — fetch fresh permissions from Express API
            // ======================

            fetch(`${API_URL}/roles`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    const matchedRole = data.roles?.find(
                        (role) => role.name === sessionAdmin.role
                    );

                    const updatedAdmin = {
                        ...sessionAdmin,
                        permissions: matchedRole?.permissions || {},
                    };

                    setAdmin(updatedAdmin);
                    sessionStorage.setItem("admin", JSON.stringify(updatedAdmin));
                    setIsLoggedIn(true);
                })
                .catch(() => {
                    navigate("/login");
                });
        } else {
            navigate("/login");
        }
    }, []);

    // ======================
    // LOGOUT
    // ======================

    function handleLogout() {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
    }

    // ======================
    // ACCESS DENIED
    // ======================

    function accessDenied() {
        window.location.href = "/admin";
        return null;
    }

    // ======================
    // DYNAMIC MENUS
    // ======================

    let menus = [];

    // ADMIN MENUS
    if (admin?.role === "admin") {
        menus = [
            { name: "Dashboard", path: "/admin" },
            { name: "Products", path: "/admin/products" },
            { name: "Categories", path: "/admin/categories" },
            { name: "CMS", path: "/admin/cms" },
            { name: "Global Settings", path: "/admin/settings" },
            { name: "Roles", path: "/admin/roles" },
            { name: "Users", path: "/admin/admins" },
            { name: "Inquiries", path: "/admin/inquiries" }
        ];
    }

    // STAFF MENUS
    else {
        menus = [{ name: "Dashboard", path: "/admin" }];

        if (
            admin?.permissions?.products?.create ||
            admin?.permissions?.products?.edit ||
            admin?.permissions?.products?.delete
        ) {
            menus.push({ name: "Products", path: "/admin/products" });
        }

        if (
            admin?.permissions?.categories?.create ||
            admin?.permissions?.categories?.edit ||
            admin?.permissions?.categories?.delete
        ) {
            menus.push({ name: "Categories", path: "/admin/categories" });
        }

        if (
            admin?.permissions?.cms?.create ||
            admin?.permissions?.cms?.edit ||
            admin?.permissions?.cms?.delete
        ) {
            menus.push({ name: "CMS", path: "/admin/cms" });
        }
    }

    // ======================
    // LOADING
    // ======================

    if (!isLoggedIn) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading...</h1>
            </div>
        );
    }

    // ======================
    // PERMISSION GUARD
    // ======================

    if (admin && admin.role !== "admin") {
        let currentModule = null;

        if (pathname.startsWith("/admin/products")) currentModule = "products";
        else if (pathname.startsWith("/admin/categories")) currentModule = "categories";
        else if (pathname.startsWith("/admin/cms")) currentModule = "cms";
        else if (pathname.startsWith("/admin/admins")) currentModule = "users";
        else if (pathname.startsWith("/admin/roles")) currentModule = "roles";
        else if (pathname.startsWith("/admin/settings")) currentModule = "settings";

        if (currentModule) {
            const permissions = admin?.permissions?.[currentModule];

            if (pathname.endsWith("/add") && !permissions?.create) return accessDenied();
            if (pathname.includes("/edit/") && !permissions?.edit) return accessDenied();

            const hasAccess = permissions?.create || permissions?.edit || permissions?.delete;
            if (!hasAccess) return accessDenied();
        }
    }

    // ======================
    // UI
    // ======================

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">

            {/* Top Mobile Bar - Show only on small screens */}
            <div className="md:hidden flex items-center justify-between bg-black text-white p-4 sticky top-0 z-30 shadow-md">
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-white bg-gray-900 border border-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-95"
                >
                    {isMobileMenuOpen ? "Close" : "Menu"}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-20 w-72 bg-black text-white p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:h-screen md:sticky md:top-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
                <div>

                    {/* Logo - Adjusted margin down to mb-6 for cleaner vertical rhythm */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">Admin Panel</h1>
                        <p className="text-gray-400 mt-1 text-sm">
                            {admin?.role?.charAt(0).toUpperCase() + admin?.role?.slice(1)} Access
                        </p>
                    </div>

                    {/* Navigation - Space tight down to accommodate expanding menus lists */}
                    <nav className="space-y-1">
                        {menus.map((menu) => (
                            <Link
                                key={menu.path}
                                to={menu.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-4 py-2.5 rounded-xl transition text-sm ${pathname === menu.path
                                    ? "bg-white text-black font-semibold shadow-sm"
                                    : "hover:bg-gray-800 text-gray-300 hover:text-white"
                                    }`}
                            >
                                {menu.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl font-semibold transition text-sm"
                >
                    Logout
                </button>
            </aside>

            {/* Backdrop for Mobile overlay closure */}
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/50 z-10 md:hidden"
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-8 max-w-full overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}