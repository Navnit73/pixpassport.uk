"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What are the official UK passport photo requirements?",
    answer:
      "UK passport photos must be 35mm wide × 45mm tall, with a plain white or light grey background. Your face must be clearly visible with a neutral expression, mouth closed, and eyes open. The photo must be in sharp focus with no red-eye. PixPassport automatically sizes your photo to meet these requirements.",
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
    question: "Can I print the photos at home?",
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

export default function FAQ() {
  return (
    <section className="bg-base-200 section-padding" id="faq">
      <div className="container-narrow">
        <div className="text-center mb-14">
          <h2 className="text-base-content mb-4">Frequently Asked Questions</h2>
          <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
            Everything you need to know about creating your UK passport photo.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map(({ question, answer }, index) => (
            <div
              key={index}
              className="collapse collapse-arrow bg-base-100 border border-base-300"
            >
              <input
                type="radio"
                name="faq-accordion"
                id={`faq-${index}`}
                defaultChecked={index === 0}
              />
              <div className="collapse-title font-semibold text-base-content">
                {question}
              </div>
              <div className="collapse-content text-base-content/70 text-sm leading-relaxed">
                <p>{answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
