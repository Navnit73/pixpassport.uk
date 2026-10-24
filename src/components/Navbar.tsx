"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowRight, ShieldCheck } from "lucide-react";

export interface NavLinkItem {
  label: string;
  href: string;
  target?: string;
  rel?: string;
}

export interface NavMenuItem {
  title: string;
  /** Short spec or one-line description shown under the title. */
  description: string;
  href: string;
  icon: string;
  badge?: "Popular" | "New";
}

export interface NavMenuSection {
  heading: string;
  items: NavMenuItem[];
}

export interface NavMenu {
  id: "tools" | "guides";
  label: string;
  sections: NavMenuSection[];
  footerText: string;
  footerLink: NavLinkItem;
}

export const NAV_MENUS: NavMenu[] = [
  {
    id: "tools",
    label: "Tools",
    sections: [
      {
        heading: "Make Your Photo",
        items: [
          { title: "Passport Photo Maker", description: "Crop, clean background & check", href: "/passport-size-photo-maker", icon: "✨", badge: "Popular" },
          { title: "Print Template Generator", description: "4×6″, 5×7″ & A4 print sheets", href: "/passport-photo-print-template-generator", icon: "🖨️" },
          { title: "Digital Passport Photo", description: "For GOV.UK online applications", href: "/tool/digital-passport-photo", icon: "💻" },
          { title: "Image to Passport Converter", description: "Resize any portrait to size", href: "/tool/image-to-passport-size-converter", icon: "🔄" },
          { title: "Online ID Photo Maker", description: "Student IDs, badges & cards", href: "/tool/online-id-photo-maker", icon: "🪪" },
        ],
      },
      {
        heading: "UK Documents",
        items: [
          { title: "UK Passport Photo", description: "35 × 45 mm · HMPO", href: "/tool/uk-passport-photo", icon: "🇬🇧" },
          { title: "Passport Renewal Photo", description: "Online renewal · 600 × 750 px", href: "/tool/passport-renewal-photo-online", icon: "🔄" },
          { title: "Baby Passport Photo", description: "Babies & young children", href: "/tool/uk-baby-passport-photo", icon: "👶" },
          { title: "Driving Licence Photo", description: "35 × 45 mm · DVLA", href: "/tool/uk-driving-licence-photo", icon: "🚗" },
          { title: "UK Visa & ETA Photo", description: "UKVI applications", href: "/tool/uk-visa-photo", icon: "🛂" },
        ],
      },
      {
        heading: "Other Countries",
        items: [
          { title: "US Visa & Passport", description: "2 × 2 in · DS-160", href: "/tool/us-visa-photo-tool", icon: "🇺🇸" },
          { title: "Schengen Visa Photo", description: "35 × 45 mm · EU", href: "/tool/schengen-visa-photo", icon: "🇪🇺" },
          { title: "Indian Passport & OCI", description: "35 × 45 mm / 2 × 2 in", href: "/tool/indian-passport-photo-maker", icon: "🇮🇳" },
          { title: "Australian Passport", description: "35–40 × 45–50 mm", href: "/tool/australian-passport-photo-uk", icon: "🇦🇺" },
          { title: "35 × 45 mm Photo Size", description: "Standard biometric size", href: "/tool/photo-size-35x45mm", icon: "📐" },
        ],
      },
    ],
    footerText: "50+ country formats checked against official rules",
    footerLink: { label: "Browse all photo tools", href: "/tool" },
  },
  {
    id: "guides",
    label: "Guides",
    sections: [
      {
        heading: "How-To Guides",
        items: [
          { title: "Take a Passport Photo at Home", description: "7 steps with just a phone", href: "/how-to/take-a-passport-photo-at-home", icon: "📸", badge: "New" },
          { title: "Take a Visa Photo at Home", description: "UK, Schengen, US & DV lottery", href: "/how-to/take-visa-picture-at-home", icon: "🛂", badge: "New" },
          { title: "Change Your DVLA Photo", description: "Take it at home & renew online", href: "/how-to/change-dvla-photo", icon: "🚗", badge: "New" },
          { title: "Passport Photo on iPhone", description: "Camera settings & framing", href: "/tool/take-a-passport-photo-on-iphone", icon: "📱" },
          { title: "Print Passport Photos at Home", description: "Printer settings & free A4 sheet", href: "/print-passport-photos-at-home", icon: "🏠" },
        ],
      },
      {
        heading: "Rules & Checks",
        items: [
          { title: "UK Passport Photo Requirements", description: "Every rule + built-in checker", href: "/tool/passport-picture-requirements-uk-tool", icon: "📝", badge: "New" },
          { title: "UK Passport Picture Rules", description: "Full HMPO standard explained", href: "/tool/passport-picture-rules-uk", icon: "📋" },
          { title: "UK Passport Photo Checker", description: "Test your photo before you apply", href: "/tool/passport-photo-checker-uk", icon: "✅" },
          { title: "US Visa Photo Size & Rules", description: "DS-160 600 × 600 px", href: "/tool/us-visa-passport-photo-size", icon: "📏" },
          { title: "ICAO Photo Standards", description: "Doc 9303 explained", href: "/tool/icao-standards-photo-online-free", icon: "🌐" },
        ],
      },
    ],
    footerText: "Plain-English help for every step",
    footerLink: { label: "All how-to guides", href: "/how-to" },
  },
];

export const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact-us" },
];

export interface NavbarProps {
  brandName?: ReactNode;
  brandHref?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  navLinks?: NavLinkItem[];
  /** Shows the Tools and Guides dropdown menus. */
  showToolsDropdown?: boolean;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
  ariaLabel?: string;
}

type MenuId = NavMenu["id"];

const HOVER_CLOSE_DELAY_MS = 150;

const menuItems = (menu: NavMenu) => menu.sections.flatMap((s) => s.items);

/** The menu whose section the current page belongs to, used for the active indicator. */
function getActiveMenu(pathname: string | null): MenuId | null {
  if (!pathname) return null;
  const guides = NAV_MENUS.find((m) => m.id === "guides")!;
  if (pathname.startsWith("/how-to") || menuItems(guides).some((i) => i.href === pathname)) {
    return "guides";
  }
  const tools = NAV_MENUS.find((m) => m.id === "tools")!;
  if (pathname.startsWith("/tool") || menuItems(tools).some((i) => i.href === pathname)) {
    return "tools";
  }
  return null;
}

function Badge({ label }: { label: string }) {
  return (
    <span className="text-[10px] font-bold leading-none px-1.5 py-1 rounded-full bg-primary/15 text-secondary shrink-0">
      {label}
    </span>
  );
}

function ActiveUnderline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute -bottom-0.5 left-0 h-0.5 w-full bg-primary rounded-full transition-transform duration-300 ease-out origin-left pointer-events-none ${
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
      }`}
    />
  );
}

export default function Navbar({
  brandName = (
    <span>
      Pix<span className="text-primary font-extrabold">Passport</span>
    </span>
  ),
  brandHref = "/",
  logoSrc = "/pixpassport.jpg",
  logoAlt = "PixPassport Logo",
  logoWidth = 32,
  logoHeight = 32,
  navLinks = DEFAULT_NAV_LINKS,
  showToolsDropdown = true,
  ctaText = "Get Started",
  ctaHref = "/passport-size-photo-maker",
  className = "",
  ariaLabel = "Main site navigation",
}: NavbarProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MenuId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeMenu = getActiveMenu(pathname);
  const menus = showToolsDropdown ? NAV_MENUS : [];

  // Close everything after client-side navigation.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  // Escape closes menus and returns focus to the trigger; clicking outside closes them.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpenMenu((current) => {
        if (current) triggerRefs.current[current]?.focus();
        return null;
      });
      setMobileOpen(false);
    }
    function handlePointerDown(e: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stop the page scrolling behind the open mobile drawer.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const openOnHover = (id: MenuId) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpenMenu(id);
  };

  const closeOnHoverOut = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setOpenMenu(null), HOVER_CLOSE_DELAY_MS);
  };

  const isLinkActive = (href: string) =>
    !href.includes("#") && (pathname === href || Boolean(pathname?.startsWith(`${href}/`)));

  const openMenuData = menus.find((m) => m.id === openMenu);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 bg-base-100/95 backdrop-blur supports-[backdrop-filter]:bg-base-100/85 border-b transition-shadow duration-200 ${
        scrolled || mobileOpen ? "border-base-300 shadow-sm" : "border-base-300/70"
      } ${className}`.trim()}
      role="banner"
    >
      <div className="container-narrow relative flex h-16 items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href={brandHref}
          className="flex items-center gap-2.5 text-lg sm:text-xl font-bold text-base-content focus-ring rounded-lg py-1 px-1.5 -ml-1.5 transition-opacity hover:opacity-90 shrink-0"
          aria-label="PixPassport homepage"
        >
          {logoSrc && (
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              priority
              className="w-8 h-8 rounded-lg object-cover shadow-xs border border-primary/30 shrink-0"
            />
          )}
          <span>{brandName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label={ariaLabel}>
          {menus.map((menu) => {
            const isOpen = openMenu === menu.id;
            const isActive = activeMenu === menu.id;
            return (
              <div
                key={menu.id}
                onMouseEnter={() => openOnHover(menu.id)}
                onMouseLeave={closeOnHoverOut}
              >
                <button
                  ref={(el) => {
                    triggerRefs.current[menu.id] = el;
                  }}
                  type="button"
                  onClick={() => setOpenMenu(isOpen ? null : menu.id)}
                  className={`group inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors duration-200 focus-ring ${
                    isOpen ? "bg-base-200 text-base-content" : "text-base-content/75 hover:text-base-content hover:bg-base-200/70"
                  } ${isActive ? "font-semibold text-base-content" : "font-medium"}`}
                  aria-expanded={isOpen}
                  aria-controls={`nav-panel-${menu.id}`}
                >
                  <span className="relative">
                    {menu.label}
                    <ActiveUnderline active={isActive} />
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            );
          })}

          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                target={link.target}
                rel={link.rel}
                className={`group inline-flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 focus-ring ${
                  isActive
                    ? "font-semibold text-base-content"
                    : "font-medium text-base-content/75 hover:text-base-content hover:bg-base-200/70"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="relative">
                  {link.label}
                  <ActiveUnderline active={isActive} />
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <Link
            href="/tool/passport-photo-checker-uk"
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-base-content/80 hover:text-base-content rounded-lg hover:bg-base-200/70 transition-colors focus-ring"
          >
            <ShieldCheck className="w-4 h-4 text-accent" aria-hidden="true" />
            Check My Photo
          </Link>
          {ctaText && (
            <Link
              href={ctaHref}
              className="btn btn-primary btn-sm h-9 px-4 rounded-lg font-bold !text-white shadow-xs hover:shadow-sm"
            >
              {ctaText}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="btn btn-ghost btn-square btn-sm lg:hidden text-base-content"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation-drawer"
        >
          {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </button>

        {/* Desktop dropdown panel */}
        {openMenuData && (
          <div
            id={`nav-panel-${openMenuData.id}`}
            className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[min(60rem,calc(100vw-2rem))] animate-fade-in"
            onMouseEnter={() => openOnHover(openMenuData.id)}
            onMouseLeave={closeOnHoverOut}
          >
            <div className="bg-base-100 rounded-2xl border border-base-300 shadow-2xl overflow-hidden">
              <div
                className={`grid gap-6 p-5 ${
                  openMenuData.sections.length === 3 ? "grid-cols-3" : "grid-cols-2"
                }`}
              >
                {openMenuData.sections.map((section) => (
                  <div key={section.heading}>
                    <p className="px-2.5 pb-2 text-xs font-bold tracking-wider uppercase text-base-content/60">
                      {section.heading}
                    </p>
                    <ul className="space-y-0.5 list-none p-0 m-0">
                      {section.items.map((item) => {
                        const isCurrent = pathname === item.href;
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setOpenMenu(null)}
                              className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors focus-ring group/item ${
                                isCurrent ? "bg-primary/10" : "hover:bg-base-200"
                              }`}
                              aria-current={isCurrent ? "page" : undefined}
                            >
                              <span
                                className="w-9 h-9 rounded-lg bg-base-200 border border-base-300 flex items-center justify-center text-base shrink-0 group-hover/item:bg-base-100 transition-colors"
                                aria-hidden="true"
                              >
                                {item.icon}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-1.5">
                                  <span className="text-sm font-semibold text-base-content truncate">{item.title}</span>
                                  {item.badge && <Badge label={item.badge} />}
                                </span>
                                <span className="block text-xs text-base-content/65 truncate mt-0.5">
                                  {item.description}
                                </span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 px-6 py-3.5 bg-base-200 border-t border-base-300">
                <span className="flex items-center gap-2 text-xs font-medium text-base-content/75">
                  <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                  {openMenuData.footerText}
                </span>
                <Link
                  href={openMenuData.footerLink.href}
                  onClick={() => setOpenMenu(null)}
                  className="inline-flex items-center gap-1 text-sm font-bold text-secondary hover:underline focus-ring rounded"
                >
                  {openMenuData.footerLink.label}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile drawer & backdrop */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-x-0 top-16 bottom-0 bg-secondary/40 backdrop-blur-xs z-40 lg:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-navigation-drawer"
            className="lg:hidden fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] flex flex-col bg-base-100 border-t border-base-300 shadow-xl animate-fade-in"
          >
            <nav className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-1" aria-label="Mobile navigation">
              {menus.map((menu) => {
                const isOpen = mobileSection === menu.id;
                return (
                  <div key={menu.id}>
                    <button
                      type="button"
                      onClick={() => setMobileSection(isOpen ? null : menu.id)}
                      className={`w-full flex items-center justify-between py-3 px-3 rounded-xl text-base font-semibold transition-colors ${
                        isOpen || activeMenu === menu.id ? "bg-base-200 text-base-content" : "text-base-content hover:bg-base-200"
                      }`}
                      aria-expanded={isOpen}
                      aria-controls={`mobile-panel-${menu.id}`}
                    >
                      {menu.label}
                      <ChevronDown
                        className={`w-4 h-4 text-base-content/60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>

                    {isOpen && (
                      <div id={`mobile-panel-${menu.id}`} className="pt-2 pb-3 space-y-4">
                        {menu.sections.map((section) => (
                          <div key={section.heading}>
                            <p className="px-3 pb-1 text-xs font-bold tracking-wider uppercase text-base-content/60">
                              {section.heading}
                            </p>
                            <ul className="list-none p-0 m-0">
                              {section.items.map((item) => {
                                const isCurrent = pathname === item.href;
                                return (
                                  <li key={item.href}>
                                    <Link
                                      href={item.href}
                                      onClick={() => setMobileOpen(false)}
                                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                                        isCurrent ? "bg-primary/10" : "hover:bg-base-200"
                                      }`}
                                      aria-current={isCurrent ? "page" : undefined}
                                    >
                                      <span className="text-lg shrink-0 w-6 text-center" aria-hidden="true">
                                        {item.icon}
                                      </span>
                                      <span className="min-w-0 flex-1">
                                        <span className="flex items-center gap-1.5">
                                          <span className="text-sm font-semibold text-base-content truncate">
                                            {item.title}
                                          </span>
                                          {item.badge && <Badge label={item.badge} />}
                                        </span>
                                        <span className="block text-xs text-base-content/65 truncate">
                                          {item.description}
                                        </span>
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                        <Link
                          href={menu.footerLink.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-1 px-3 text-sm font-bold text-secondary underline"
                        >
                          {menu.footerLink.label}
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}

              {navLinks.map((link) => {
                const isActive = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={link.target}
                    rel={link.rel}
                    className={`flex items-center py-3 px-3 rounded-xl text-base font-semibold transition-colors ${
                      isActive ? "bg-primary/10 text-base-content" : "text-base-content hover:bg-base-200"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-base-300 bg-base-100 grid grid-cols-2 gap-2">
              <Link
                href="/tool/passport-photo-checker-uk"
                onClick={() => setMobileOpen(false)}
                className={`btn btn-outline border-base-300 font-semibold ${ctaText ? "" : "col-span-2"}`}
              >
                <ShieldCheck className="w-4 h-4 text-accent" aria-hidden="true" />
                Check Photo
              </Link>
              {ctaText && (
                <Link
                  href={ctaHref}
                  className="btn btn-primary font-bold !text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {ctaText}
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
