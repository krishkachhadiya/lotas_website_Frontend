import { Link } from "react-router-dom";

export default function ProductInfo({ product }) {
  const categoryName =
    product?.subcategory?.title || product?.category?.title || "";

  const specifications = product.specifications?.filter(Boolean) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8">
      <div className="max-w-4xl">
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#1CA16B]/10 text-[#1CA16B] text-sm font-semibold">
          {categoryName}
        </span>

        <h1 className="mt-5 text-4xl md:text-5xl font-bold text-[#1D3549]">
          {product.title}
        </h1>

        <p className="mt-5 text-lg text-gray-600 leading-8">
          {product.metaDescription}
        </p>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {/* Product ID */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <p className="text-sm text-gray-500">Product ID</p>

            <p className="mt-2 font-semibold text-[#1D3549]">
              {product.productId || product._id}
            </p>
          </div>

          {/* Category */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <p className="text-sm text-gray-500">Category</p>

            <p className="mt-2 font-semibold text-[#1D3549]">
              {categoryName}
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Link
            to="/contact-us"
            className="border border-[#1CA16B] text-[#1CA16B] px-6 md:px-8 py-3 rounded-xl hover:bg-[#1CA16B] hover:text-white transition"
          >
            Inquiry now
          </Link>
        </div>
      </div>
    </div>
  );
}