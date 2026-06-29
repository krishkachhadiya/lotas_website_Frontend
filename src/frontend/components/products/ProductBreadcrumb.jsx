import { Link } from "react-router-dom";

export default function ProductBreadcrumb({ product }) {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">

        <div className="flex items-center gap-2 text-sm">

          <Link
            to="/"
            className="text-[#1D3549] hover:text-[#1CA16B] transition"
          >
            Home
          </Link>

          <span className="text-[#1CA16B]">/</span>

          <Link
            to="/products"
            className="text-[#1D3549] hover:text-[#1CA16B] transition"
          >
            Products
          </Link>

          <span className="text-[#1CA16B]">/</span>

          <span className="font-semibold text-[#1CA16B]">
            {product.title}
          </span>

        </div>

      </div>
    </section>
  );
}