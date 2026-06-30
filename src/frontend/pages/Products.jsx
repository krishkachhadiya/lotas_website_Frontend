import { useEffect, useState } from "react";
import { setSEO } from "../utils/seo";
import ProductsContent from "../components/products/ProductsContent";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function Products() {
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCms() {
      try {
        const response = await fetch(`${API_URL}/cms`);
        const cmsResponse = await response.json();

        const cmsList = Array.isArray(cmsResponse)
          ? cmsResponse
          : cmsResponse.data || [];

        const matchedCms = cmsList.find(
          (item) => item.slug === "products"
        );

        setCmsData(matchedCms);

        if (matchedCms) {
          setSEO({
            title:
              matchedCms.metaTitle ||
              matchedCms.title ||
              "Products",

            description:
              matchedCms.metaDescription || "",

            type: "website",
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCms();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        Loading Products...
      </div>
    );
  }

  return (
    <>
      <ProductsContent  cmsData={cmsData}/>
    </>
  );
}