"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const TagEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { tag } = useParams();
  const decodedTag = decodeURIComponent(tag as string);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/events?tag=${encodeURIComponent(decodedTag)}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [decodedTag]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-700 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/events" passHref>
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Events
          </Button>
        </Link>

        <h1 className="text-6xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
           {decodedTag} Events
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div
              className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event: any) => (
              <EventCard
                key={event._id}
                id={event._id}
                title={event.title}
                description={event.description}
                start_date={event.start_date}
                location={event.location}
                images={event.images}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-12 bg-slate-800 rounded-lg p-8">
            <h2 className="text-3xl font-semibold mb-4">No events found</h2>
            <p className="text-xl text-gray-400">
              There are currently no events tagged with "{decodedTag}".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagEventsPage;