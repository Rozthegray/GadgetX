import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 🔥 THE PREMIUM FONT
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "GadgetX | Premium Esports Hardware",
  description: "Equip to dominate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="bg-zinc-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}