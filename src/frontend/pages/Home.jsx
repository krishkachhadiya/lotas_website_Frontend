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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SITE_URL = import.meta.env.VITE_SITE_URL || "";

export default function Home() {
  const [settings, setSettings] = useState(null);

  // 1. Fetch site settings data on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch(`${API_URL}/settings`);
        const data = await response.json();
        const settingsData = data?.data || null;
        setSettings(settingsData);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    }

    fetchSettings();
  }, []);

  // 2. Synchronize SEO and Metadata whenever settings change
  useEffect(() => {
    if (!settings) return;

    // Build uniform absolute logo URL safely
    let absoluteLogo = "";
    if (settings.logo) {
      absoluteLogo = settings.logo.startsWith("http")
        ? settings.logo
        : `${SITE_URL.replace(/\/$/, "")}/${settings.logo.replace(/^\//, "")}`;
    }

    // Set SEO
    setSEO({
      title: settings.metaTitle || settings.websiteTitle || settings.companyName || "Home",
      description: settings.metaDescription || "",
      image: absoluteLogo, // Use absolute path for social shares
      type: "website",
    });

    // Set JSON-LD Schema
    setSchema({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: settings.companyName || "",
      url: SITE_URL,
      logo: absoluteLogo,
      email: settings.email || "",
      telephone: settings.phone || "",
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address || "",
      },
      sameAs: [
        settings.facebook,
        settings.instagram,
        settings.linkedin,
      ].filter(Boolean),
    });

    // Optional Cleanup: Wipes metadata clean if the component unmounts
    return () => {
      setSEO({ title: "", description: "", image: "" });
    };
  }, [settings]);

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