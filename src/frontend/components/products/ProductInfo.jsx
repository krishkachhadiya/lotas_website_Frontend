import { Link } from "react-router-dom";

export default function ProductSidebarInfo({ product }) {
  const categoryName = product?.subcategory?.title || product?.category?.title || "";
  const specifications = product?.specifications?.filter(Boolean) || [];

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* --- PART 1: PRODUCT INFO BLOCK --- */}
      <div>
        <h1 className="mt-5 text-4xl font-bold text-[#1D3549]">
          {product?.title}
        </h1>

        <p className="mt-5 text-base text-gray-600 leading-relaxed">
          {product?.metaDescription}
        </p>

        {/* Product ID & Category Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {/* Product ID */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <p className="text-sm text-gray-500">Product Code</p>
            <p className="mt-2 font-semibold text-[#1D3549] truncate">
              {product?.productId || product?._id}
            </p>
          </div>

          {/* Category */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <p className="text-sm text-gray-500">Category</p>
            <p className="mt-2 font-semibold text-[#1D3549] truncate">
              {categoryName}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-4 mt-8">
          <Link
            to="/contact-us"
            className="w-full text-center border border-[#1CA16B] text-[#1CA16B] px-6 py-3 rounded-xl hover:bg-[#1CA16B] hover:text-white transition font-medium"
          >
            Inquiry now
          </Link>
        </div>
      </div>

      {/* --- PART 2: PRODUCT SPECIFICATIONS BLOCK --- */}
      {specifications.length > 0 && (
        <div className="mt-4 pt-6 border-t border-gray-100">
          <div className="mb-6">
            <span className="inline-block bg-[#1CA16B]/10 text-[#1CA16B] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              TECHNICAL DETAILS
            </span>
            <h2 className="mt-2 text-2xl font-bold text-[#1D3549]">
              Specifications
            </h2>
          </div>

          {/* Clean Split Grid Specification Rows */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white">
            {specifications.map((specification, index) => {
              const [key, value] = specification.split(":");

              return (
                <div
                  key={index}
                  className="grid grid-cols-12 border-b border-gray-200 last:border-b-0 items-stretch"
                >
                  <div className="bg-gray-50/70 col-span-5 p-4 text-xs font-semibold text-[#1D3549] flex items-center border-r border-gray-100">
                    {key?.trim()}
                  </div>

                  <div className="bg-white col-span-7 p-4 text-xs text-gray-600 break-words flex items-center">
                    {value?.trim()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}