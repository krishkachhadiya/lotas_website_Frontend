import { useState, useEffect, useRef } from "react";

export default function ProductGallery({ product }) {
  const BACKEND_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5000";

  const [activeImage, setActiveImage] = useState("");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  
  // Animation state (controls opacity class)
  const [isFading, setIsFading] = useState(false);

  // Swipe gesture tracking
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setActiveImage(product.images[0]);
      setCurrentImage(0);
    }
  }, [product]);

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

  // Pure CSS Fade Animation Wrapper
  const triggerImageChange = (directionOrIndex) => {
    if (!product?.images?.length) return;
    
    // 1. Start fading out
    setIsFading(true);

    // 2. Wait for fade-out transition to complete (200ms), then swap data
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
      setActiveImage(product.images[nextIndex]);
      
      // 3. Fade back in
      setIsFading(false);
    }, 200); 
  };

  const openGallery = (index) => {
    setCurrentImage(index);
    setActiveImage(product.images[index]);
    setGalleryOpen(true);
  };

  const closeGallery = () => setGalleryOpen(false);

  // Mobile Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; 

    if (distance > minSwipeDistance) {
      triggerImageChange("next"); // Swipe Left -> Next
    } else if (distance < -minSwipeDistance) {
      triggerImageChange("prev"); // Swipe Right -> Prev
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <>
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            
            {/* Main Image Viewport with Native Swipe & CSS Transition */}
            <div 
              className="h-[320px] md:h-[420px] rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center relative touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={getFullUrl(activeImage)}
                alt={product?.title}
                onClick={() => openGallery(currentImage)}
                className={`max-w-full max-h-full object-contain p-4 cursor-zoom-in transition-all duration-200 ease-in-out ${
                  isFading ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              />
            </div>

            {/* Thumbnails */}
            {product?.images?.length > 1 && (
              <div className="flex flex-wrap gap-3 mt-6 justify-center">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => triggerImageChange(index)}
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImage === image
                        ? "border-[#1CA16B] shadow-md scale-105"
                        : "border-gray-200 hover:border-[#1CA16B]"
                    }`}
                  >
                    <img src={getFullUrl(image)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Fullscreen Overlay Gallery */}
      {galleryOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <button
            onClick={closeGallery}
            className="absolute top-6 right-6 text-white text-4xl p-2 hover:text-gray-300 z-50"
          >
            &times;
          </button>

          {/* Desktop Navigation */}
          {product?.images?.length > 1 && (
            <>
              <button onClick={() => triggerImageChange("prev")} className="absolute left-5 text-white text-5xl hover:text-gray-300 z-50 hidden md:block select-none">&#10094;</button>
              <button onClick={() => triggerImageChange("next")} className="absolute right-5 text-white text-5xl hover:text-gray-300 z-50 hidden md:block select-none">&#10095;</button>
            </>
          )}

          {/* Fullscreen Swipe Area */}
          <div 
            className="w-full h-[60vh] flex items-center justify-center touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={getFullUrl(product.images[currentImage])}
              alt={product.title}
              className={`max-w-[95vw] max-h-[75vh] object-contain rounded-xl select-none transition-all duration-200 ease-in-out ${
                isFading ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
              }`}
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-32 text-gray-300 font-medium text-sm">
            {currentImage + 1} / {product?.images?.length}
          </div>

          {/* Bottom Thumbnails */}
          {product?.images?.length > 1 && (
            <div className="absolute bottom-8 flex gap-3 overflow-x-auto max-w-[95vw] px-4 py-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={getFullUrl(image)}
                  alt=""
                  onClick={() => triggerImageChange(index)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover cursor-pointer border-2 transition-all duration-200 shrink-0 ${
                    currentImage === index ? "border-white scale-110 shadow-xl" : "border-transparent opacity-50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}