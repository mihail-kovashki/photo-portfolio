import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Mihail Kovashki · Fujifilm X-T5 Chronicles",
  description: "Visual stories from Hokkaido and Korea captured with the Fujifilm X-T5 & Fujinon XF 23mm F1.4.",
  openGraph: {
    title: "Mihail Kovashki · Fujifilm Photography",
    description: "Visual chronicles from Hokkaido & Korea · X-T5 & 23mm F1.4",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen bg-[#09090b] text-[#f4f4f5] film-grain selection:bg-[#d93829]/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
