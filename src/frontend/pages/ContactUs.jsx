import { useEffect, useState } from "react";

import ContactBanner from "../components/contact-us/ContactBanner";
import ContactInfo from "../components/contact-us/ContactInfo";
import ContactForm from "../components/contact-us/ContactForm";
import ContactMap from "../components/contact-us/ContactMap";

import { setSEO } from "../utils/seo";

export default function ContactPage() {
  const [cmsData, setCmsData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    Promise.all([
      fetch(`${apiUrl}/cms`).then((res) => res.json()),
      fetch(`${apiUrl}/settings`).then((res) => res.json()),
    ])
      .then(([cmsResponse, settingsResult]) => {
        const cmsList = Array.isArray(cmsResponse)
          ? cmsResponse
          : cmsResponse.data || [];

        const matchedCms = cmsList.find(
          (item) => item.slug === "contact-us"
        );

        setCmsData(matchedCms || null);
        setSettings(settingsResult?.data || null);

        if (matchedCms) {
          setSEO({
            title:
              matchedCms.metaTitle ||
              matchedCms.title ||
              "Contact Us",

            description:
              matchedCms.metaDescription || "",

            type: "website",
          });
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div>
        Loading Contact Details...
      </div>
    );
  }

  if (!cmsData || !settings) {
    return (
      <div>
        Failed to load details.
      </div>
    );
  }

  const siteUrl =
    import.meta.env.VITE_SITE_URL || "";

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name:
      cmsData.metaTitle ||
      cmsData.title,

    description:
      cmsData.metaDescription || "",

    url: `${siteUrl}/contact-us`,

    mainEntity: {
      "@type": "Organization",

      name:
        settings.companyName || "",

      logo: {
        "@type": "ImageObject",
        url: settings.logo
          ? `${siteUrl}${settings.logo}`
          : "",
      },

      email:
        settings.email || "",

      telephone:
        settings.phone || "",

      address: {
        "@type": "PostalAddress",
        streetAddress:
          settings.address || "",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            contactSchema
          ),
        }}
      />

      <ContactBanner />
      <ContactInfo />
      <ContactForm />
      <ContactMap />
    </>
  );
}