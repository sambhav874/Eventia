"use client";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
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
  // Use RefObject<HTMLBodyElement> instead of HTMLElement
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0); // State to track scroll position

  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (scrollContainer) {
      const locoScroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
      });

      // Assign locoScroll to the window object
      (window as any).locoScroll = locoScroll;

      // Setup ScrollTrigger
      ScrollTrigger.scrollerProxy(scrollContainer, {
        scrollTop(value) {
          if (arguments.length) {
            locoScroll.scrollTo(value, { duration: 0 });
          } else {
            return locoScroll.scroll.instance.scroll.y; // Get current scroll position from LocomotiveScroll
          }
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: scrollContainer.style.transform ? 'transform' : 'fixed',
      });

      locoScroll.on('scroll', (obj) => {
        setScrollPosition(obj.scroll.y); // Update scroll position
        ScrollTrigger.update(); // Update ScrollTrigger on scroll
      });

      // Refresh ScrollTrigger and Locomotive Scroll
      ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
      ScrollTrigger.refresh();

      // Clean up on unmount
      return () => {
        locoScroll.destroy();
        ScrollTrigger.removeEventListener('refresh', () => locoScroll.update());
      };
    }
  }, []); // Dependency array should be empty

  return (
    <LocomotiveScrollProvider
      options={{ smooth: true }}
      containerRef={containerRef}
      data-scroll-container
    >
      <ClerkProvider>
        <html lang="en">
          <body
          
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
