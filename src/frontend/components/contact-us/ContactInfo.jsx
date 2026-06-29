import { useEffect, useState } from "react";

export default function ContactInfo() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/settings`
        );

        const result = await response.json();

        if (result.success) {
          setSettings(result.data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchSettings();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-gray-50 border rounded-3xl p-6">
            <h2 className="text-xl font-bold text-[#1D3549]">
              Address
            </h2>

            <p className="mt-3 text-gray-600">
              {settings?.address || "Address Not Available"}
            </p>
          </div>

          <div className="bg-gray-50 border rounded-3xl p-6">
            <h2 className="text-xl font-bold text-[#1D3549]">
              Phone
            </h2>

            <a
              href={`tel:${settings?.phone || ""}`}
              className="mt-3 inline-block text-black font-medium hover:text-[#1CA16B] transition"
            >
              {settings?.phone || "Phone Not Available"}
            </a>
          </div>

          <div className="bg-gray-50 border rounded-3xl p-6">
            <h2 className="text-xl font-bold text-[#1D3549]">
              Email
            </h2>

            <a
              href={`mailto:${settings?.email || ""}`}
              className="mt-3 inline-block text-black font-medium hover:text-[#1CA16B] transition"
            >
              {settings?.email || "Email Not Available"}
            </a>
          </div>

          <div className="bg-gray-50 border rounded-3xl p-6">
            <h2 className="text-xl font-bold text-[#1D3549]">
              Business Hours
            </h2>

            <p className="mt-3 text-gray-600">
              Mon - Sat : 9 AM - 6 PM
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}