import type { Metadata } from "next";
import { Poppins, Urbanist } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const displayFont = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const bodyFont = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "BeeLearnt",
  description: "AI-ready CAPS learning journeys built for focus and momentum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
