import type { ReactNode } from "react";

export interface FaqItem {
  question: string;
  answer: string | ReactNode;
}

export const DEFAULT_FAQS: FaqItem[] = [
  {
    question: "What are the official UK passport photo requirements?",
    answer:
      "UK passport photos must be 35 mm wide × 45 mm tall, with a plain white or light grey background. Your face must be clearly visible with a neutral expression, mouth closed, and eyes open. The photo must be in sharp focus with no red-eye. PixPassport automatically sizes your photo to meet these requirements.",
  },
  {
    question: "How do I create a digital photo for passport renewal?",
    answer:
      "Upload a recent, well-lit photo of yourself to PixPassport. The tool will help you crop and adjust it to the official 35 mm × 45 mm dimensions. You can then download the digital photo for your passport renewal application, ready to submit online or print at home.",
  },
  {
    question: "Is PixPassport really free?",
    answer:
      "Yes, PixPassport is completely free with no hidden charges. You can create and download as many passport photos as you need without paying anything or creating an account.",
  },
  {
    question: "Are photos processed on your servers?",
    answer:
      "No. All photo processing happens entirely within your web browser. Your photos are never uploaded to any server, ensuring complete privacy. Once you close the page, no trace of your photo remains.",
  },
  {
    question: "Can I print my passport photo at home?",
    answer:
      "Absolutely. The download includes a print-ready file sized for standard 6×4 inch (10×15 cm) photo paper, which you can print at home or at any pharmacy or printing service.",
  },
  {
    question: "Will my photo be accepted by HM Passport Office?",
    answer:
      "PixPassport formats your photo to meet the official HMPO dimensional requirements. However, the quality and suitability of the original photo (lighting, expression, background) is your responsibility. We recommend following the tips provided in the upload section.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "PixPassport accepts JPEG, PNG, and WebP image files up to 10 MB in size. For best results, use a high-resolution photo with good lighting.",
  },
];

export interface FAQProps {
  id?: string;
  title?: string;
  subtitle?: string;
  items?: FaqItem[];
  defaultOpenIndex?: number;
  accordionName?: string;
  className?: string;
}

export default function FAQ({
  id = "faq",
  title = "Frequently Asked Questions",
  subtitle = "Common questions about creating your UK passport photo online.",
  items = DEFAULT_FAQS,
  defaultOpenIndex = 0,
  accordionName = "faq-accordion",
  className = "",
}: FAQProps) {
  return (
    <section
      className={`bg-base-200 section-padding ${className}`.trim()}
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <div className="container-narrow">
        <header className="text-center mb-14">
          <h2 id={`${id}-title`} className="text-base-content mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </header>

        <div className="max-w-3xl mx-auto space-y-3">
          {items.map(({ question, answer }, index) => (
            <div
              key={index}
              className="collapse collapse-arrow bg-base-100 border border-base-300"
            >
              <input
                type="radio"
                name={accordionName}
                id={`${id}-item-${index}`}
                defaultChecked={index === defaultOpenIndex}
                aria-label={question}
              />
              <div className="collapse-title font-semibold text-base-content">
                {question}
              </div>
              <div className="collapse-content text-base-content/70 text-sm leading-relaxed">
                {typeof answer === "string" ? <p>{answer}</p> : answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
