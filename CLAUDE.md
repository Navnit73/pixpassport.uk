# PixPassport.uk — AI & Engineering Guide (CLAUDE.md)

## 1. Project Overview & Mission

**PixPassport.uk** is a modern, privacy-first, web-based UK passport photo maker. It enables users across the United Kingdom to create, crop, validate, and download digital passport photos compliant with HM Passport Office (HMPO) dimensions (35 mm × 45 mm) directly in their browser — 100% free with zero server data storage.

### Core Value Propositions
* **100% In-Browser Privacy:** All image manipulation happens client-side via HTML5 Canvas and Web APIs. No images or biometric data are transmitted or stored.
* **UK-Specific Dimension Compliance:** Generates 35 mm × 45 mm (600 DPI digital output) and multi-photo 6×4″ (10×15 cm) print-ready layouts.
* **Instant & Accessible:** No paywalls, no watermark extortion, and no account creation required.

---

## 2. Technology Stack

* **Framework:** Next.js (App Router)
* **Runtime / Library:** React 19 / TypeScript 5
* **Styling Engine:** Tailwind CSS v4
* **UI Component Library:** DaisyUI v5 (CSS-first configuration via `@plugin "daisyui/theme"`)
* **Icons:** Lucide React (`lucide-react`)
* **Content Infrastructure:** `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`
* **Fonts:** `next/font/google` (Geist Sans, Geist Mono)

---

## 3. Essential Commands

```bash
# Start local development server (http://localhost:3000)
npm run dev

# Run ESLint validation
npm run lint

# Compile production build
npm run build

# Run production server
npm start
```

---

## 4. Architectural Rules & Code Conventions

### Component Architecture
1. **Server Components by Default:** Keep all layout, SEO, static copy, and JSON-LD components as React Server Components.
2. **Client Components Only When Required:** Mark interactive components (e.g. `UploadCard.tsx`, `Navbar.tsx` mobile drawer) with `"use client"`.
3. **No Competing UI Libraries:** Do NOT install or introduce shadcn/ui, Material UI, Mantine, Chakra, or other third-party component libraries. Use DaisyUI and custom CSS utility classes.
4. **Semantic Color Tokens:** Never hardcode arbitrary hex colors in component classes. Use semantic tokens (`bg-base-100`, `bg-base-200`, `text-primary`, `bg-secondary`, `text-base-content`, `border-base-300`).
5. **Reusable Props & SEO Friendly:** All components export strongly typed prop interfaces and default data constants, utilizing semantic HTML (`<header>`, `<nav>`, `<section>`, `<article>`, `<ol>`, `<ul>`, `<figure>`, `<footer>`) and ARIA landmarks.

### Design & Styling (`src/app/globals.css`)
* Theme is configured via `@plugin "daisyui/theme"` with the custom theme name `pixpassport`.
* **Primary:** `#65A30D` (Lime Green — `lime-600`), hover `#4D7C0F` (`lime-700`)
* **Secondary:** `#172033` (Deep Navy)
* **Accent:** `#0F766E` (Teal)
* **Neutral / Content:** `#172033`
* **Base 100 / 200 / 300:** `#FFFFFF` / `#F8FAFC` / `#E2E8F0`

### Image Handling & Icons
* Use `/pixpassport.jpg` for favicon, Apple touch icon, OpenGraph/Twitter previews, and brand logos.
* Use Next.js `<Image />` component with descriptive `alt` text for brand logos and visual assets.

---

## 5. UK Passport Specifications Reference

| Parameter | Official UK Specification | PixPassport Implementation |
| :--- | :--- | :--- |
| **Photo Dimensions** | 35 mm width × 45 mm height | 35 mm × 45 mm (aspect ratio 7:9) |
| **Head Height** | 29 mm to 34 mm (crown to chin) | 64% to 75% of vertical crop frame |
| **Crown Clearance** | Approx. 3 mm to 5 mm from top | Top margin guide overlay |
| **Digital Resolution** | Min 600 × 750 px (900 × 1200 px recommended) | Exported at 827 × 1063 px (600 DPI) |
| **Print Sheet Format** | Standard 6×4 inch (10×15 cm) | 4-up or 6-up grid layout ready for home/pharmacy printing |
| **Background** | Light grey or plain cream/white | Visual guide check reminder in upload area |

---

## 6. SEO & UK Search Engine Strategy

### Primary & Secondary Target Keywords
1. `digital photo for passport` *(Primary Keyword)*
2. `create passport picture online`
3. `digital photo for passport renewal`
4. `print passport photo online`
5. `UK passport photo maker`

### Mandatory Metadata & Crawling Rules
* **Metadata Base:** Must always resolve to `https://pixpassport.uk`.
* **Canonical URL:** `https://pixpassport.uk` with `en-GB` hreflang alternate.
* **Geographical Targeting:** `geo.region: "GB"`, `geo.placename: "United Kingdom"`, `content-language: "en-GB"`.
* **Crawling & Indexing:**
  * `src/app/robots.ts` -> Generates `/robots.txt` pointing to `/sitemap.xml`
  * `public/sitemap.xml` -> Static XML sitemap for manual updates
* **Passport Photo API (`https://api.pixpassport.com/`):**
  * `src/lib/passport-api.ts` -> Server-side helper with authentication headers (`Authorization: Bearer <key>`, `x-api-key: <key>`).
  * `src/app/api/passport-photo/route.ts` -> Secure server-side route proxy ensuring the API key is never exposed to client browsers.

---

## 7. Directory Structure

```
pixpassport.uk/
├── public/
│   ├── pixpassport.jpg        # Brand asset, favicon, apple-touch-icon, OG image
│   └── sitemap.xml            # Static XML sitemap for manual editing
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── passport-photo/
│   │   │       └── route.ts   # Secure API proxy for https://api.pixpassport.com/
│   │   ├── apple-icon.jpg     # App Router apple touch icon
│   │   ├── globals.css        # Tailwind CSS v4, DaisyUI theme, CSS tokens
│   │   ├── icon.jpg           # App Router favicon/icon
│   │   ├── layout.tsx         # Root layout with comprehensive UK SEO metadata
│   │   ├── page.tsx           # Homepage assembly
│   │   └── robots.ts          # Programmatic robots.txt
│   ├── components/
│   │   ├── Footer.tsx         # Site footer with brand, navigation & UK notice
│   │   ├── JsonLd.tsx         # Schema.org JSON-LD structured data graph
│   │   └── Navbar.tsx         # Sticky header with brand logo & mobile menu
│   ├── config/
│   │   ├── countries.json     # Global passport dimensions JSON database
│   │   └── countries.ts       # Typed country configuration and lookup utilities
│   ├── lib/
│   │   └── passport-api.ts    # PixPassport API client helper
│   └── mdx-components.tsx     # MDX typography styling bindings
├── .gitignore                 # Clean repository ignore configuration
├── .prettierignore            # Prettier ignore rules
├── .prettierrc                # Code formatting configuration
├── CLAUDE.md                  # Assistant and developer reference guide
├── DESIGN.md                  # Complete design system & visual guidelines
├── eslint.config.mjs          # ESLint rules
├── next.config.ts             # Next.js build and MDX configuration
├── package.json               # Dependencies and npm scripts
├── README.md                  # Public project documentation
└── tsconfig.json              # TypeScript strict configuration
```
