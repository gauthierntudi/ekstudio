import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import "lenis/dist/lenis.css";
import "./globals.css";

const manrope = localFont({
  variable: "--ff-manrope",
  display: "swap",
  src: [
    { path: "./fonts/Manrope-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Manrope-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Manrope-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Manrope-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Manrope-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Manrope-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
});

const monument = localFont({
  variable: "--ff-monument",
  display: "swap",
  src: [
    {
      path: "./fonts/MonumentExtended-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/MonumentExtended-Ultrabold.otf",
      weight: "800",
      style: "normal",
    },
  ],
});

const siteUrl = "https://ekstudio-cd.com";
const siteTitle = "EK STUDIO";
const siteDescription =
  "Là où l’image devient une expérience. Création digitale & motion à Kinshasa.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s · ${siteTitle}`,
  },
  description: siteDescription,
  applicationName: siteTitle,
  authors: [{ name: "EK STUDIO", url: siteUrl }],
  creator: "EK STUDIO",
  publisher: "EK STUDIO",
  keywords: [
    "EK STUDIO",
    "Kinshasa",
    "communication visuelle",
    "création de contenus",
    "identité visuelle",
    "vidéographie",
    "motion design",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${manrope.variable} ${monument.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SmoothScroll />
        <Header />
        {children}
      </body>
    </html>
  );
}
