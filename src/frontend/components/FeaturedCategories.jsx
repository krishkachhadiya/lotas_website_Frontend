import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();

        setCategories(
          Array.isArray(data)
            ? data
            : data.categories || []
        );
      } catch (error) {
        console.error(error);
      }
    }

    fetchCategories();
  }, []);

  const activeCategories = categories
    .filter(
      (item) =>
        item.status === "active" &&
        item.parent === null
    )
    .slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#1CA16B]/10 text-[#1CA16B] px-4 py-2 rounded-full text-sm font-semibold">
            CATEGORIES
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[#1D3549]">
            Browse Categories
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {activeCategories.map((category) => (
            <Link
              key={category._id || category.id}
              to={`/products?category=${category.slug}`}
              className="group bg-white border border-gray-200 rounded-2xl p-4 md:p-6 hover:border-[#1CA16B] hover:shadow-lg transition-all duration-300"
            >
              {/* Category Image Wrapper */}
              <div className="w-full h-32 rounded-xl bg-gray-100 flex items-center justify-center mb-4 overflow-hidden">
                <img 
                  // Because 'public' is served at the root, we start directly from /uploads/
                  src={`/public/${category.slug}.jpg`} 
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    // Fallback image if a category image is missing or named differently (.png, etc.)
                    e.target.onerror = null; 
                    e.target.src = "https://placehold.co/300x200?text=No+Image"; 
                  }}
                />
              </div>

              <h3 className="text-sm md:text-lg font-semibold text-[#1D3549] group-hover:text-[#1CA16B] transition">
                {category.title}
              </h3>

              <p className="mt-2 text-xs md:text-sm text-gray-600">
                Explore products
              </p>
            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}