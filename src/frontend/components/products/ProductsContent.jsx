
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Fully bulletproofed recursive tree lookup handler
function belongsToMainCategory(productCategoryId, mainCategoryId, allCategoriesPool) {
    if (!productCategoryId || !mainCategoryId || !allCategoriesPool?.length) return false;

    // Normalize IDs to plain strings
    const targetMainId = String(mainCategoryId);
    const startingCategoryId = String(productCategoryId);

    // Find the current category item inside our full list array
    let current = allCategoriesPool.find(
        (c) => String(c._id || c.id) === startingCategoryId
    );

    // Tree climber loop
    while (current) {
        const currentId = String(current._id || current.id);

        if (currentId === targetMainId) {
            return true;
        }

        if (!current.parent) break;

        // Extract parent string cleanly regardless of whether backend populated it as an object or a string
        const parentId = typeof current.parent === 'object'
            ? String(current.parent._id || current.parent.id)
            : String(current.parent);

        current = allCategoriesPool.find(
            (c) => String(c._id || c.id) === parentId
        );
    }

    return false;
}

export default function ProductsContent() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // Displays top-level main buttons
    const [allCategories, setAllCategories] = useState([]); // Entire category dataset
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [productsPerPage, setProductsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);

    const BACKEND_BASE_URL =
        import.meta.env.VITE_SITE_URL ||
        "http://localhost:5000";

    // Helper function to safely format both placeholder external links and your custom uploaded backend images
    const getProductImageUrl = (imagePath) => {
        if (!imagePath || typeof imagePath !== "string" || imagePath.trim() === "") {
            return "/no-image.jpg";
        }

        // If it's an Unsplash placeholder or external link, return it immediately
        if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
            return imagePath;
        }

        // Clean up local file strings coming from your database
        const cleanPath = imagePath
            .replace(/^\/+/, "")             // Removes leading slashes
            .replace(/^uploads\/+/i, "");    // Removes any existing "uploads/" prefix

        return `${BACKEND_BASE_URL}/uploads/${cleanPath}`;
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const productsRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`);
                const productsData = await productsRes.json();

                const categoriesRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/categories`);
                const categoriesData = await categoriesRes.json();

                const paginationRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/settings`);
                const paginationData = await paginationRes.json();

                // Handle data cleanly whether backend returns arrays directly or inside data objects
                const rawProducts = Array.isArray(productsData) ? productsData : productsData.data || [];
                const rawCategories = Array.isArray(categoriesData) ? categoriesData : categoriesData.data || [];

                setProducts(
                    rawProducts.filter((item) => item.status === "active")
                );

                setProductsPerPage(
                    Number(paginationData.data?.pagination) || 8
                );

                // Store the complete unmodified collection for tree traversing lookups
                setAllCategories(rawCategories);

                // Isolate top-level nodes for structural horizontal buttons
                setCategories(
                    rawCategories.filter(
                        (item) => item.status === "active" && (item.parent === null || !item.parent)
                    )
                );
            } catch (error) {
                console.error("Error loading catalogue dependencies:", error);
            }
        }

        fetchData();
    }, []);

    // Filter Logic
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.title
            ?.toLowerCase()
            .includes(search.toLowerCase());

        // Extract ID from product.category regardless of whether it's an object or a string
        const productCategoryId = product.category && typeof product.category === 'object'
            ? (product.category._id || product.category.id)
            : product.category;

        const matchesCategory =
            selectedCategory === "all"
                ? true
                : belongsToMainCategory(
                    productCategoryId,
                    selectedCategory,
                    allCategories
                );

        return matchesSearch && matchesCategory;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + productsPerPage
    );

    return (
        <section className="py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">

                {/* Filter Controls */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm mb-10">
                    <div className="flex flex-col gap-5 text-black">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1); // Reset to page 1 on search string change
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#1CA16B]"
                        />

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => {
                                    setSelectedCategory("all");
                                    setCurrentPage(1); // Reset to page 1
                                }}
                                className={`px-5 py-2.5 rounded-full transition ${selectedCategory === "all" ? "bg-[#1CA16B] text-white" : "bg-gray-100 text-[#1D3549]"}`}
                            >
                                All Products
                            </button>

                            {categories.map((category, index) => {
                                const catId = category._id || category.id;
                                const isActive = String(selectedCategory) === String(catId);

                                return (
                                    <button
                                        key={catId || index}
                                        onClick={() => {
                                            setSelectedCategory(catId);
                                            setCurrentPage(1); // Reset to page 1
                                        }}
                                        className={`px-5 py-2.5 rounded-full transition
                                            ${isActive
                                                ? "bg-[#1CA16B] text-white"
                                                : "bg-gray-100 text-[#1D3549] hover:bg-[#1CA16B] hover:text-white"
                                            }
                                        `}
                                    >
                                        {category.title}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Count Display */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-[#1D3549]">Products</h2>
                    <div className="px-4 py-2 rounded-full bg-[#1CA16B]/10 text-[#1CA16B] font-medium">
                        {filteredProducts.length} Products Found
                    </div>
                </div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedProducts.map((product, index) => {
                        const prodId = product._id || product.id;
                        return (
                            <Link
                                key={prodId || index}
                                to={`/products/${product.slug}`}
                                className="block bg-white border border-gray-200 rounded-3xl overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={getProductImageUrl(product.images?.[0])} // UPDATED: Safely clean routing paths
                                        alt={product.title}
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Content Area */}
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-[#1D3549] line-clamp-2 group-hover:text-[#1CA16B] transition-colors duration-200">
                                        {product.title}
                                    </h3>
                                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                        {product.metaDescription || "Premium quality product"}
                                    </p>

                                    {/* Visual indicator button link style change */}
                                    <div className="inline-block mt-4 text-[#1CA16B] font-medium">
                                        <span className="inline-flex items-center gap-2 text-[#1CA16B] font-semibold">
                                            View Details &rarr;
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-semibold text-[#1D3549]">No Products Found</h3>
                        <p className="mt-3 text-gray-500">Try another search or category.</p>
                    </div>
                )}

                {/* SMART PAGINATION CONTROLS */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12 flex-wrap select-none text-black">

                        {/* Prev Button */}
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className={`flex items-center gap-1 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${currentPage === 1
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-white text-[#1D3549] border-gray-300 hover:bg-[#1CA16B] hover:text-white hover:border-[#1CA16B] active:scale-95 shadow-sm"
                                }`}
                        >
                            &larr; Prev
                        </button>

                        {/* Page Numbers Block */}
                        {(() => {
                            const pageNumbers = [];
                            const maxVisiblePages = 5;

                            if (totalPages <= maxVisiblePages) {
                                for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
                            } else {
                                pageNumbers.push(1);

                                let startRange = Math.max(2, currentPage - 1);
                                let endRange = Math.min(totalPages - 1, currentPage + 1);

                                if (currentPage <= 2) {
                                    endRange = 4;
                                } else if (currentPage >= totalPages - 1) {
                                    startRange = totalPages - 3;
                                }

                                if (startRange > 2) {
                                    pageNumbers.push("ellipsis-left");
                                }

                                for (let i = startRange; i <= endRange; i++) {
                                    pageNumbers.push(i);
                                }

                                if (endRange < totalPages - 1) {
                                    pageNumbers.push("ellipsis-right");
                                }

                                pageNumbers.push(totalPages);
                            }

                            return pageNumbers.map((item, index) => {
                                if (item === "ellipsis-left" || item === "ellipsis-right") {
                                    return (
                                        <span key={`ellipse-${index}`} className="px-2 text-gray-400 font-medium">
                                            ...
                                        </span>
                                    );
                                }

                                const isActive = currentPage === item;
                                return (
                                    <button
                                        key={`page-${item}`}
                                        onClick={() => setCurrentPage(item)}
                                        className={`w-10 h-10 rounded-xl border text-sm font-semibold transition-all duration-200 active:scale-95 ${isActive
                                            ? "bg-[#1CA16B] text-white border-[#1CA16B] shadow-md"
                                            : "bg-white text-[#1D3549] border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                );
                            });
                        })()}

                        {/* Next Button */}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className={`flex items-center gap-1 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-white text-[#1D3549] border-gray-300 hover:bg-[#1CA16B] hover:text-white hover:border-[#1CA16B] active:scale-95 shadow-sm"
                                }`}
                        >
                            Next &rarr;
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}