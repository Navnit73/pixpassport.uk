import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const getMetadataBase = (): URL => {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) {
    try {
      const formatted =
        envUrl.startsWith("http://") || envUrl.startsWith("https://")
          ? envUrl
          : `https://${envUrl}`;
      return new URL(formatted);
    } catch {
      // Fall back to default if invalid URL
    }
  }
  return new URL("https://pixpassport.uk");
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL &&
  (process.env.NEXT_PUBLIC_SITE_URL.startsWith("http://") ||
    process.env.NEXT_PUBLIC_SITE_URL.startsWith("https://"))
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "https://pixpassport.uk";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4D7C0F",
};

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),

  title: {
    default: "UK Passport Photo Online — Digital & Printed | PixPassport",
    template: "%s | PixPassport",
  },

  description:
    "Make a UK passport photo online for GOV.UK applications and renewals. Upload a phone photo, check it against HMPO guidance and download for £7.99.",

  authors: [{ name: "PixPassport", url: SITE_URL }],

  creator: "PixPassport",
  publisher: "PixPassport",

  // Canonical is set per page. A canonical here would be inherited by every
  // route that does not define its own and point it at the homepage.

  openGraph: {
    siteName: "PixPassport",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/pixpassport.jpg",
        width: 640,
        height: 640,
        alt: "PixPassport — UK passport photo maker",
      },
    ],
  },

  twitter: {
    card: "summary",
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

  // Required by CLAUDE.md. Google ignores these; the .uk ccTLD, en-GB content
  // and GBP pricing are the signals that matter for UK targeting.
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
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-full flex flex-col bg-base-100 text-base-content">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        {children}

        {/* Microsoft Clarity - deferred until browser is idle */}
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "yp9kxj7sje");
          `}
        </Script>

        {/* Google tag (gtag.js) - deferred until browser is idle */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4GEQP58E5C"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-4GEQP58E5C');
          `}
        </Script>
      </body>
    </html>
  );
}
