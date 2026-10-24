import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import { parseFaqsFromMarkdown, type FaqItem } from "@/lib/tools";

const HOW_TO_DIRECTORY = path.join(process.cwd(), "src/content/how-to");

export type HowToCategory =
  | "Taking Your Photo"
  | "Editing & Checking"
  | "Applying & Uploading"
  | "Printing";

/** Display order of categories on the /how-to hub. Unknown categories are listed last. */
export const HOW_TO_CATEGORIES: HowToCategory[] = [
  "Taking Your Photo",
  "Editing & Checking",
  "Applying & Uploading",
  "Printing",
];

export interface HowToStep {
  name: string;
  text: string;
}

/** Frontmatter fields shown on the hub and in related-guide cards. */
export interface HowToSummary {
  slug: string;
  title: string;
  summary: string;
  category: string;
  icon: string;
  /** Lower numbers are listed first within a category. */
  order: number;
  reading_time?: string;
}

export interface HowToPageData extends HowToSummary {
  /** Optional <title> override; falls back to `title`. */
  meta_title?: string;
  meta_description: string;
  hero_title: string;
  hero_subtitle: string;
  /** "YYYY-MM-DD"; shown on the page and used in Article schema. */
  date_published?: string;
  /** "YYYY-MM-DD"; defaults to `date_published`. */
  date_modified?: string;
  /** ISO 8601 duration for HowTo schema, e.g. "PT10M". */
  total_time?: string;
  feature_image?: string;
  feature_image_alt?: string;
  /** Embeds the photo maker studio below the hero. Defaults to true. */
  show_studio: boolean;
  /** Country preselected in the studio; defaults to "GB". */
  country_code: string;
  /** Document type preselected in the studio; defaults to "passport". */
  document_type: string;
  studio_title?: string;
  studio_description?: string;
  cta_title?: string;
  cta_description?: string;
  /** Defaults to the photo maker studio. */
  cta_href?: string;
  cta_button_text?: string;
  /** Frontmatter steps; emitted as HowTo structured data. Must match the visible steps. */
  steps?: HowToStep[];
  contentHtml: string;
  faqs?: FaqItem[];
}

export function getAllHowToSlugs(): string[] {
  if (!fs.existsSync(HOW_TO_DIRECTORY)) return [];
  return fs
    .readdirSync(HOW_TO_DIRECTORY)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

function readHowToFile(slug: string) {
  const fullPath = path.join(HOW_TO_DIRECTORY, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  return matter(fs.readFileSync(fullPath, "utf8"));
}

const WORDS_PER_MINUTE = 220;

/** gray-matter parses unquoted YAML dates into Date objects; normalise both forms to "YYYY-MM-DD". */
function toIsoDate(value: unknown): string | undefined {
  if (value instanceof Date && !isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  return undefined;
}

function estimateReadingTime(markdown: string): string {
  const words = markdown.replace(/[#>*_`|\-[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`;
}

function toSummary(slug: string, data: Record<string, unknown>, content: string): HowToSummary {
  return {
    slug,
    title: String(data.title || slug),
    summary: String(data.summary || data.meta_description || ""),
    category: String(data.category || "Taking Your Photo"),
    icon: String(data.icon || "📘"),
    order: typeof data.order === "number" ? data.order : 100,
    reading_time: data.reading_time ? String(data.reading_time) : estimateReadingTime(content),
  };
}

/** All guides, sorted by category order, then `order`, then title. Used by the hub and related grids. */
export function getAllHowToSummaries(): HowToSummary[] {
  const categoryRank = (category: string) => {
    const idx = HOW_TO_CATEGORIES.indexOf(category as HowToCategory);
    return idx === -1 ? HOW_TO_CATEGORIES.length : idx;
  };

  return getAllHowToSlugs()
    .map((slug) => {
      const file = readHowToFile(slug);
      return file ? toSummary(slug, file.data, file.content) : null;
    })
    .filter((guide): guide is HowToSummary => guide !== null)
    .sort(
      (a, b) =>
        categoryRank(a.category) - categoryRank(b.category) ||
        a.order - b.order ||
        a.title.localeCompare(b.title)
    );
}

export async function getHowToBySlug(slug: string): Promise<HowToPageData | null> {
  try {
    const file = readHowToFile(slug);
    if (!file) return null;
    const { data, content: rawContent } = file;

    // Editorial HTML comments (TODOs, notes) must not ship in the page source.
    const content = rawContent.replace(/<!--[\s\S]*?-->/g, "");
    const { cleanedContent, faqs } = await parseFaqsFromMarkdown(content);

    const processedContent = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(cleanedContent);

    const steps = Array.isArray(data.steps)
      ? data.steps
          .filter((step: Partial<HowToStep>) => step?.name && step?.text)
          .map((step: HowToStep) => ({ name: String(step.name), text: String(step.text) }))
      : undefined;

    return {
      ...toSummary(slug, data, content),
      meta_title: data.meta_title,
      meta_description:
        data.meta_description ||
        "Step-by-step guide to taking, checking and submitting a UK passport photo.",
      hero_title: data.hero_title || data.title || "Passport Photo How-To Guide",
      hero_subtitle: data.hero_subtitle || data.summary || "",
      date_published: toIsoDate(data.date_published),
      date_modified: toIsoDate(data.date_modified) || toIsoDate(data.date_published),
      total_time: data.total_time,
      feature_image: data.feature_image,
      feature_image_alt: data.feature_image_alt,
      show_studio: data.show_studio !== false,
      country_code: data.country_code || "GB",
      document_type: data.document_type || "passport",
      studio_title: data.studio_title,
      studio_description: data.studio_description,
      cta_title: data.cta_title,
      cta_description: data.cta_description,
      cta_href: data.cta_href,
      cta_button_text: data.cta_button_text,
      steps: steps && steps.length > 0 ? steps : undefined,
      contentHtml: processedContent.toString(),
      faqs: faqs.length > 0 ? faqs : undefined,
    };
  } catch (error) {
    console.error(`Error loading how-to markdown for slug "${slug}":`, error);
    return null;
  }
}
