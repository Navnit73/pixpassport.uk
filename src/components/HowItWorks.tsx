import { Upload, Crop, Download } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  step: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: Upload,
    step: 1,
    title: "Upload",
    description:
      "Upload a high-quality photo taken against a plain background. JPEG, PNG, or WebP accepted.",
  },
  {
    icon: Crop,
    step: 2,
    title: "Adjust",
    description:
      "Position and crop your photo to meet the official 35mm × 45mm UK passport specification.",
  },
  {
    icon: Download,
    step: 3,
    title: "Download",
    description:
      "Download your print-ready passport photo file, perfectly sized for at-home or pharmacy printing.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-base-100 section-padding" id="how-it-works">
      <div className="container-narrow">
        <div className="text-center mb-14">
          <h2 className="text-base-content mb-4">How It Works</h2>
          <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
            Three simple steps to a compliant UK passport photo — no
            appointments, no queues.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(({ icon: Icon, step, title, description }) => (
            <div key={step} className="card bg-base-100 border border-base-300 card-shadow">
              <div className="card-body items-center text-center gap-4">
                {/* Step number badge */}
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>

                <div className="badge badge-primary badge-sm font-mono">
                  Step {step}
                </div>

                <h3 className="card-title text-base-content text-xl">
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
