import type { Metadata } from "next";
import { Space_Grotesk, Syne } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
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
  icons: {
    icon: [{ url: "/img/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/img/icon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/img/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/img/icon.png",
        width: 512,
        height: 512,
        alt: "EK STUDIO",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    images: ["/img/icon.png"],
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
      className={`${spaceGrotesk.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        {children}
      </body>
    </html>
  );
}
