import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pivot | Property Management Platform",
  description: "AI-powered tools for independent landlords managing 1–50 units. Maintenance triage, tenant screening, STR/LTR switching, smart lock integration, and more.",
  openGraph: {
    title: "Pivot | Property Management Platform",
    description: "AI-powered tools for independent landlords managing 1–50 units.",
    type: "website",
    url: "https://pivotpropmgt.netlify.app",
    siteName: "Pivot",
    images: [
      {
        url: "https://pivotpropmgt.netlify.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pivot Property Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pivot | Property Management Platform",
    description: "AI-powered tools for independent landlords managing 1–50 units.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy-950 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
