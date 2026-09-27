import { Camera } from "lucide-react";

const currentYear = new Date().getFullYear();

const footerLinks = {
  Product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
  Resources: [
    { label: "UK Photo Requirements", href: "#" },
    { label: "Printing Guide", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-content">
      <div className="container-narrow section-padding">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 text-xl font-bold mb-4">
              <Camera className="w-6 h-6" strokeWidth={2.2} />
              <span>PixPassport</span>
            </div>
            <p className="text-secondary-content/60 text-sm leading-relaxed mb-4">
              Free UK passport photos that meet HM Passport Office requirements.
              No sign-up, no fees, no data stored.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary-content/80 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-secondary-content/60 hover:text-secondary-content text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider before:bg-secondary-content/10 after:bg-secondary-content/10 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-secondary-content/50">
          <p>&copy; {currentYear} PixPassport. All rights reserved.</p>
          <p>
            Made in the United Kingdom{" "}
            <span className="inline-block" aria-label="UK flag">
              🇬🇧
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
