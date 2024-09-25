'use client'

import { useParams } from "next/navigation";
import EventComponent from "@/components/EventComponent";
import React from "react";

const EventPage  = () => {
  const params = useParams();
  const { tag, id } = params;

  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      
      <EventComponent id={id as string} />
    </div>
  );
};

export default EventPage;