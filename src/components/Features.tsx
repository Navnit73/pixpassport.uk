import {
  Ruler,
  Shield,
  Printer,
  Zap,
  Lock,
  Smartphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
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

export default function Features() {
  return (
    <section className="bg-base-200 section-padding" id="features">
      <div className="container-narrow">
        <div className="text-center mb-14">
          <h2 className="text-base-content mb-4">
            Why Use PixPassport as Your UK Passport Photo Maker?
          </h2>
          <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
            Everything you need to create a digital photo for passport
            applications — fast, private, and completely free.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="card bg-base-100 border border-base-300 card-shadow"
            >
              <div className="card-body gap-3">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="card-title text-base-content text-lg">
                  {title}
                </h3>
                <p className="text-base-content/60 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
