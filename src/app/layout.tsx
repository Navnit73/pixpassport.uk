import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PixPassport — Free UK Passport Photos Online",
  description:
    "Create compliant UK passport photos in under 2 minutes. Free, private, and browser-based — no sign-up required. Meets HM Passport Office requirements.",
  keywords: [
    "UK passport photo",
    "passport photo online",
    "free passport photo",
    "HMPO passport photo",
    "passport photo maker",
    "UK passport photo tool",
    "print passport photo at home",
  ],
  authors: [{ name: "PixPassport" }],
  openGraph: {
    title: "PixPassport — Free UK Passport Photos Online",
    description:
      "Create compliant UK passport photos in under 2 minutes. Free, private, and browser-based.",
    type: "website",
    locale: "en_GB",
    siteName: "PixPassport",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      data-theme="pixpassport"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-base-100 text-base-content">
        {children}
      </body>
    </html>
  );
}
