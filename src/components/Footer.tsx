import type { ReactNode } from "react";
import Image from "next/image";

export interface FooterLinkItem {
  label: string;
  href: string;
  target?: string;
  rel?: string;
}

export const DEFAULT_FOOTER_LINKS: Record<string, FooterLinkItem[]> = {
  Product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
  Resources: [
    { label: "UK Passport Photo Requirements", href: "#faq" },
    { label: "Printing Guide", href: "#how-it-works" },
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
  brandDescription = "Free UK passport photo maker. Create a digital photo for passport applications and renewals — no sign-up, no fees, no data stored.",
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 text-xl font-bold mb-4">
              {brandLogo && (
                <Image
                  src={brandLogo}
                  alt={brandLogoAlt}
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-secondary-content/20"
                />
              )}
              <span>{brandName}</span>
            </div>
            <div className="text-secondary-content/60 text-sm leading-relaxed mb-4">
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
              <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary-content/80 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.target}
                      rel={link.rel}
                      className="text-secondary-content/60 hover:text-secondary-content text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {children}

        <div className="divider before:bg-secondary-content/10 after:bg-secondary-content/10 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-secondary-content/50">
          <p>{copyrightText ?? defaultCopyright}</p>
          <p>
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
