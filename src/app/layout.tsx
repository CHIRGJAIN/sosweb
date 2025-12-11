import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  display: "swap",
});

const siteName = "SANKATMOCHAN Crisis Support";
const siteDescription = "First call in crisis assistance platform for Trinix and allied responders.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.trinix-response.org"),
  title: siteName,
  description: siteDescription,
  keywords: [
    "SANKATMOCHAN",
    "Trinix",
    "crisis support",
    "emergency helpline",
    "NGO directory",
    "disaster response",
  ],
  applicationName: siteName,
  authors: [{ name: "SANKATMOCHAN Team" }],
  openGraph: {
    title: siteName,
    description: siteDescription,
    type: "website",
    url: "https://www.trinix-response.org",
    siteName,
    images: [
      {
        url: "/assets/app_logo.png",
        width: 512,
        height: 512,
        alt: "SANKATMOCHAN emblem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/assets/app_logo.png"],
  },
  alternates: {
    canonical: "https://www.trinix-response.org",
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
    <html lang="en">
      <body className={`${inter.variable} ${roboto.variable} font-body antialiased bg-[color:var(--background)]`}> 
        <Providers>
          <SiteHeader />
          <main className="bg-[color:var(--background)] pb-16">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
