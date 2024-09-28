"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import localFont from "next/font/local";
import "./globals.css";

// Load custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const containerRef = useRef(null);

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
            async
            defer
          ></script>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          
            <Navbar />
            <main data-scroll-container ref={containerRef}>
              {children}
            </main>
            <Footer />
          
        </body>
      </html>
    </ClerkProvider>
  );
}