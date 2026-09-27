import Image from "next/image";

const currentYear = new Date().getFullYear();

const footerLinks = {
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

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-content">
      <div className="container-narrow section-padding">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 text-xl font-bold mb-4">
              <Image
                src="/pixpassport.jpg"
                alt="PixPassport Logo"
                width={28}
                height={28}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-secondary-content/20"
              />
              <span>PixPassport</span>
            </div>
            <p className="text-secondary-content/60 text-sm leading-relaxed mb-4">
              Free UK passport photo maker. Create a digital photo for passport
              applications and renewals — no sign-up, no fees, no data stored.
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
            <span className="inline-block" aria-label="United Kingdom flag">
              🇬🇧
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
