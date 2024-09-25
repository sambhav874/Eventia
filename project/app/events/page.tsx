"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, Tag as TagIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventCard from "@/components/EventCard";
import { eventsWithLogos } from "@/components/ui/logos/logos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const EventsPage  = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const tags = eventsWithLogos;
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(true);
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!selectedDate ||
          new Date(event.start_date).toDateString() ===
            selectedDate.toDateString())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, selectedDate, events]);

  const handleTagSelect = (tag) => {
    router.push(`/events/tag/${encodeURIComponent(tag)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-700 text-white">
      <div className="mx-auto px-4 py-16">
        <h1 className="mt-12 text-8xl font-bold mb-12 text-left bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 md:text-9xl">
          Discover Amazing Events
        </h1>

        <div className="mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 text-white pl-10 w-full"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full h-full">
            <div className="w-full md:w-auto">
              <Label htmlFor="date" className="text-white mb-2 block">
                Select Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full md:w-[240px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="w-full md:w-auto">
              <Label htmlFor="tag" className="text-white mb-2 block">
                Filter by Tag
              </Label>
              <Select onValueChange={handleTagSelect}>
                <SelectTrigger
                  id="tag"
                  className="bg-slate-800 text-white w-full md:w-[240px]"
                >
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((tag) => (
                    <SelectItem key={tag.name} value={tag.name}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

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
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event : any) => (
                <EventCard
                  key={event._id}
                  id={event._id}
                  title={event.title}
                  description={event.description}
                  start_date={event.start_date}
                  tag={event.tags}
                  location={event.location}
                  images={event.images}
                />
              ))}
            </div>
            {filteredEvents.length === 0 && (
              <div className="text-center mt-12 bg-slate-800 rounded-lg p-8">
                <h2 className="text-3xl font-semibold mb-4">No events found</h2>
                <p className="text-xl text-gray-400">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-slate-800 py-16 mt-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Upcoming Featured Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event : any) => (
              <EventCard
                key={event._id}
                id={event._id}
                title={event.title}
                description={event.description.substring(0, 100)}
                start_date={event.start_date}
                location={event.location}
                images={event.images}
                tag={event.tags}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
            Event Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tags.map((tag) => (
              <Button
                key={tag.name}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-slate-900 md:whitespace-normal transition-all duration-300 transform hover:scale-105"
                onClick={() => handleTagSelect(tag.name)}
              >
                <div className="flex justify-between items-center gap-2 max-w-full">
                  <FontAwesomeIcon icon={tag.logo} className="h-4 w-4 flex-shrink-0" />
                  <div className="truncate">{tag.name}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;