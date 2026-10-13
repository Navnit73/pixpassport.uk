export type ToolGroup =
  | "UK Passport Photos"
  | "Other UK Documents"
  | "Visas & Other Countries"
  | "How-To Guides & Tools";

export interface ToolDirectoryEntry {
  slug: string;
  title: string;
  flag: string;
  spec: string;
  group: ToolGroup;
}

export const TOOL_GROUPS: ToolGroup[] = [
  "UK Passport Photos",
  "Other UK Documents",
  "Visas & Other Countries",
  "How-To Guides & Tools",
];

/** Every /tool/[slug] page, in display order. Used by the /tool hub and the related-tools grid. */
export const TOOL_DIRECTORY: ToolDirectoryEntry[] = [
  { slug: "uk-passport-photo", title: "UK Passport Photo Size & Rules", flag: "🇬🇧", spec: "35×45 mm", group: "UK Passport Photos" },
  { slug: "british-passport-picture-maker", title: "British Passport Picture Maker", flag: "🇬🇧", spec: "35×45 mm", group: "UK Passport Photos" },
  { slug: "passport-photo-checker-uk", title: "UK Passport Photo Checker", flag: "✅", spec: "Compliance Test", group: "UK Passport Photos" },
  { slug: "digital-passport-photo", title: "UK Digital Passport Photo", flag: "💻", spec: "GOV.UK Online", group: "UK Passport Photos" },
  { slug: "passport-renewal-photo-online", title: "UK Passport Renewal Photo", flag: "🔄", spec: "600×750 px", group: "UK Passport Photos" },
  { slug: "uk-baby-passport-photo", title: "UK Baby Passport Photo", flag: "👶", spec: "Babies & Children", group: "UK Passport Photos" },
  { slug: "uk-driving-licence-photo", title: "UK Driving Licence Photo", flag: "🚗", spec: "DVLA 35×45 mm", group: "Other UK Documents" },
  { slug: "uk-visa-photo", title: "UK Visa Photo", flag: "🛂", spec: "UKVI & ETA", group: "Other UK Documents" },
  { slug: "us-visa-photo-tool", title: "US Visa & Passport Photo", flag: "🇺🇸", spec: "2×2 inches", group: "Visas & Other Countries" },
  { slug: "schengen-visa-photo", title: "Schengen Visa Photo", flag: "🇪🇺", spec: "35×45 mm", group: "Visas & Other Countries" },
  { slug: "indian-passport-photo-maker", title: "Indian Passport & OCI Photo", flag: "🇮🇳", spec: "35×45 mm", group: "Visas & Other Countries" },

  { slug: "take-a-passport-photo-on-iphone", title: "Passport Photo on iPhone", flag: "📱", spec: "iPhone Guide", group: "How-To Guides & Tools" },
  { slug: "passport-photo-at-home", title: "Passport Photo at Home", flag: "🏠", spec: "Home Setup", group: "How-To Guides & Tools" },
  { slug: "photo-size-35x45mm", title: "35×45 mm Photo Size", flag: "📐", spec: "Crop & Resize", group: "How-To Guides & Tools" },
  { slug: "image-to-passport-size-converter", title: "Image to Passport Size Converter", flag: "🖼️", spec: "Auto-Crop", group: "How-To Guides & Tools" },
  { slug: "passport-photo-tool", title: "Online Passport Photo Tool", flag: "✂️", spec: "50+ Countries", group: "How-To Guides & Tools" },
  { slug: "online-id-photo-maker", title: "Online ID Photo Maker", flag: "🪪", spec: "ID Photos", group: "How-To Guides & Tools" },
  { slug: "order-passport-photos-online", title: "Order Passport Photos Online", flag: "📦", spec: "Digital & Prints", group: "How-To Guides & Tools" },
];
