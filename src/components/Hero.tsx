import type { ReactNode, ComponentType } from "react";
import { Camera, Upload, CheckCircle } from "lucide-react";

export interface HeroCta {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
}

export interface HeroBadge {
  text: string;
  icon?: ComponentType<{ className?: string }>;
}

export interface HeroProps {
  id?: string;
  badge?: HeroBadge;
  title?: ReactNode;
  description?: ReactNode;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  trustIndicators?: string[];
  previewDimensions?: string;
  previewChecklist?: string[];
  className?: string;
  children?: ReactNode;
}

export default function Hero({
  id = "hero",
  badge,
  title = (
    <>
      Create Your Digital Photo
      <span className="block text-primary">for Passport Online</span>
    </>
  ),
  description = (
    <>
      PixPassport is a free UK passport photo maker that lets you create a
      passport picture online in under two minutes. Upload your photo, adjust
      it to the official 35&thinsp;mm&nbsp;×&nbsp;45&thinsp;mm dimensions, and
      print your passport photo online — all from your browser, with no
      registration required.
    </>
  ),
  primaryCta = {
    label: "Upload Your Photo",
    href: "#upload",
    icon: Upload,
  },
  secondaryCta = {
    label: "See How It Works",
    href: "#how-it-works",
  },
  trustIndicators = [
    "Free to use",
    "No sign-up needed",
    "35 mm × 45 mm format",
  ],
  previewDimensions = "35 mm × 45 mm",
  previewChecklist = [
    "Correct dimensions",
    "White background",
    "Ready to print",
  ],
  className = "",
  children,
}: HeroProps) {
  const PrimaryIcon = primaryCta?.icon;
  const SecondaryIcon = secondaryCta?.icon;
  const BadgeIcon = badge?.icon;

  return (
    <section
      className={`bg-base-100 section-padding ${className}`.trim()}
      id={id}
      aria-labelledby={`${id}-heading`}
    >
      <div className="container-narrow">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Copy Column */}
          <div className="max-w-xl">
            {badge && (
              <div className="badge badge-primary badge-outline mb-4 gap-1.5 py-3 px-4 text-sm font-medium">
                {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
                {badge.text}
              </div>
            )}

            <h1 id={`${id}-heading`} className="text-base-content mb-6">
              {title}
            </h1>

            <div className="text-base-content/70 text-lg mb-8 leading-relaxed">
              {typeof description === "string" ? (
                <p>{description}</p>
              ) : (
                description
              )}
            </div>

            {/* CTAs */}
            {(primaryCta || secondaryCta) && (
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                {primaryCta && (
                  <a
                    href={primaryCta.href}
                    className="btn btn-primary btn-lg gap-2"
                  >
                    {PrimaryIcon && <PrimaryIcon className="w-5 h-5" />}
                    {primaryCta.label}
                  </a>
                )}
                {secondaryCta && (
                  <a
                    href={secondaryCta.href}
                    className="btn btn-outline btn-lg gap-2"
                  >
                    {SecondaryIcon && <SecondaryIcon className="w-5 h-5" />}
                    {secondaryCta.label}
                  </a>
                )}
              </div>
            )}

            {/* Trust Indicators */}
            {trustIndicators && trustIndicators.length > 0 && (
              <div
                className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-base-content/60"
                aria-label="Key platform guarantees"
              >
                {trustIndicators.map((item, index) => (
                  <span key={index} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    {item}
                  </span>
                ))}
              </div>
            )}

            {children}
          </div>

          {/* Visual Preview Frame */}
          <figure
            className="flex justify-center m-0"
            aria-label="UK Passport Photo Preview Simulation"
          >
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-base-200 rounded-2xl -z-10" />

              {/* Mock passport photo frame */}
              <div className="card bg-base-100 border border-base-300 p-6 w-72">
                <div className="bg-base-200 rounded-lg aspect-[35/45] flex flex-col items-center justify-center gap-3">
                  <Camera className="w-12 h-12 text-base-content/30" />
                  <span className="text-base-content/40 text-sm font-medium font-mono">
                    {previewDimensions}
                  </span>
                </div>

                {previewChecklist && previewChecklist.length > 0 && (
                  <figcaption className="mt-4 space-y-2">
                    {previewChecklist.map((check, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs text-base-content/60"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                        <span>{check}</span>
                      </div>
                    ))}
                  </figcaption>
                )}
              </div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
