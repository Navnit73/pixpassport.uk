"use client";

import { useState, useEffect, type ReactNode } from "react";
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
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
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
  ctaHref = "/passport-size-photo-maker",
  className = "",
  ariaLabel = "Main site navigation",
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={`navbar bg-base-100 border-b border-base-300 sticky top-0 z-50 px-0 ${className}`.trim()}
      role="banner"
    >
      <div className="container-narrow flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href={brandHref}
          className="flex items-center gap-2.5 text-lg sm:text-xl font-bold text-base-content focus-ring rounded-lg py-1 px-1.5 -ml-1.5"
          aria-label="PixPassport homepage"
        >
          {logoSrc && (
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              priority
              className="w-8 h-8 rounded-lg object-cover shadow-xs border border-primary/20 shrink-0"
            />
          )}
          <span>{brandName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label={ariaLabel}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.target}
              rel={link.rel}
              className="btn btn-ghost btn-sm text-base-content/80 hover:text-base-content hover:bg-base-200 font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        {ctaText && (
          <div className="hidden md:flex items-center gap-3">
            <Link href={ctaHref} className="btn btn-primary btn-sm px-4">
              {ctaText}
            </Link>
          </div>
        )}

        {/* Mobile menu toggle */}
        <button
          className="btn btn-ghost btn-square btn-sm md:hidden text-base-content"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation-drawer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown menu & backdrop */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-[57px] bg-neutral/30 backdrop-blur-xs z-40 md:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-navigation-drawer"
            className="md:hidden bg-base-100 border-t border-base-300 absolute top-full left-0 right-0 z-50 shadow-xl animate-fade-in"
          >
            <nav
              className="menu menu-vertical p-4 gap-1.5"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.target}
                  rel={link.rel}
                  className="py-2.5 px-3 rounded-lg text-base-content/80 hover:bg-base-200 hover:text-base-content font-medium text-base transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {ctaText && (
                <>
                  <div className="divider my-2" />
                  <Link
                    href={ctaHref}
                    className="btn btn-primary w-full text-base font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    {ctaText}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
