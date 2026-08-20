import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { DM_Mono } from "next/font/google";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";

const geist  = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});
const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Proof of Pixel",
  description: "Collaborative pixel art canvas on Celo — every pixel costs 0.01 USDm",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} ${dmMono.variable} ${bebasNeue.variable} h-full`}>
      <body className="h-full bg-[#fdfbf7]">{children}</body>
    </html>
  );
}
