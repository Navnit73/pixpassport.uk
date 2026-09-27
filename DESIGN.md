# PixPassport — Design System & UI Specification (`DESIGN.md`)

## 1. Brand Identity & Design Philosophy

**PixPassport** is engineered around three visual and UX pillars:
1. **Trust & Authority:** A crisp, modern, and British-appropriate visual language that gives users confidence when creating official passport photos.
2. **Speed & Clarity:** Minimal cognitive load. Clear step-by-step guidance from image upload to final print download.
3. **Accessibility & Usability:** High contrast, legible typography, generous tap targets, and comprehensive keyboard/screen-reader navigation.

---

## 2. Color Palette & Semantic Tokens

All color tokens are managed via CSS-first DaisyUI theme configuration in `src/app/globals.css`.

### Core Palette

| Token | Hex Value | Purpose & Application |
| :--- | :--- | :--- |
| `--color-primary` | `#65A30D` | Primary brand color (`lime-600`), primary CTA buttons, active state indicators, key links |
| `--color-primary-hover` | `#4D7C0F` | Primary button hover state (`lime-700`) |
| `--color-primary-content` | `#FFFFFF` | Text/icons on primary backgrounds |
| `--color-secondary` | `#172033` | Dark navy for high-contrast headers, footer background, bold typography |
| `--color-secondary-content`| `#FFFFFF` | Text/icons on secondary/dark backgrounds |
| `--color-accent` | `#0F766E` | Deep teal for badges, trust indicators, secondary highlights |
| `--color-accent-content` | `#FFFFFF` | Text on accent backgrounds |
| `--color-neutral` | `#172033` | Neutral dark accents and dark mode components |
| `--color-neutral-content` | `#FFFFFF` | Text on neutral backgrounds |

### Surface & Base Colors

| Token | Hex Value | Application |
| :--- | :--- | :--- |
| `--color-base-100` | `#FFFFFF` | Main page background, modal surfaces, primary card backgrounds |
| `--color-base-200` | `#F8FAFC` | Light slate surface for alternating sections (e.g. Upload area, Features) |
| `--color-base-300` | `#E2E8F0` | Subtle borders, dividers, disabled states |
| `--color-base-content` | `#172033` | Primary body text color (optimized for maximum contrast on base-100) |

### Feedback & Status Tokens

| Token | Hex Value | Application |
| :--- | :--- | :--- |
| `--color-info` | `#0284C7` | Information alerts, helpful hints, tooltips |
| `--color-success` | `#15803D` | Validated photo indicator, success alerts, checkmarks |
| `--color-warning` | `#D97706` | Lighting warnings, dimension caution alerts |
| `--color-error` | `#DC2626` | File format errors, invalid dimension errors |

---

## 3. Typography Scale & Hierarchy

We use **Geist Sans** for clean geometric clarity and **Geist Mono** for technical/dimension indicators.

| Level | Desktop Size / Leading | Mobile Size / Leading | Weight | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| **Hero H1** | `3.25rem` (52px) / `1.15` | `2.5rem` (40px) / `1.2` | Bold (`700`) | `-0.02em` |
| **Section H2**| `2.5rem` (40px) / `1.2` | `2.0rem` (32px) / `1.25` | Bold (`700`) | `-0.01em` |
| **Card H3** | `1.75rem` (28px) / `1.25` | `1.5rem` (24px) / `1.3` | Bold (`700`) | `0` |
| **Subhead H4**| `1.125rem` (18px) / `1.4` | `1.125rem` (18px) / `1.4` | SemiBold (`600`) | `0` |
| **Body (Lead)**| `1.125rem` (18px) / `1.6` | `1.0rem` (16px) / `1.5` | Regular (`400`) | `0` |
| **Body (Base)**| `1.0rem` (16px) / `1.6` | `1.0rem` (16px) / `1.6` | Regular (`400`) | `0` |
| **Caption** | `0.875rem` (14px) / `1.4` | `0.875rem` (14px) / `1.4` | Regular (`400`) | `0` |
| **Mono Specs**| `0.8125rem` (13px) / `1.2` | `0.8125rem` (13px) / `1.2` | Medium (`500`) | `0` |

---

## 4. Spacing, Elevation & Layout Grid

### Layout Dimensions
* **Max Container Width:** `72rem` (1152px) via `.container-narrow`
* **Horizontal Padding:** `1.5rem` (24px) on mobile/desktop
* **Section Gap:** `5rem` (80px) via `.section-padding`
* **Grid Baseline:** 8px rhythm for consistent spacing (`gap-2`, `gap-4`, `gap-6`, `gap-8`, `gap-12`)

### Elevation & Shadows
* **Flat Card Default:** `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06)` (`.card-shadow`)
* **Hover State:** `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)` (subtle lift with 250ms smooth transition)
* **Button States:** `.btn-primary` uses `#65A30D` with `:hover` state transition to `#4D7C0F`.
* **Interactive Focus:** Keyboard focus ring with `outline: 2px solid #65A30D; outline-offset: 2px;`

---

## 5. UI Component Hierarchy & Standards

### 1. Navigation Header (`Navbar.tsx`)
* Sticky top navigation bar (`sticky top-0 z-50`) with white surface and subtle border (`border-base-300`).
* Displays brand logo icon (`/pixpassport.jpg`) with crisp rounded corners and dual-tone wordmark (`PixPassport`).
* Desktop links with subtle hover feedback (`btn btn-ghost btn-sm`).
* Accessible mobile toggle button with clear ARIA attributes and expanded dropdown drawer.

### 2. Hero Section (`Hero.tsx`)
* High-impact headline targeting primary UK search queries.
* Trust indicator badges (e.g. "Free Online UK Photo Maker", "100% In-Browser Privacy").
* Clear primary call-to-action leading directly to the upload tool.

### 3. Upload & Cropping Card (`UploadCard.tsx`)
* Drag-and-drop target zone with dashed border, animated on drag hover (`border-primary bg-primary/5`).
* File validation badge supporting JPEG, PNG, and WebP formats up to 10 MB.
* Live photo preview with dismiss button and instant client-side processing status.
* Embedded guidelines checklist helping users avoid rejected photos.

### 4. Step-by-Step Flow (`HowItWorks.tsx`)
* 3-step linear progression:
  1. **Upload Photo:** Take a clear snapshot against a plain background.
  2. **Auto-Format & Crop:** Adjust to official 35 mm × 45 mm UK proportions.
  3. **Download & Print:** Export digital photo or 6×4″ printable sheet.

### 5. Feature Grid (`Features.tsx`)
* 6-column responsive card layout featuring Lucide React icons (`Ruler`, `Shield`, `Printer`, `Zap`, `Lock`, `Smartphone`).
* Card-level subtle border, comfortable padding, and crisp typography.

### 6. Pricing Section (`Pricing.tsx`)
* Simple, transparent pricing card highlighting the 100% free forever promise.
* List of inclusions (unlimited downloads, UK 35×45mm compliance, private in-browser engine, 6×4″ print grid).

### 7. FAQ Accordion (`FAQ.tsx`)
* Native DaisyUI / accessible accordion format for effortless browsing.
* Clear, informative answers directly matching the Schema.org JSON-LD structured data.

### 8. Footer (`Footer.tsx`)
* Dark navy background (`bg-secondary text-secondary-content`) providing a visual anchor.
* Brand overview, structured link groups (Product, Legal, Resources), copyright notice, and United Kingdom indicator (`🇬🇧`).

---

## 6. Passport Photo Visual Overlay Specifications

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

---

## 7. Accessibility (a11y) & Motion Standards

* **WCAG 2.1 AA Compliance:** Minimum color contrast ratio of 4.5:1 for normal text and 3:1 for large headings.
* **Touch Targets:** Minimum tap target size of `44px` (`2.75rem`) for all buttons and interactive controls.
* **Keyboard Navigation:** Clear `:focus-visible` ring (`#65A30D`) across all interactive controls.
* **Reduced Motion:** Automatic suppression of animations for users with `prefers-reduced-motion: reduce`.
