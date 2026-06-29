import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const BACKEND_URL =
  import.meta.env.VITE_SITE_URL ||
  "http://localhost:5000";

export default function RelatedProducts({ product }) {
  const [relatedProducts, setRelatedProducts] = useState([]);

  function getProductImageUrl(imagePath) {
    if (!imagePath || typeof imagePath !== "string") {
      return "/no-image.png";
    }

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    const cleanPath = imagePath
      .replace(/^\/+/, "")
      .replace(/^uploads\/+/i, "");

    return `${BACKEND_URL}/uploads/${cleanPath}`;
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `${API_URL}/products`
        );

        const result = await response.json();

        const products = Array.isArray(result)
          ? result
          : result.data || [];

        const related = products.filter(
          (item) =>
            item.subcategory?.toLowerCase() ===
              product.subcategory?.toLowerCase() &&
            (item._id || item.id) !==
              (product._id || product.id) &&
            item.status === "active"
        );

        setRelatedProducts(
          related.slice(0, 4)
        );
      } catch (error) {
        console.error(error);
      }
    }

    if (product) {
      fetchProducts();
    }
  }, [product]);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="mb-8">
          <span className="inline-block bg-[#1CA16B]/10 text-[#1CA16B] px-4 py-2 rounded-full text-sm font-semibold">
            YOU MAY ALSO LIKE
          </span>

          <h2 className="mt-4 text-4xl font-bold text-[#1D3549]">
            Related Products
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {relatedProducts.map((item, index) => (
            <div
              key={`${item._id || item.id}-${index}`}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >

              {/* Image */}
              <div className="h-56 overflow-hidden">
                <img
                  src={getProductImageUrl(
                    item.images?.[0]
                  )}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5">

                <h3 className="text-lg font-semibold text-[#1D3549] line-clamp-2">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {item.metaDescription ||
                    "Premium quality product"}
                </p>

                <Link
                  to={`/products/${item.slug}`}
                  className="inline-block mt-4 text-[#1CA16B] font-semibold hover:text-[#19535B] transition"
                >
                  View Details →
                </Link>

              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}