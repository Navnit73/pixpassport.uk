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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixpassport.uk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "Digital Photo for Passport — Create Passport Picture Online | PixPassport",
    template: "%s | PixPassport",
  },

  description:
    "Create a digital photo for passport applications and renewals online. PixPassport is an official UK passport photo maker — upload, adjust, and download HMPO-compliant passport photos for £7.99.",

  keywords: [
    "digital photo for passport",
    "create passport picture online",
    "digital photo for passport renewal",
    "print passport photo online",
    "UK passport photo maker",
    "HMPO passport photo £7.99",
  ],

  icons: {
    icon: [
      { url: "/pixpassport.jpg", type: "image/jpeg" },
    ],
    shortcut: ["/pixpassport.jpg"],
    apple: [
      { url: "/pixpassport.jpg", sizes: "180x180", type: "image/jpeg" },
    ],
  },

  authors: [{ name: "PixPassport", url: SITE_URL }],

  creator: "PixPassport",
  publisher: "PixPassport",

  alternates: {
    canonical: "/",
    languages: {
      "en-GB": "/",
    },
  },

  openGraph: {
    title:
      "Digital Photo for Passport — Create Passport Picture Online | PixPassport",
    description:
      "Create a digital photo for passport applications and renewals online. Official UK biometric passport photo maker for £7.99.",
    url: SITE_URL,
    siteName: "PixPassport",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/pixpassport.jpg",
        width: 1200,
        height: 630,
        alt: "PixPassport — Official UK Passport Photo Maker",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Digital Photo for Passport — UK Passport Photo Maker | PixPassport",
    description:
      "Create a digital photo for passport applications and renewals. Official, private, HMPO-compliant UK passport photo maker for £7.99.",
    images: ["/pixpassport.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
    "content-language": "en-GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
