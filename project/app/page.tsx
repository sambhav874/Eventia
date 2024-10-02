"use client";

import { useEffect, useRef, useState } from "react";
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

import axios from 'axios';
import EventCard from "@/components/EventCard";
import { useLocomotiveScroll } from 'react-locomotive-scroll';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { io, Socket } from 'socket.io-client';
import { useUser } from '@clerk/nextjs';
import RecommendationSystem from "@/components/EventRecommendations";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const introRef = useRef(null);
  const borderRef = useRef(null);
  const [events, setEvents] = useState([]);
  const { scroll } = useLocomotiveScroll();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<{ email: string; socketId: string }[]>([]);
  const { user } = useUser();
 

  useEffect(() => {
    axios
      .get('/api/events', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setEvents(response.data);
        console.log(response.data); 
      })
      .catch((error) => {
        console.error('Error fetching events:', error); 
      });
  }, []);

  useEffect(() => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    newSocket.on('get-users', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user && socket && user.emailAddresses && user.emailAddresses.length > 0) {
      const userEmail = user.emailAddresses[0].emailAddress;
      socket.emit('new-user-add', userEmail);
      console.log("User email emitted:", userEmail);
    }
  }, [socket, user]);

  

  const handleEventClick = (eventId: string, tags: string[]) => {
    const storedTagCounts = localStorage.getItem('tagCounts');
    let tagCounts = storedTagCounts ? JSON.parse(storedTagCounts) : {};

    let newInteractions: Record<string, number> = {};

    tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      newInteractions[tag] = 1;
    });

    localStorage.setItem('tagCounts', JSON.stringify(tagCounts));

    if (user && user.emailAddresses && user.emailAddresses.length > 0) {
      const userEmail = user.emailAddresses[0].emailAddress;
      axios.post('/api/user-tags', { email: userEmail, tagCounts: newInteractions })
        .then(response => console.log('Tag counts updated on server'))
        .catch(error => console.error('Error updating tag counts on server:', error));
    }

    console.log(`Event clicked: ${eventId}, Tags: ${tags.join(', ')}`);
  };

  return (
    <div className="overflow-x-hidden text-foreground font-geist min-h-screen">
      <main data-scroll-section>
        <div className="flex flex-col lg:flex-row bg-primary-light relative justify-center min-h-screen pt-20 lg:pt-0">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="flex flex-col items-center justify-center">
              {'Eventia'.toUpperCase().split('').map((letter, index) => (
                <h1 key={index} className="font-geist text-3xl sm:text-4xl md:text-5xl text-primary-accent3 tracking-widest leading-normal font-bold">
                  {letter}
                </h1>
              ))}
            </div>
          </div>
          
          <div className="flex items-center w-full justify-center bg-primary-accent1 rounded-xl p-4 lg:p-8">
            <div className="flex justify-center items-center w-full flex-col gap-4 mt-10 sm:mt-0 md:mt-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full">
                <div className="col-span-1 sm:col-span-2 lg:col-span-2 h-[300px] sm:h-[1080px] md:h-[800px] lg:h-[750px]">
                  <FlipMeCard />
                </div>
                <div className="h-full flex flex-col gap-4">
                  <div className="flex-1 h-1/2">
                    <HoverCard />
                  </div>
                  <div className="flex-1 h-1/2">
                    <Card className="w-full h-full bg-slate-950 text-primary-light">
                      <CardHeader>
                        <CardTitle className="text-2xl text-center">Weather</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 lg:col-span-1 h-[300px] sm:h-full md:h-full">
                  <HoverCard />
                </div>
                <div className="col-span-2 h-[475px] sm:h-[1080px] md:h-[800px] lg:h-[750px]">
                  <SOLCard />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary-accent3 py-20 px-4">
          <div className="max-w-4xl mb-12">
            <h2 ref={introRef} className="font-geist text-xl sm:text-2xl md:text-3xl text-gray-500 text-center leading-relaxed">
              {'Transform the way you plan and manage events. Sign up now to experience the future of event management with Eventia. Your perfect event is just a click away.'
                .split('').map((letter, index) => (
                  <span key={index} className="letter hover:text-primary-light transition-colors duration-300">
                    {letter}
                  </span>
                ))}
            </h2>
          </div>
          
          <CarouselComponent />
        </div>

        <section className="hero-section bg-primary py-20 px-4">
          <div className="container mx-auto text-center text-primary-foreground">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-primary-light">Discover Amazing Events</h2>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-primary-light">
              Explore a wide range of events, from concerts and festivals to conferences and workshops. Book your tickets now for unforgettable experiences.
            </p>
            <Button className="bg-primary-accent1 text-primary-accent3 hover:bg-primary-accent2 hover:text-primary-light transition-colors text-lg px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold">
              Explore Events
            </Button>
          </div>
        </section>

        <section className="featured bg-amber-600 py-20 px-4 min-h-screen">
          <div className="mx-auto flex flex-col justify-center">
            <div className="text-center">
              <h1 className="font-bold font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-wider text-black mb-12 sm:mb-20">
                Featured Events
              </h1>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event: any) => (
                <EventCard 
                  key={event._id} 
                  id={event._id} 
                  title={event.title} 
                  description={event.description} 
                  start_date={event.start_date} 
                  location={event.location} 
                  images={event.images}
                  tag={event.tags || []}
                  onClick={handleEventClick}
                />     
              ))}
            </div>
          </div>
        </section>

        <section className="events-organisers bg-white py-28 px-4">
          <div className="mx-auto flex flex-col justify-center">
            <div className="text-center mb-12 sm:mb-20">
              <h1 className="font-bold font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-wider text-black">
                Events
              </h1>
            </div>
            <div className="">
              <div className="flex flex-nowrap whitespace-nowrap space-x-4 animate-marquee">
                {eventsWithLogos.map((event) => (
                  <div key={event.name} className="event-card flex flex-row items-center p-4">
                    <FontAwesomeIcon icon={event.logo} className="w-8 h-8 sm:w-20 sm:h-20 mr-2 sm:mr-12 hover:text-black duration-300" />
                    <h2 className="text-4xl font-extralight font-geistMono hover:text-black duration-300">{event.name}</h2>
                  </div>
                ))}
              </div>

              <div className="border shadow-lg my-6"></div>

              <div className="flex flex-nowrap whitespace-nowrap space-x-4 animate-marquee2">
                {organizerTypes.map((event) => (
                  <div key={event.name} className="event-card flex flex-row items-center p-4">
                    <FontAwesomeIcon icon={event.symbol} className="w-20 h-20 mr-2 sm:mr-12 duration-300 hover:text-black" />
                    <h2 className="text-4xl font-extralight font-geistMono hover:text-black duration-300">{event.name}</h2>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-12 sm:mt-20">
              <h1 className="font-bold font-mono text-4xl leading-tight tracking-wider text-black">
                Organisers
              </h1>
            </div>
          </div>
        </section>
        
        <section className="online-users bg-gray-100 py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Online Users</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {onlineUsers.map((user) => (
                <div key={user.socketId} className="bg-white text-black p-4 rounded-lg shadow">
                  <p className="font-semibold">{user.email}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <RecommendationSystem onEventClick={handleEventClick} />
      </main>
    </div>
  );
}