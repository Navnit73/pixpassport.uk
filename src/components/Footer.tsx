import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

export interface FooterLinkItem {
  label: string;
  href: string;
  target?: string;
  rel?: string;
}

export const DEFAULT_FOOTER_LINKS: Record<string, FooterLinkItem[]> = {
  Product: [
    { label: "Photo Maker Studio", href: "/passport-size-photo-maker" },
    { label: "Print Template Generator (4×6″)", href: "/passport-photo-print-template-generator" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
    { label: "XML Sitemap", href: "/sitemap.xml" },
  ],
  "Country Guides": [
    { label: "UK Passport Photo (35×45mm)", href: "/tool/uk-passport-photo" },
    { label: "UK Passport Renewal Photo", href: "/tool/passport-renewal-photo-online" },
    { label: "UK Baby Passport Photo", href: "/tool/uk-baby-passport-photo" },
    { label: "UK Driving Licence Photo", href: "/tool/uk-driving-licence-photo" },
    { label: "US Visa & Passport (2×2″)", href: "/tool/us-visa-photo-tool" },
    { label: "Schengen Visa Photo", href: "/tool/schengen-visa-photo" },
    { label: "Indian Passport & OCI", href: "/tool/indian-passport-photo-maker" },
  ],
  "Photo Tools": [
    { label: "Print Template Generator", href: "/passport-photo-print-template-generator" },
    { label: "Digital Passport Photo", href: "/tool/digital-passport-photo" },
    { label: "35×45 mm Photo Size", href: "/tool/photo-size-35x45mm" },
    { label: "Image to Passport Converter", href: "/tool/image-to-passport-size-converter" },
    { label: "Passport Photo at Home", href: "/tool/passport-photo-at-home" },
    { label: "iPhone Passport Photo", href: "/tool/take-a-passport-photo-on-iphone" },
    { label: "Online Passport Photo Tool", href: "/tool/passport-photo-tool" },
    { label: "Online ID Photo Maker", href: "/tool/online-id-photo-maker" },
    { label: "Order Passport Photos", href: "/tool/order-passport-photos-online" },
  ],
  "Company & Legal": [
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "Data Security & Privacy", href: "/data-security-privacy-safeguards" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
};

export interface FooterProps {
  brandName?: string;
  brandLogo?: string;
  brandLogoAlt?: string;
  brandDescription?: ReactNode;
  linkGroups?: Record<string, FooterLinkItem[]>;
  copyrightText?: string;
  regionNotice?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export default function Footer({
  brandName = "PixPassport",
  brandLogo = "/pixpassport.jpg",
  brandLogoAlt = "PixPassport Logo",
  brandDescription = "Official UK passport photo maker. Create HMPO-compliant biometric digital photos and 6×4″ print sheets for the UK and 50+ countries online for £7.99 with guaranteed acceptance.",
  linkGroups = DEFAULT_FOOTER_LINKS,
  copyrightText,
  regionNotice,
  className = "",
  children,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} ${brandName}. All rights reserved.`;

  return (
    <footer
      className={`bg-[#111827] text-slate-100 ${className}`.trim()}
      role="contentinfo"
    >
      <div className="container-narrow section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-xl font-bold mb-4 text-white hover:text-lime-400 transition-colors focus-ring rounded-lg"
              aria-label="PixPassport homepage"
            >
              {brandLogo && (
                <Image
                  src={brandLogo}
                  alt={brandLogoAlt}
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20 shrink-0"
                />
              )}
              <span>{brandName}</span>
            </Link>
            <div className="text-slate-300 text-sm leading-relaxed max-w-sm">
              {typeof brandDescription === "string" ? (
                <p>{brandDescription}</p>
              ) : (
                brandDescription
              )}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(linkGroups).map(([heading, links]) => (
            <nav key={heading} aria-label={`${heading} links`}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5">
                {heading}
              </h2>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.target}
                      rel={link.rel}
                      className="text-slate-300 hover:text-white hover:underline text-sm transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {children}

        <div className="border-t border-slate-800 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-300 text-center sm:text-left">
          <p>{copyrightText ?? defaultCopyright}</p>
          <p className="flex items-center gap-1.5 text-slate-300">
            {regionNotice ?? (
              <>
                <span>Made in the United Kingdom</span>
                <span className="inline-block text-base" aria-label="United Kingdom flag">
                  🇬🇧
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
