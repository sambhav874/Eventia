"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { LocomotiveScrollProvider } from 'react-locomotive-scroll';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import LocomotiveScroll from "locomotive-scroll";

gsap.registerPlugin(ScrollTrigger);

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
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    if (scrollContainer) {
      const locoScroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
      });

      // Assign locoScroll to the window object
      window.locoScroll = locoScroll;

      // Setup ScrollTrigger
      locoScroll.on('scroll', ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(scrollContainer, {
        scrollTop(value) {
          return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: scrollContainer.style.transform ? 'transform' : 'fixed',
      });

      // Refresh ScrollTrigger and Locomotive Scroll
      ScrollTrigger.addEventListener('refresh', () => window.locoScroll.update());
      ScrollTrigger.refresh();

      // Clean up on unmount
      return () => {
        if (locoScroll) locoScroll.destroy();
        ScrollTrigger.removeEventListener('refresh', () => window.locoScroll.update());
      };
    }
  }, []);

  return (
    <LocomotiveScrollProvider
      options={{ smooth: true }}
      containerRef={containerRef}
    >
      <ClerkProvider>
        <html lang="en">
          <body
            ref={containerRef}
            data-scroll-container
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Navbar />
            {children}
            <Footer />
          </body>
        </html>
      </ClerkProvider>
    </LocomotiveScrollProvider>
  );
}