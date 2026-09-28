import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const TOOLS_DIRECTORY = path.join(process.cwd(), "src/content/tools");

export interface FaqItem {
  question: string;
  answer: string;
  answerHtml?: string;
}

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
  feature_image_alt?: string;
  price?: string;
  contentHtml: string;
  faqs?: FaqItem[];
}

export function getAllToolSlugs(): string[] {
  if (!fs.existsSync(TOOLS_DIRECTORY)) return [];
  const fileNames = fs.readdirSync(TOOLS_DIRECTORY);
  return fileNames
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

async function parseFaqsFromMarkdown(
  rawContent: string
): Promise<{ cleanedContent: string; faqs: FaqItem[] }> {
  // Look for ## Frequently Asked Questions (or FAQ / FAQs) section
  const faqHeaderRegex = /(?:^|\n)##\s+(?:Frequently Asked Questions|FAQs?)\b[^\n]*/i;
  const match = rawContent.match(faqHeaderRegex);

  if (!match || match.index === undefined) {
    return { cleanedContent: rawContent, faqs: [] };
  }

  const startIndex = match.index;
  const afterHeaderIndex = startIndex + match[0].length;
  const restOfContent = rawContent.slice(afterHeaderIndex);

  // Find where the next top-level H2 section begins (## ), if any
  const nextH2Match = restOfContent.match(/\n##\s+[^\n]+/);
  let rawFaqBlock = "";
  let cleanedContent = "";

  if (nextH2Match && nextH2Match.index !== undefined) {
    rawFaqBlock = restOfContent.slice(0, nextH2Match.index);
    const postFaqContent = restOfContent.slice(nextH2Match.index);
    cleanedContent =
      rawContent.slice(0, startIndex).trimEnd() + "\n\n" + postFaqContent.trimStart();
  } else {
    rawFaqBlock = restOfContent;
    cleanedContent = rawContent.slice(0, startIndex).trimEnd();
  }

  // Parse questions & answers from rawFaqBlock
  // Questions start with ###
  const chunks = rawFaqBlock.split(/(?:^|\n)###\s+/);
  const faqs: FaqItem[] = [];

  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    const firstNewline = trimmed.indexOf("\n");
    let question = "";
    let rawAnswer = "";

    if (firstNewline === -1) {
      question = trimmed;
    } else {
      question = trimmed.slice(0, firstNewline).trim();
      rawAnswer = trimmed.slice(firstNewline).trim();
    }

    if (question) {
      // Strip HTML comments from answer
      const cleanedAnswer = rawAnswer.replace(/<!--[\s\S]*?-->/g, "").trim();

      if (cleanedAnswer) {
        // Convert answer markdown to HTML for rich formatting / links
        const processed = await remark()
          .use(remarkGfm)
          .use(html, { sanitize: false })
          .process(cleanedAnswer);

        faqs.push({
          question,
          answer: cleanedAnswer.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
          answerHtml: processed.toString().trim(),
        });
      }
    }
  }

  return { cleanedContent, faqs };
}

export async function getToolBySlug(slug: string): Promise<ToolPageData | null> {
  try {
    const fullPath = path.join(TOOLS_DIRECTORY, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Extract FAQs from markdown if present
    const { cleanedContent, faqs: parsedFaqs } = await parseFaqsFromMarkdown(content);

    let finalFaqs: FaqItem[] = parsedFaqs;

    // Fallback or merge with frontmatter FAQs if present
    if ((!finalFaqs || finalFaqs.length === 0) && Array.isArray(data.faqs)) {
      finalFaqs = [];
      for (const item of data.faqs) {
        if (item?.question && item?.answer) {
          const processed = await remark()
            .use(remarkGfm)
            .use(html, { sanitize: false })
            .process(item.answer);
          finalFaqs.push({
            question: item.question,
            answer: item.answer,
            answerHtml: processed.toString().trim(),
          });
        }
      }
    }

    // Process markdown with GFM (GitHub Flavored Markdown for tables, checklists, links)
    const processedContent = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(cleanedContent);
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
      feature_image_alt: data.feature_image_alt,
      price: data.price || "7.99",
      contentHtml,
      faqs: finalFaqs.length > 0 ? finalFaqs : undefined,
    };
  } catch (error) {
    console.error(`Error loading tool markdown for slug "${slug}":`, error);
    return null;
  }
}
