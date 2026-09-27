import type { MetadataRoute } from "next";
import { getAllToolSlugs } from "@/lib/tools";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();
  const toolSlugs = getAllToolSlugs();

  const toolEntries: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${SITE_URL}/tool/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.9,
    alternates: {
      languages: {
        "en-GB": `${SITE_URL}/tool/${slug}`,
      },
    },
  }));

  return [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          "en-GB": `${SITE_URL}`,
        },
      },
    },
    {
      url: `${SITE_URL}/passport-size-photo-maker`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          "en-GB": `${SITE_URL}/passport-size-photo-maker`,
        },
      },
    },
    {
      url: `${SITE_URL}/about-us`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          "en-GB": `${SITE_URL}/about-us`,
        },
      },
    },
    {
      url: `${SITE_URL}/contact-us`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          "en-GB": `${SITE_URL}/contact-us`,
        },
      },
    },
    {
      url: `${SITE_URL}/data-security-privacy-safeguards`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          "en-GB": `${SITE_URL}/data-security-privacy-safeguards`,
        },
      },
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          "en-GB": `${SITE_URL}/privacy-policy`,
        },
      },
    },
    {
      url: `${SITE_URL}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          "en-GB": `${SITE_URL}/terms-of-service`,
        },
      },
    },
    {
      url: `${SITE_URL}/refund-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          "en-GB": `${SITE_URL}/refund-policy`,
        },
      },
    },
    ...toolEntries,
  ];
}
