import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const TOOLS_DIRECTORY = path.join(process.cwd(), "src/content/tools");

export interface ToolPageData {
  slug: string;
  title: string;
  meta_description: string;
  country_code: string;
  document_type: string;
  badge?: string;
  hero_title: string;
  hero_subtitle: string;
  dimensions_mm: string;
  dimensions_px?: string;
  feature_image?: string;
  price?: string;
  contentHtml: string;
  faqs?: Array<{ question: string; answer: string }>;
}

export function getAllToolSlugs(): string[] {
  if (!fs.existsSync(TOOLS_DIRECTORY)) return [];
  const fileNames = fs.readdirSync(TOOLS_DIRECTORY);
  return fileNames
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export async function getToolBySlug(slug: string): Promise<ToolPageData | null> {
  try {
    const fullPath = path.join(TOOLS_DIRECTORY, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Process markdown with GFM (GitHub Flavored Markdown for tables, checklists, links)
    const processedContent = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      title: data.title || "Passport Photo Maker",
      meta_description:
        data.meta_description ||
        "Create verified biometric passport and visa photos online. 100% compliant with official government requirements.",
      country_code: data.country_code || "GB",
      document_type: data.document_type || "passport",
      badge: data.badge || "Verified Biometric Standard",
      hero_title: data.hero_title || data.title || "Passport Photo Maker Online",
      hero_subtitle:
        data.hero_subtitle ||
        "Upload a photo from your phone or desktop. Our AI crops, centers, and cleans the background to meet official government standards.",
      dimensions_mm: data.dimensions_mm || "35 × 45 mm",
      dimensions_px: data.dimensions_px,
      feature_image:
        data.feature_image ||
        "https://res.cloudinary.com/dipzpwbbk/image/upload/v1790507890/uk_passport_size_photo_i5uujz.jpg",
      price: data.price || "7.99",
      contentHtml,
      faqs: data.faqs,
    };
  } catch (error) {
    console.error(`Error loading tool markdown for slug "${slug}":`, error);
    return null;
  }
}
