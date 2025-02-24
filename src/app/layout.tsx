import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className="absolute -inset-1 -z-50 bg-gradient-to-b from-blue-700 to-transparent opacity-15 mr-1"></div>
        <div className="flex-grow">
          <Navigation />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

export const metadata = {
  title: "Matthew M. Osborn",
  description: "Matthew M. Osborn's personal website.",
} as Metadata;

