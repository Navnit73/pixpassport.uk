"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export interface NavLinkItem {
  label: string;
  href: string;
  target?: string;
  rel?: string;
}

export const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export interface NavbarProps {
  brandName?: ReactNode;
  brandHref?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  navLinks?: NavLinkItem[];
  ctaText?: string;
  ctaHref?: string;
  className?: string;
  ariaLabel?: string;
}

export default function Navbar({
  brandName = (
    <span>
      Pix<span className="text-primary">Passport</span>
    </span>
  ),
  brandHref = "/",
  logoSrc = "/pixpassport.jpg",
  logoAlt = "PixPassport Logo",
  logoWidth = 32,
  logoHeight = 32,
  navLinks = DEFAULT_NAV_LINKS,
  ctaText = "Get Started",
  ctaHref = "#upload",
  className = "",
  ariaLabel = "Main site navigation",
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={`navbar bg-base-100 border-b border-base-300 sticky top-0 z-50 ${className}`.trim()}
      role="banner"
    >
      <div className="container-narrow flex items-center justify-between w-full">
        {/* Brand Logo */}
        <Link
          href={brandHref}
          className="flex items-center gap-2.5 text-xl font-bold text-base-content focus-ring rounded-lg p-1"
          aria-label="PixPassport homepage"
        >
          {logoSrc && (
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              priority
              className="w-8 h-8 rounded-lg object-cover shadow-xs border border-primary/20"
            />
          )}
          {brandName}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label={ariaLabel}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.target}
              rel={link.rel}
              className="btn btn-ghost btn-sm text-base-content/80 hover:text-base-content font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        {ctaText && (
          <div className="hidden md:flex items-center gap-3">
            <a href={ctaHref} className="btn btn-primary btn-sm">
              {ctaText}
            </a>
          </div>
        )}

        {/* Mobile menu toggle */}
        <button
          className="btn btn-ghost btn-square md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation-drawer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div
          id="mobile-navigation-drawer"
          className="md:hidden bg-base-100 border-t border-base-300 absolute top-full left-0 right-0 z-50 shadow-lg"
        >
          <nav
            className="menu menu-vertical p-4 gap-1"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.target}
                rel={link.rel}
                className="menu-item py-3 px-4 rounded-lg text-base-content/80 hover:bg-base-200 hover:text-base-content font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {ctaText && (
              <>
                <div className="divider my-2" />
                <a
                  href={ctaHref}
                  className="btn btn-primary w-full"
                  onClick={() => setMobileOpen(false)}
                >
                  {ctaText}
                </a>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
