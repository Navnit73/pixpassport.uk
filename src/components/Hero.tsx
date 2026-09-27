import { Camera, Upload, Shield, CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-base-100 section-padding" id="hero">
      <div className="container-narrow">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div className="max-w-xl">
            <div className="badge badge-primary badge-outline mb-4 gap-1.5 py-3 px-4 text-sm font-medium">
              <Shield className="w-3.5 h-3.5" />
              UK Government Compliant
            </div>

            <h1 className="text-base-content mb-6">
              UK Passport Photos
              <span className="block text-primary">In Under 2 Minutes</span>
            </h1>

            <p className="text-base-content/70 text-lg mb-8 leading-relaxed">
              Upload your photo, adjust to the official UK passport dimensions,
              and download a print-ready file — all from your browser. No
              registration required.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#upload" className="btn btn-primary btn-lg gap-2">
                <Upload className="w-5 h-5" />
                Upload Your Photo
              </a>
              <a
                href="#how-it-works"
                className="btn btn-outline btn-lg"
              >
                See How It Works
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-base-content/60">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-success" />
                Free to use
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-success" />
                No sign-up needed
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-success" />
                HMPO compliant
              </span>
            </div>
          </div>

          {/* Visual preview */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-base-200 rounded-2xl -z-10" />

              {/* Mock passport photo frame */}
              <div className="card bg-base-100 border border-base-300 p-6 w-72">
                <div className="bg-base-200 rounded-lg aspect-[35/45] flex flex-col items-center justify-center gap-3">
                  <Camera className="w-12 h-12 text-base-content/30" />
                  <p className="text-base-content/40 text-sm font-medium">
                    35mm × 45mm
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-base-content/60">
                    <CheckCircle className="w-3.5 h-3.5 text-success" />
                    Correct dimensions
                  </div>
                  <div className="flex items-center gap-2 text-xs text-base-content/60">
                    <CheckCircle className="w-3.5 h-3.5 text-success" />
                    White background
                  </div>
                  <div className="flex items-center gap-2 text-xs text-base-content/60">
                    <CheckCircle className="w-3.5 h-3.5 text-success" />
                    Ready to print
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
