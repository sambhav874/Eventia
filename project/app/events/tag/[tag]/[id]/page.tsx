'use client'

import React, { useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLocomotiveScroll } from "react-locomotive-scroll";
import EventComponent from "@/components/EventComponent";

const EventPage = () => {
  const params = useParams();
  const { tag, id } = params;
  const containerRef = useRef(null);
  const { scroll } = useLocomotiveScroll();

  useEffect(() => {
    if (scroll) {
      // Ensure Locomotive Scroll is updated when the component mounts
      scroll.update();

      // Optional: Scroll to top when the page loads
      scroll.scrollTo(0, { duration: 0, disableLerp: true });
    }
  }, [scroll]);

  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <main data-scroll-container ref={containerRef}>
      <div className="container mx-auto px-4 py-8" data-scroll-section>
        <EventComponent id={id as string} />
      </div>
    </main>
  );
};

export default EventPage;