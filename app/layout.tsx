import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🎃 Fiesta de Halloween 2025",
  description: "¡Únete a la noche más espeluznante del año! Confirma tu asistencia a nuestra fiesta de Halloween.",
  keywords: ["halloween", "fiesta", "2025", "disfraz", "terror", "diversión"],
  authors: [{ name: "Halloween" }],
  
  // Open Graph para redes sociales (WhatsApp, Facebook, etc.)
  openGraph: {
    title: "🎃 Fiesta de Halloween 2025",
    description: "¡Únete a la noche más espeluznante del año! Confirma tu asistencia a nuestra fiesta de Halloween.",
    type: "website",
    locale: "es_ES",
    url: "https://halloween-smoky.vercel.app", 
    siteName: "Halloween 2025",
    images: [
      {
        url: "/site.png",
        width: 1200,
        height: 630,
        alt: "Fiesta de Halloween 2025 - Confirma tu asistencia",
      },
    ],
  },
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
