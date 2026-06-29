import { useParams } from "react-router-dom";

import ProductDetailsBanner from "../components/products/ProductDetailsBanner";
import ProductDetailsContent from "../components/products/ProductDetailsContent";

export default function ProductDetails() {
  const { slug } = useParams();

  return (
    <>
      <ProductDetailsBanner />
      <ProductDetailsContent slug={slug} />
    </>
  );
}