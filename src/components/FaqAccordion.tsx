import React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
  answerHtml?: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
  title?: string;
}

export default function FaqAccordion({ faqs, title }: FaqAccordionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="mt-12 pt-10 border-t border-slate-200" id="faq" aria-label="Frequently Asked Questions">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-xs font-bold text-[#365314] tracking-wide mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-[#4D7C0F]" />
          <span>GOT QUESTIONS?</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-600 text-sm sm:text-base">
          Everything you need to know about official {title || "passport photo"} requirements and specifications.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-slate-200 hover:border-slate-300 rounded-2xl bg-white transition-all overflow-hidden shadow-2xs group"
          >
            <details
              className="group/details [&_summary::-webkit-details-marker]:hidden"
              open={index === 0}
            >
              <summary className="flex items-center justify-between p-4.5 sm:p-5 cursor-pointer select-none text-left font-bold text-slate-900 text-base sm:text-lg group-hover/details:text-lime-800 focus-visible:outline-2 focus-visible:outline-lime-600 transition-colors">
                <span className="pr-4 leading-snug">{faq.question}</span>
                <span
                  className="ml-auto shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover/details:bg-lime-100 group-hover/details:text-lime-800 group-open/details:rotate-180 group-open/details:bg-[#4D7C0F] group-open/details:text-white transition-all duration-200"
                  aria-hidden="true"
                >
                  <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                </span>
              </summary>
              <div className="px-4.5 sm:px-5 pb-5 pt-3.5 text-slate-700 text-sm sm:text-base leading-relaxed border-t border-slate-100 bg-slate-50/40">
                {faq.answerHtml ? (
                  <div
                    className="[&_a]:text-[#4D7C0F] [&_a]:underline [&_a]:font-semibold [&_a:hover]:text-[#365314] [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1"
                    dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                  />
                ) : (
                  <p className="my-1.5">{faq.answer}</p>
                )}
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
