import { useEffect, useState } from "react";
import { setSEO } from "../utils/seo";
import Aboutpre from "../components/Aboutpre";
import CompanyStory from "../components/aboutus/CompanyStory";
import MissionVision from "../components/aboutus/MissionVision";
import WhyChooseUs from "../components/WhyChooseUs";
import CTA from "../components/CTA";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function AboutUs() {
  const [cms, setCms] = useState(null);

  useEffect(() => {
    async function fetchCms() {
      try {
        const response = await fetch(`${API_URL}/cms`);
        const data = await response.json();

        const aboutPage = data.find(
          (item) => item.slug === "about-us"
        );

        setCms(aboutPage || null);

        // Dynamic Title
        if (aboutPage) {
          setSEO({
            title:
              aboutPage.metaTitle ||
              aboutPage.title ||
              "About Us",

            description:
              aboutPage.metaDescription || "",

            type: "website",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchCms();
  }, []);

  return (
    <div className="bg-white">
      <Aboutpre />
      <CompanyStory />
      <MissionVision />
      <WhyChooseUs />
      <CTA />
    </div>
  );
}