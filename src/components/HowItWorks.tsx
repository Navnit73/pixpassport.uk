import type { ReactNode, ComponentType } from "react";
import { Upload, Crop, Download, type LucideIcon } from "lucide-react";

export interface StepItem {
  icon?: LucideIcon | ComponentType<{ className?: string }>;
  step?: number;
  title: string;
  description: string;
}

export const DEFAULT_STEPS: StepItem[] = [
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
      "Position and crop your photo to meet the official 35 mm × 45 mm UK passport specification.",
  },
  {
    icon: Download,
    step: 3,
    title: "Download & Print",
    description:
      "Download your print-ready digital photo for passport applications or renewals, sized for home or pharmacy printing.",
  },
];

export interface HowItWorksProps {
  id?: string;
  title?: string;
  subtitle?: string;
  steps?: StepItem[];
  className?: string;
  children?: ReactNode;
}

export default function HowItWorks({
  id = "how-it-works",
  title = "How to Create a Digital Photo for Passport Renewal",
  subtitle = "Three simple steps to a print-ready UK passport photo — no appointments, no queues.",
  steps = DEFAULT_STEPS,
  className = "",
  children,
}: HowItWorksProps) {
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

        <ol className="grid md:grid-cols-3 gap-8 list-none p-0 m-0">
          {steps.map(({ icon: Icon, step, title: stepTitle, description }, index) => {
            const stepNumber = step ?? index + 1;
            return (
              <li key={stepNumber} className="flex">
                <article className="card bg-base-100 border border-base-300 card-shadow w-full">
                  <div className="card-body items-center text-center gap-4">
                    {/* Step Icon */}
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      {Icon && <Icon className="w-6 h-6 text-primary" />}
                    </div>

                    <span className="badge badge-primary badge-sm font-mono">
                      Step {stepNumber}
                    </span>

                    <h3 className="card-title text-base-content text-xl">
                      {stepTitle}
                    </h3>

                    <p className="text-base-content/60 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        {children}
      </div>
    </section>
  );
}
