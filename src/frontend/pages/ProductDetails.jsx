import { useParams } from "react-router-dom";

import ProductDetailsContent from "../components/products/ProductDetailsContent";

export default function ProductDetails() {
  const { slug } = useParams();

  return (
    <>
      <ProductDetailsContent slug={slug} />
    </>
  );
}