import type { ReactNode, ComponentType } from "react";
import {
  Ruler,
  Shield,
  Printer,
  Zap,
  Lock,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export interface FeatureItem {
  icon?: LucideIcon | ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export const DEFAULT_FEATURES: FeatureItem[] = [
  {
    icon: Ruler,
    title: "Official 35 mm × 45 mm Format",
    description:
      "Photos are automatically sized to the official dimensions required for UK passport applications and renewals.",
  },
  {
    icon: Shield,
    title: "UK Passport Specification",
    description:
      "Built-in checks help ensure your digital photo for passport meets the dimensional requirements before you download.",
  },
  {
    icon: Printer,
    title: "Print Passport Photo Online",
    description:
      "Download a high-resolution file sized for standard 6×4″ photo paper — ready for home or pharmacy printing.",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description:
      "Your photo is processed entirely in-browser. No uploads to external servers and no waiting.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description:
      "Photos never leave your device. All processing happens locally with no data stored or transmitted.",
  },
  {
    icon: Smartphone,
    title: "Works on Any Device",
    description:
      "Fully responsive — create your passport picture online from desktop, tablet, or mobile browsers.",
  },
];

export interface FeaturesProps {
  id?: string;
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
  className?: string;
  children?: ReactNode;
}

export default function Features({
  id = "features",
  title = "Why Use PixPassport as Your UK Passport Photo Maker?",
  subtitle = "Everything you need to create a digital photo for passport applications — fast, private, and completely free.",
  features = DEFAULT_FEATURES,
  className = "",
  children,
}: FeaturesProps) {
  return (
    <section
      className={`bg-base-200 section-padding ${className}`.trim()}
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

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
          {features.map(({ icon: Icon, title: featureTitle, description }, index) => (
            <li key={index} className="flex">
              <article className="card bg-base-100 border border-base-300 card-shadow w-full">
                <div className="card-body gap-3">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                    {Icon && <Icon className="w-5 h-5 text-primary" />}
                  </div>
                  <h3 className="card-title text-base-content text-lg">
                    {featureTitle}
                  </h3>
                  <p className="text-base-content/60 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>

        {children}
      </div>
    </section>
  );
}
