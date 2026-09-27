import type { ReactNode } from "react";
import { CheckCircle } from "lucide-react";

export const DEFAULT_BENEFITS: string[] = [
  "Unlimited passport photos",
  "35 mm × 45 mm UK format",
  "High-resolution download",
  "In-browser processing",
  "No account required",
  "Print-ready 6×4″ layout",
];

export interface PricingProps {
  id?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  price?: string;
  priceSuffix?: string;
  priceDescription?: string;
  benefits?: string[];
  ctaText?: string;
  ctaHref?: string;
  className?: string;
  children?: ReactNode;
}

export default function Pricing({
  id = "pricing",
  title = "Free UK Passport Photo Maker",
  subtitle = "No hidden fees, no subscriptions. Create a digital photo for passport applications at zero cost.",
  badge = "Free Forever",
  price = "£0",
  priceSuffix = "/photo",
  priceDescription = "Completely free — no payment ever required",
  benefits = DEFAULT_BENEFITS,
  ctaText = "Create Your Passport Photo — Free",
  ctaHref = "#upload",
  className = "",
  children,
}: PricingProps) {
  return (
    <section
      className={`bg-base-100 section-padding ${className}`.trim()}
      id={id}
      aria-labelledby={`${id}-heading`}
    >
      <div className="container-narrow">
        <header className="text-center mb-14">
          <h2 id={`${id}-heading`} className="text-base-content mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </header>

        <div className="max-w-md mx-auto">
          <article className="card bg-base-100 border-2 border-primary card-shadow">
            <div className="card-body gap-6">
              {/* Pricing Header */}
              <div className="text-center">
                {badge && (
                  <span className="badge badge-primary mb-3 font-medium">
                    {badge}
                  </span>
                )}
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-base-content">
                    {price}
                  </span>
                  {priceSuffix && (
                    <span className="text-base-content/50 text-lg">
                      {priceSuffix}
                    </span>
                  )}
                </div>
                {priceDescription && (
                  <p className="text-base-content/60 text-sm mt-2">
                    {priceDescription}
                  </p>
                )}
              </div>

              <div className="divider my-0" />

              {/* Benefits list */}
              {benefits && benefits.length > 0 && (
                <ul
                  className="space-y-3 list-none p-0 m-0"
                  aria-label="Included features"
                >
                  {benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-base-content/80 text-sm"
                    >
                      <CheckCircle className="w-4.5 h-4.5 text-success shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* CTA */}
              {ctaText && (
                <a
                  href={ctaHref}
                  className="btn btn-primary btn-lg w-full mt-2"
                >
                  {ctaText}
                </a>
              )}

              {children}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
