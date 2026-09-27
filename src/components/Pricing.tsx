import { CheckCircle } from "lucide-react";

const benefits = [
  "Unlimited passport photos",
  "35 mm × 45 mm UK format",
  "High-resolution download",
  "In-browser processing",
  "No account required",
  "Print-ready 6×4″ layout",
];

export default function Pricing() {
  return (
    <section className="bg-base-100 section-padding" id="pricing">
      <div className="container-narrow">
        <div className="text-center mb-14">
          <h2 className="text-base-content mb-4">Free UK Passport Photo Maker</h2>
          <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
            No hidden fees, no subscriptions. Create a digital photo for
            passport applications at zero cost.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="card bg-base-100 border-2 border-primary card-shadow">
            <div className="card-body gap-6">
              {/* Price */}
              <div className="text-center">
                <div className="badge badge-primary mb-3">Free Forever</div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-base-content">
                    £0
                  </span>
                  <span className="text-base-content/50 text-lg">/photo</span>
                </div>
                <p className="text-base-content/60 text-sm mt-2">
                  Completely free — no payment ever required
                </p>
              </div>

              <div className="divider my-0" />

              {/* Benefits list */}
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-3 text-base-content/80 text-sm"
                  >
                    <CheckCircle className="w-4.5 h-4.5 text-success shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a href="#upload" className="btn btn-primary btn-lg w-full mt-2">
                Create Your Passport Photo — Free
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
