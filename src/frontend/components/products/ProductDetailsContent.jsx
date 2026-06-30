import { useEffect, useState } from "react";

import ProductBreadcrumb from "./ProductBreadcrumb";
import ProductInfo from "./ProductInfo";
import ProductGallery from "./ProductGallery";
import ProductSpecifications from "./ProductSpecifications";
import ProductDescription from "./ProductDescription";
import RelatedProducts from "./RelatedProducts";

import { setSEO } from "../../utils/seo";
import { setSchema } from "../../utils/schema";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function ProductDetailsContent({ slug }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(
          `${API_URL}/products`
        );

        const data = await response.json();

        const products = Array.isArray(data)
          ? data
          : data.data || [];

        const found = products.find(
          (item) => item.slug === slug
        );

        setProduct(found || null);

        if (found) {
          const description =
            found.metaDescription ||
            found.description
              ?.replace(/<[^>]*>/g, "")
              .slice(0, 160) ||
            "";

          setSEO({
            title:
              found.metaTitle ||
              found.title ||
              "Product",

            description,

            image:
              found.images?.[0] || "",

            type: "product",
          });
          setSchema({
            "@context": "https://schema.org",
            "@type": "Product",

            name:
              found.title || "",

            description,

            image: found.images?.length
              ? found.images.map(
                (img) =>
                  `${import.meta.env.VITE_SITE_URL}${img}`
              )
              : [],

            sku:
              found.sku || found.productId|| "",

            brand: {
              "@type": "Brand",
              name:
                found.brand ||
                (
                  import.meta.env.VITE_COMPANY_NAME ||
                  "Brand"
                ),
            },

            url: `${import.meta.env.VITE_SITE_URL}/products/${found.slug}`,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <section className="py-20 text-center">
        Loading Product...
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-20 text-center">
        Product Not Found
      </section>
    );
  }
console.log(product);
  return (
    <>
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          <ProductBreadcrumb product={product} />

          <div className="grid lg:grid-cols-2 gap-10 mt-8">
            <ProductGallery product={product} />
            <ProductInfo product={product} />
          </div>

        </div>
      </section>

      <ProductSpecifications product={product} />
      <ProductDescription product={product} />
      <RelatedProducts product={product} />
    </>
  );
}