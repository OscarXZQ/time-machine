import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const rajdhani = Rajdhani({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-rajdhani'
});

export const metadata: Metadata = {
  title: "ChronoVisor // Time Machine",
  description: "Advanced Temporal Displacement Simulator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${rajdhani.variable} font-sans bg-black text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
