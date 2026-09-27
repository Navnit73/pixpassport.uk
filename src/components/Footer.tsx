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
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/#faq" },
    { label: "Terms of Service", href: "/#faq" },
    { label: "Cookie Policy", href: "/#faq" },
  ],
  Resources: [
    { label: "UK Passport Photo Requirements", href: "/#photo-rules" },
    { label: "Photo Maker Studio", href: "/passport-size-photo-maker" },
    { label: "Printing Guide", href: "/#how-it-works" },
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
      className={`bg-secondary text-secondary-content ${className}`.trim()}
      role="contentinfo"
    >
      <div className="container-narrow section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-xl font-bold mb-4 hover:opacity-90 transition-opacity"
            >
              {brandLogo && (
                <Image
                  src={brandLogo}
                  alt={brandLogoAlt}
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-secondary-content/20 shrink-0"
                />
              )}
              <span>{brandName}</span>
            </Link>
            <div className="text-secondary-content/70 text-sm leading-relaxed max-w-sm">
              {typeof brandDescription === "string" ? (
                <p>{brandDescription}</p>
              ) : (
                brandDescription
              )}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(linkGroups).map(([heading, links]) => (
            <nav key={heading} aria-label={`${heading} navigation`}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary-content/90 mb-3.5">
                {heading}
              </h4>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.target}
                      rel={link.rel}
                      className="text-secondary-content/65 hover:text-secondary-content text-sm transition-colors block py-0.5"
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

        <div className="divider before:bg-secondary-content/10 after:bg-secondary-content/10 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-secondary-content/55 text-center sm:text-left">
          <p>{copyrightText ?? defaultCopyright}</p>
          <p className="flex items-center gap-1.5">
            {regionNotice ?? (
              <>
                Made in the United Kingdom{" "}
                <span className="inline-block" aria-label="United Kingdom flag">
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
