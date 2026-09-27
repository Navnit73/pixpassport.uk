import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Preview & Biometric Verification Result",
  description:
    "Preview and download your verified passport photo result and printable sheet.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
