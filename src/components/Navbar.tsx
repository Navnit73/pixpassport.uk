"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Camera,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50">
      <div className="container-narrow flex items-center justify-between w-full">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-base-content"
          aria-label="PixPassport home"
        >
          <Camera className="w-7 h-7 text-primary" strokeWidth={2.2} />
          <span>
            Pix<span className="text-primary">Passport</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="btn btn-ghost btn-sm text-base-content/80 hover:text-base-content font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#upload" className="btn btn-primary btn-sm">
            Get Started
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="btn btn-ghost btn-square md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden bg-base-100 border-t border-base-300 absolute top-full left-0 right-0 z-50">
          <nav className="menu menu-vertical p-4 gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="menu-item py-3 px-4 rounded-lg text-base-content/80 hover:bg-base-200 hover:text-base-content font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="divider my-2" />
            <a
              href="#upload"
              className="btn btn-primary w-full"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
