import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapForge - The Simplest Screenshot API for Developers",
  description:
    "Turn any URL or HTML into a pixel-perfect screenshot with one API call. PNG, JPEG, PDF. Fast, reliable, affordable.",
  openGraph: {
    title: "SnapForge - The Simplest Screenshot API",
    description: "HTML in, image out. One API call. No infrastructure headaches.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
