import { useState, useEffect, useRef } from "react";

export default function ProductGallery({ product }) {
  const BACKEND_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5000";

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!galleryOpen) return;
      if (e.key === "ArrowRight") triggerImageChange("next");
      if (e.key === "ArrowLeft") triggerImageChange("prev");
      if (e.key === "Escape") closeGallery();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryOpen, currentImage]);

  useEffect(() => {
    document.body.style.overflow = galleryOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [galleryOpen]);

  function getFullUrl(path) {
    if (!path) return "/no-image.png";
    return path.startsWith("http") ? path : `${BACKEND_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  const triggerImageChange = (directionOrIndex) => {
    if (!product?.images?.length) return;
    setIsFading(true);
    setTimeout(() => {
      let nextIndex = currentImage;
      if (directionOrIndex === "next") {
        nextIndex = (currentImage + 1) % product.images.length;
      } else if (directionOrIndex === "prev") {
        nextIndex = currentImage === 0 ? product.images.length - 1 : currentImage - 1;
      } else {
        nextIndex = directionOrIndex;
      }
      setCurrentImage(nextIndex);
      setIsFading(false);
    }, 150);
  };

  const openGallery = (index) => {
    setCurrentImage(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => setGalleryOpen(false);

  const handleTouchStart = (e) => { touchStartX.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e) => { touchEndX.current = e.targetTouches[0].clientX; };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) triggerImageChange("next");
    else if (distance < -50) triggerImageChange("prev");
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <>
      {/* SHOPIFY DAWN GALLERY SYSTEM:
        On Desktop, all images stack visibly down the column.
        The 1st image spans wide across 2 columns, others tile beautifully side-by-side.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {product?.images && product.images.length > 0 ? (
          product.images.map((image, index) => {
            // Shopify Grid Logic: First image gets full row view. The rest stay side-by-side.
            const isFirstImage = index === 0;

            return (
              <div
                key={index}
                onClick={() => openGallery(index)}
                className={`overflow-hidden rounded-md bg-[#F3F3F3] border border-gray-100 cursor-zoom-in group ${isFirstImage ? "col-span-1 md:col-span-2" : "col-span-1"
                  }`}
              >
                <img
                  src={getFullUrl(image)}
                  alt={`${product?.title || "Product"} view ${index + 1}`}
                  className="w-full h-auto object-cover max-h-[70vh] mix-blend-multiply transition-transform duration-500 group-hover:scale-101"
                />
              </div>
            );
          })
        ) : (
          <div className="col-span-2 border border-dashed border-gray-200 rounded-xl h-96 flex items-center justify-center bg-gray-50">
            <img src="/no-image.png" alt="No media" className="max-h-24 opacity-30" />
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Lightbox Overlay */}
      {galleryOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button onClick={closeGallery} className="absolute top-6 right-6 text-white text-4xl p-2 hover:opacity-70 z-50">&times;</button>

          {product?.images?.length > 1 && (
            <>
              <button onClick={() => triggerImageChange("prev")} className="absolute left-5 text-white text-4xl hover:opacity-70 z-50 hidden md:block select-none">&#10094;</button>
              <button onClick={() => triggerImageChange("next")} className="absolute right-5 text-white text-4xl hover:opacity-70 z-50 hidden md:block select-none">&#10095;</button>
            </>
          )}

          <div
            className="w-full h-[70vh] flex items-center justify-center touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={getFullUrl(product.images[currentImage])}
              alt={product.title}
              className={`max-w-[90vw] max-h-[80vh] object-contain select-none transition-all duration-150 ease-in-out ${isFading ? "opacity-0 scale-98" : "opacity-100 scale-100"
                }`}
            />
          </div>

          <div className="absolute bottom-12 text-gray-400 font-normal text-sm tracking-wider">
            {currentImage + 1} / {product?.images?.length}
          </div>
        </div>
      )}
    </>
  );
}