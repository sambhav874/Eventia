"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import HoverCard from "@/components/ui/hovCard/HoverCard";
import SOLCard from "@/components/ui/SOLCard/SOLCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FlipMeCard from "@/components/ui/FlipMeCard/FlipMeCard";
import { CalendarIcon } from "@radix-ui/react-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import { eventsWithLogos, organizerTypes } from "@/components/ui/logos/logos";
import CarouselComponent from "@/components/ui/CarouselComponent";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const introRef = useRef(null);
  const borderRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      introRef.current,
      { opacity: 1 },
      {
        opacity: 0,
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      }
    );

    const dashLength = 500;

    gsap.fromTo(
      borderRef.current,
      { strokeDashoffset: dashLength * 2 },
      {
        strokeDashoffset: 10,
        duration: 3, // Extended duration for smoother animation
        ease: "power2.inOut", // Smoother easing
        repeat: -1,
        onStart: () => {
          gsap.set(borderRef.current, {
            strokeDasharray: dashLength * 2,
          });
        },
      }
    );
  }, []);

  return (
    <div className="overflow-x-hidden text-foreground font-geist">
      <header className=" top-0 right-0 left-0 z-[201] bg-primary-accent3/80 backdrop-blur-md fixed">
        <div className=" mx-auto flex justify-evenly items-center py-4 px-6">
          <nav >
            <ul className="flex   space-x-8 gap-4">
              {["Events", "About", "Contact", "Bookings"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-3xl font-extralight text-primary-light hover:text-primary-accent1 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
                
              ))}
              
              
            </ul>
          </nav>
          <div className="flex items-center justify-center">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
              </div>
        </div>
      </header>

      <main>
        <div className=" flex bg-primary-light relative  justify-center ">
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col md:mx-12 items-center justify-center ">
              {"Eventia".split("").map((letter, index) => (
                <h1
                  key={index}
                  className="font-geist md:block hidden text-5xl text-primary-accent3 tracking-widest leading-normal font-bold"
                >
                  {letter}
                </h1>
              ))}
            </div>
          </div>

          <div className=" flex items-center bottom-0 w-full justify-center bg-primary-accent1 rounded-xl">
            <div className="flex justify-center items-center w-full m-6 flex-col gap-4">
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="col-span-2">
                  <FlipMeCard />
                </div>
                <HoverCard />

                <div className="row-span-2 ">
                  <div className="mb-4">
                    <Card className="w-full h-60 bg-slate-950 text-primary-light">
                      <CardHeader>
                        <CardTitle className="text-2xl text-center">
                          Weather
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center justify-center h-full"></CardContent>
                    </Card>
                  </div>
                  <HoverCard />
                </div>
                <div className="col-span-2 w-full row-span-2">
                  <SOLCard />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen bg-primary-accent3 py-20">
          <div className="max-w-4xl px-6 mb-12">
            <h2
              ref={introRef}
              className="font-geist text-3xl text-gray-500 text-center leading-relaxed"
            >
              {"Transform the way you plan and manage events. Sign up now to experience the future of event management with Eventia. Your perfect event is just a click away."
                .split("")
                .map((letter, index) => (
                  <span
                    key={index}
                    className={`letter cursor-pointer hover:text-primary-light`}
                  >
                    {letter}
                  </span>
                ))}
            </h2>
          </div>

          <CarouselComponent />
        </div>

        <section className="hero-section bg-primary py-20">
          <div className="container mx-auto text-center text-primary-foreground px-6">
            <h2 className="text-5xl font-bold mb-6 text-primary-light">
              Discover Amazing Events
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-light">
              Explore a wide range of events, from concerts and festivals to
              conferences and workshops. Book your tickets now for unforgettable
              experiences.
            </p>
            <Button className="bg-primary-accent1 text-primary-accent3 hover:bg-primary-accent2 hover:text-primary-light transition-colors text-lg px-8 py-3 rounded-full font-semibold">
              Explore Events
            </Button>
          </div>
        </section>

        <section className="featured bg-amber-600 py-20 h-full">
          <div className="flex mx-auto px-6 flex-col  justify-center w-full">
            <div className="text-center">
              <h1 className="font-bold font-mono text-6xl leading-8 tracking-wider text-black mb-20">
                Featured Events
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((event) => (
                <Card key={event} className="event-card">
                  <CardHeader>
                    <CardTitle>Event {event}</CardTitle>
                    <CardDescription>
                      Event description goes here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src="/event-image.jpg"
                      width={400}
                      height={200}
                      alt={`Event ${event}`}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <div className="flex text-muted-foreground items-center text-lg space-x-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Date: DD/MM/YYYY</span>
                    </div>
                    <div className="flex text-muted-foreground items-center text-lg space-x-2">
                      <FontAwesomeIcon
                        icon={faMapPin}
                        className="text-coral text-xl mr-2"
                      />
                      <span>Location: Venue Name</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-primary-accent1 text-primary-accent3 hover:bg-primary-light w-full">
                      Book Tickets
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="events-organisers bg-white py-20 h-full">
          <div className="flex mx-auto px-6 flex-col justify-center w-full">
            <div className="text-center mb-20">
              <h1 className="font-bold font-mono text-6xl leading-8 tracking-wider text-black">
                Events
              </h1>
            </div>
            <div>
              <div className="flex flex-nowrap whitespace-nowrap space-x-4 animate-marquee">
                {eventsWithLogos.map((event) => (
                  <div
                    key={event.name}
                    className="event-card flex flex-row items-center p-4 "
                  >
                    <FontAwesomeIcon
                      icon={event.logo}
                      className="w-12 h-12 mr-4"
                    />
                    <h2 className="text-xl font-extralight font-geistMono">
                      {event.name}
                    </h2>
                  </div>
                ))}
              </div>

              <div className="border shadow-lg my-6"></div>
              <div>
                <div className="flex flex-nowrap whitespace-nowrap space-x-4 animate-marquee2">
                  {organizerTypes.map((event) => (
                    <div
                      key={event.name}
                      className="event-card flex flex-row items-center p-4 "
                    >
                      <FontAwesomeIcon
                        icon={event.symbol}
                        className="w-12 h-12 mr-4"
                      />
                      <h2 className="text-xl font-extralight font-geistMono">
                        {event.name}
                      </h2>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-20">
                  <h1 className="font-bold font-mono text-6xl leading-8 tracking-wider text-black">
                    Organisers
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
