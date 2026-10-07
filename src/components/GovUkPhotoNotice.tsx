import { Info } from "lucide-react";

export interface GovUkPhotoNoticeProps {
  className?: string;
}

/**
 * GOV.UK guidance that applies to UK passport photos, shown beside the photo maker.
 * Wording follows https://www.gov.uk/photos-for-passports (checked October 2026).
 */
export default function GovUkPhotoNotice({ className = "" }: GovUkPhotoNoticeProps) {
  return (
    <aside
      className={`bg-white border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-800 leading-relaxed ${className}`}
      aria-label="GOV.UK photo guidance"
    >
      <p className="flex items-start gap-2 font-semibold text-slate-900 mb-2">
        <Info className="w-4 h-4 text-[#4D7C0F] shrink-0 mt-0.5" aria-hidden="true" />
        Before you apply on GOV.UK
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Online applications:</strong> if you upload a photo taken on your own device,
          GOV.UK asks for your head, shoulders and upper body, and says not to crop it, because the
          service crops it for you. It also notes that photos from a booth or shop are more likely to
          be approved.
        </li>
        <li>
          <strong>Paper forms:</strong> you need 2 identical printed photos, 45 mm high by 35 mm
          wide, printed to a professional standard on plain white photographic paper.
        </li>
      </ul>
      <p className="mt-2 text-slate-600">
        PixPassport is independent and not affiliated with HM Passport Office or GOV.UK. Read the{" "}
        <a
          href="https://www.gov.uk/photos-for-passports"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline text-[#365314] hover:text-[#4D7C0F]"
        >
          official GOV.UK photo rules
          <span className="sr-only"> (opens in new window)</span>
        </a>
        .
      </p>
    </aside>
  );
}
