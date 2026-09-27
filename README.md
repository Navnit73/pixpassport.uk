# PixPassport.uk — Free UK Passport Photos Online

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-v5-570DF8?style=flat-square)](https://daisyui.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**PixPassport** is a modern, privacy-focused web application designed specifically for the United Kingdom market. It allows users to create, format, and download official 35 mm × 45 mm digital photos for UK passport applications and renewals — completely free, in seconds, with zero server uploads.

---

## ✨ Features

* 🇬🇧 **Official UK Dimensions:** Precision 35 mm × 45 mm aspect ratio (7:9) formatted to HM Passport Office (HMPO) standards.
* 🔒 **100% In-Browser Privacy:** All image processing occurs strictly on the client device via Canvas/Web APIs. Photos are never uploaded, stored, or sent to any server.
* 🖨️ **Print-Ready 6×4″ Sheet:** Generates standard 6×4 inch (10×15 cm) multi-photo print sheets ready for home printing or high-street photo kiosks.
* ⚡ **Lightning Fast:** Instant crop adjustment, live aspect ratio locking, and client-side high-resolution export.
* 🆓 **100% Free Forever:** No subscriptions, no hidden paywalls, no watermark extortion, and no account creation required.
* ♿ **Fully Accessible:** WCAG 2.1 AA compliant, responsive across all mobile and desktop viewports, with full keyboard navigation.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **UI Library** | [React 19](https://react.dev/) with [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Component UI**| [DaisyUI v5](https://daisyui.com/) (CSS-first theme configuration) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Content** | MDX (`@next/mdx`, `@mdx-js/react`) |
| **Fonts** | Geist Sans & Geist Mono via `next/font/google` |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js:** v18.18.0 or higher
* **npm:** v9.0.0 or higher (or pnpm / yarn / bun)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/pixpassport.uk.git
   cd pixpassport.uk
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server with hot reloading |
| `npm run build` | Builds the optimized production application |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint checks across the codebase |

---

## 📐 Official UK Passport Photo Guidelines

PixPassport formats photos according to official UK HMPO specifications:

```
+------------------------------------------+
|  <- - - - - 35 mm (Width) - - - - - - >  |
|                                          |
|   +----------------------------------+   |
|   |   Top Clearance: 3 - 5 mm        |   |
|   |  ..............................  |   |
|   |  :        [ Crown Line ]      :  |   |
|   |  :                            :  |   | ^
|   |  :                            :  |   | |
|   |  :                            :  |   | |
|   |  :        [ Eye Level ]       :  |   | 45 mm (Height)
|   |  :                            :  |   | |
|   |  :                            :  |   | |
|   |  :        [ Chin Line ]       :  |   | v
|   |  ..............................  |   |
|   |   Head Height: 29 - 34 mm        |   |
|   +----------------------------------+   |
|                                          |
+------------------------------------------+
```

* **Dimensions:** 35 mm wide × 45 mm high.
* **Head Size:** 29 mm to 34 mm from crown to chin.
* **Background:** Plain cream, light grey, or off-white with no shadows.
* **Expression:** Neutral expression, mouth closed, looking straight into the camera.
* **Accessories:** No hats, sunglasses, or tinted lenses (religious headwear permitted).

---

## 🔍 SEO & Technical Architecture

PixPassport is fully optimized for UK organic search:

* **Primary Keyword:** `digital photo for passport`
* **Secondary Keywords:** `create passport picture online`, `digital photo for passport renewal`, `print passport photo online`, `UK passport photo maker`
* **Canonical & Localization:** Strict canonical base (`https://pixpassport.uk`), `en-GB` hreflang declaration, and UK geo-tags (`geo.region: GB`).
* **Structured Data:** Built-in JSON-LD graph with schema types:
  * `schema.org/Organization`
  * `schema.org/WebSite`
  * `schema.org/WebApplication`
  * `schema.org/FAQPage`
* **Dynamic Sitemaps & Robots:** Native Next.js App Router `robots.ts` and `sitemap.ts` endpoints.

---

## 📁 Project Structure

```
pixpassport.uk/
├── public/
│   └── pixpassport.jpg        # Brand assets, favicon, OG image
├── src/
│   ├── app/
│   │   ├── apple-icon.jpg     # Apple touch icon
│   │   ├── globals.css        # Tailwind CSS v4, DaisyUI theme, tokens
│   │   ├── icon.jpg           # App favicon
│   │   ├── layout.tsx         # Root layout with UK metadata
│   │   ├── page.tsx           # Main homepage
│   │   ├── robots.ts          # Programmatic robots.txt
│   │   └── sitemap.ts         # Programmatic sitemap.xml
│   ├── components/
│   │   ├── FAQ.tsx            # FAQ accordion component
│   │   ├── Features.tsx       # Feature benefits grid
│   │   ├── Footer.tsx         # Site footer with brand and links
│   │   ├── Hero.tsx           # Keyword-targeted hero section
│   │   ├── HowItWorks.tsx     # 3-step passport photo guide
│   │   ├── JsonLd.tsx         # Schema.org structured data component
│   │   ├── Navbar.tsx         # Header navigation bar with brand icon
│   │   ├── Pricing.tsx        # Transparent 100% free pricing block
│   │   └── UploadCard.tsx     # Drag-and-drop uploader & preview
│   └── mdx-components.tsx     # MDX custom component bindings
├── .gitignore                 # Git ignore rules
├── .prettierignore            # Prettier ignore rules
├── .prettierrc                # Prettier code formatting rules
├── CLAUDE.md                  # Assistant & engineering guide
├── DESIGN.md                  # Comprehensive design system & UI specs
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Package manifests and scripts
├── README.md                  # Project documentation
└── tsconfig.json              # TypeScript configuration
```

---

## 🔒 Privacy Guarantee

We believe your personal photos and biometrics belong only to you:
1. Photos are processed strictly in your local browser memory using Canvas.
2. No data, image files, or telemetry are transmitted to remote servers.
3. Closing the browser tab destroys all temporary image caches immediately.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
