import { useState, useEffect } from "react";

export default function ProductGallery({ product }) {
  const [activeImage, setActiveImage] = useState("");

  const BACKEND_URL =
    import.meta.env.VITE_SITE_URL ||
    "http://localhost:5000";

  useEffect(() => {
    if (product?.images?.length > 0) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  function getFullUrl(path) {
    if (!path) return "/no-image.png";

    if (path.startsWith("http")) {
      return path;
    }

    return `${BACKEND_URL}${
      path.startsWith("/") ? "" : "/"
    }${path}`;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

          {/* Main Image */}
          <div className="h-[320px] md:h-[380px] rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">

            <img
              src={getFullUrl(activeImage)}
              alt={product.title}
              className="max-w-full max-h-full object-contain p-4"
            />

          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex flex-wrap gap-3 mt-6">

              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(image)}
                  className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === image
                      ? "border-[#1CA16B]"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={getFullUrl(image)}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}

            </div>
          )}

        </div>

      </div>
    </section>
  );
}