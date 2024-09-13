"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const SOLCard = () => {
  const waveRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    waveRef.current.forEach((wave, index) => {
      gsap.fromTo(
        wave,
        { opacity: 0.6, rotate: 0 },
        {
          rotate: 360,
          opacity: 1,
          duration: 10 + index * 5,
          ease: "linear",
          repeat: -1,
          scrollTrigger: {
            trigger: wave,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        }
      );
    });
  }, []);

  return (
    <div className="e-card playing w-full  h-full">
      <div className="image w-full"></div>

      {[...Array(3)].map((_, i) => (
        <div key={i} className="wave" ref={(el) => waveRef.current[i] = el!}></div>
      ))}

      <div className="infotop flex w-full h-full justify-center items-center flex-col">
        <Image
          className="icon my-6"
          src="/solana-sol-icon.svg"
          alt="Solana logo"
          width={100}
          height={100} 
        />
        <div className="font-geistMono text-xl font-extralight">Seamless Payments via Stripe | Solana</div>
        <div className="name">Sambhav</div>
      </div>
    </div>
  );
};

export default SOLCard;