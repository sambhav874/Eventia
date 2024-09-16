'use client'
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useRef } from "react";
import { LocomotiveScrollProvider } from 'react-locomotive-scroll'
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";


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



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const containerRef = useRef(null)
  return (
    <LocomotiveScrollProvider
      options={{
        smooth: true,
        
      }} containerRef={containerRef}>
    <ClerkProvider>
      
      <html lang="en">
        <body  ref={containerRef}
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />

          {children}

          <Footer/>
        </body>
      </html>
      
    </ClerkProvider>
    </LocomotiveScrollProvider>
  );
}
