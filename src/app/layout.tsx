import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Poppins, Urbanist } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const displayFont = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const uiFont = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "BeeLearnt",
  description: "AI-ready CAPS learning journeys built for focus and momentum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable} ${uiFont.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
