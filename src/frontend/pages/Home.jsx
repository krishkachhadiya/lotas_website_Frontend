import { useEffect, useState } from "react";
import { setSEO } from "../utils/seo";
import { setSchema } from "../utils/schema";
import MainLayout from "../layouts/MainLayout";

import Hero from "../components/Hero";
import Aboutpre from "../components/Aboutpre";
import FeaturedCategories from "../components/FeaturedCategories";
import FeaturedProducts from "../components/FeaturedProducts";
import WhyChooseUs from "../components/WhyChooseUs";
import CTA from "../components/CTA";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function Home() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch(
          `${API_URL}/settings`
        );

        const data = await response.json();

        const settingsData = data?.data || null;

        setSettings(settingsData);

if (settingsData) {
  setSEO({
    title:
      settingsData.metaTitle ||
      settingsData.websiteTitle ||
      settingsData.companyName,

    description:
      settingsData.metaDescription || "",

    image: settingsData.logo,

    type: "website",
  });

  setSchema({
    "@context": "https://schema.org",
    "@type": "Organization",

    name:
      settingsData.companyName || "",

    url:
      import.meta.env.VITE_SITE_URL || "",

    logo: settingsData.logo
      ? `${import.meta.env.VITE_SITE_URL}${settingsData.logo}`
      : "",

    email:
      settingsData.email || "",

    telephone:
      settingsData.phone || "",

    address: {
      "@type": "PostalAddress",
      streetAddress:
        settingsData.address || "",
    },

    sameAs: [
      settingsData.facebook,
      settingsData.instagram,
      settingsData.linkedin,
    ].filter(Boolean),
  });
}
      } catch (error) {
        console.log(error);
      }
    }

    fetchSettings();
  }, []);

  return (
    <MainLayout>
      <div className="bg-white">
        <Hero />
        <Aboutpre />
        <FeaturedCategories />
        <FeaturedProducts />
        <WhyChooseUs />
        <CTA />
      </div>
    </MainLayout>
  );
}