import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, FileText, MapPin, Users, Video, AlertTriangle, Globe, Instagram, Linkedin, FacebookIcon, LinkedinIcon, ShareIcon, TwitterIcon } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import EventCard from "@/components/EventCard";
import { Badge } from '../ui/badge';
import { QRCodeSVG } from 'qrcode.react';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton, WhatsappIcon } from 'react-share';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';

interface EventDetailsProps {
  id: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  time: string;
  location: string;
  images: string[];
  tags: string[];
  addedAt: string;
  creator: string;
  capacity: number;
  attendees: string[];
  duration: number;
  videos: string[];
  isPaid: boolean;
  price: number;
  organiser: string;
  rules: string[];
  specialReqs: string[];
  terms_conditions: string[];
}

interface Creator {
  website: string;
  profileLogo: string;
  linkedin: string;
  instagram: string;
  organizerType: string;
  events: string[];
  bio: string[];
  founder: string;
  organizerRef: string;
}

export default function EventComponent({ id }: EventDetailsProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizer, setOrganizer] = useState<Creator | null>(null);
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [suggestedEvents, setSuggestedEvents] = useState<Event[]>([]);

  const playVideo = (index: number) => {
    setActiveVideo(index);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get<Event[]>(`/api/events`, {
          headers: { "Content-Type": "application/json" },
          params: { id: id },
        });
        if (Array.isArray(res.data) && res.data.length > 0) {
          setEvent(res.data[0]);
        } else {
          setError("Event not found");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    const fetchOrganizerDetails = async () => {
      if (event?.creator) {
        try {
          const res = await axios.get<Creator[]>(`/api/organizers`, {
            headers: { "Content-Type": "application/json" },
            params: { id: event.creator },
          });
          if (Array.isArray(res.data) && res.data.length > 0) {
            setOrganizer(res.data[0]);
          } else {
            setError("Organizer not found");
          }
        } catch (err) {
          console.log('Error fetching the organizer details:', err);
        }
      }
    };
    fetchOrganizerDetails();
  }, [event]);

  useEffect(() => {
    const fetchSuggestedEvents = async () => {
      if (organizer?.organizerRef) {
        try {
          const res = await axios.get<Event[]>(`/api/events`, {
            headers: { "Content-Type": "application/json" },
            params: { organizerRef: organizer.organizerRef },
          });
          if (Array.isArray(res.data) && res.data.length > 0) {
            setSuggestedEvents(res.data);
          }
        } catch (err) {
          console.log('Error fetching suggested events:', err);
        }
      }
    };
    fetchSuggestedEvents();
  }, [organizer, id]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "The event link has been copied to your clipboard.",
      });
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-center py-8 text-red-500 text-xl">{error}</div>;
  if (!event) return <div className="text-center py-8 text-xl">No event found.</div>;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 md:mt-16 mt-8 space-y-16">
      <section className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">{event.title}</h1>
          <p className="text-lg text-gray-600">
          {event.description.split('').map((letter, index) => (
  <span 
    key={index} 
    className={`inline-block hover:text-blue-500 transition-colors duration-300 ${letter === ' ' ? 'mr-1' : ''}`}
  >
    {letter === ' ' ? '\u00A0' : letter}
  </span>
))}
</p>
          <div className="flex flex-wrap gap-4">
            {event.tags.map((tag, index) => (
              <Badge key={index} className="bg-blue-100 text-blue-800 hover:border hover:text-blue-600 border-white text-sm font-medium px-3 py-1 rounded-full">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center mb-2">
                <span className="text-2xl font-bold">{event.duration}</span>
              </div>
              <span className="text-sm text-gray-600">Hours</span>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center mb-2">
                <span className="text-2xl font-bold">{event.capacity}</span>
              </div>
              <span className="text-sm text-gray-600">Capacity</span>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center mb-2">
                <span className="text-2xl font-bold">{event.attendees.length}</span>
              </div>
              <span className="text-sm text-gray-600">Attendees</span>
            </div>
          </div>
          <Button size="lg" className="w-full md:w-auto hover:bg-slate-800 duration-300">
            Book tickets
          </Button>
        </div>
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
          {event.images.length > 0 && (
            <Image
              src={event.images[0]}
              alt={event.title}
              layout="fill"
              objectFit="cover"
            />
          )}
        </div>
      </section>

      <section className="bg-gray-100 text-black rounded-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold mb-6">Event Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <Calendar className="text-blue-500" size={24} />
            <div>
              <p className="font-semibold">Date</p>
              <p>{formatDate(event.start_date)} - {formatDate(event.end_date)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Clock className="text-blue-500" size={24} />
            <div>
              <p className="font-semibold">Time</p>
              <p>{event.time}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <MapPin className="text-blue-500" size={24} />
            <div>
              <p className="font-semibold">Location</p>
              <p>{event.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Users className="text-blue-500" size={24} />
            <div>
              <p className="font-semibold">Organiser</p>
              <p>{event.organiser}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DollarSign className="text-blue-500" size={24} />
            <div>
              <p className="font-semibold">Price</p>
              <p>{event.isPaid ? `Rs${event.price.toFixed(2)}` : 'Free'}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <ShareIcon className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share this event</DialogTitle>
                    <DialogDescription>
                      Share this event with your friends and colleagues.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Button variant="outline" onClick={copyToClipboard}>
                        Copy Link
                      </Button>
                    </div>
                    <FacebookShareButton url={shareUrl}>
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl}>
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <LinkedinShareButton url={shareUrl}>
                      <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                    <WhatsappShareButton url={shareUrl}>
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <QRCodeSVG value={shareUrl} size={128} />
            </div>
          </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold mb-6">Rules and Requirements</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="rules">
            <AccordionTrigger className="text-xl font-semibold">
              <div className="flex items-center">
                <AlertTriangle className="mr-2" />
                Rules
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-2">
                {event.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="requirements">
            <AccordionTrigger className="text-xl font-semibold">
              <div className="flex items-center">
                <AlertTriangle className="mr-2" />
                Special Requirements
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-2">
                {event.specialReqs.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="terms">
            <AccordionTrigger className="text-xl font-semibold">
              <div className="flex items-center">
                <FileText className="mr-2" />
                Terms and Conditions
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-2">
                {event.terms_conditions.map((term, index) => (
                  <li key={index}>{term}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-bold mb-6">Event Media</h2>
        {event.videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {event.videos.map((video, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                {activeVideo !== index ? (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <button
                      className="bg-blue-500 text-white p-3 rounded-full opacity-80 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => playVideo(index)}
                      aria-label={`Play video ${index + 1}`}
                    >
                      <Video className="w-8 h-8" />
                    </button>
                  </div>
                ) : (
                  <video
                    src={video}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    onEnded={() => setActiveVideo(null)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        {event.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {event.images.map((image, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={image}
                  alt={`Event image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {organizer && (
        <section className="space-y-6">
          <Card className="overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
            <CardContent className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={organizer.profileLogo || '/placeholder.svg?height=192&width=768'}
                  alt="Organizer background"
                  layout="fill"
                  objectFit="cover"
                  className="opacity-50"
                />
                <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-slate-900 to-transparent w-full">
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{organizer.founder}</h2>
                  <p className="text-xl text-slate-300">{organizer.organizerType}</p>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" size="sm" className="bg-slate-800 text-white hover:bg-slate-700">
                    <Globe className="mr-2 h-4 w-4" />
                    <a href={organizer.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Website
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="bg-slate-800 text-white hover:bg-slate-700">
                    <Linkedin className="mr-2 h-4 w-4" />
                    <a href={organizer.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      LinkedIn
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="bg-slate-800 text-white hover:bg-slate-700">
                    <Instagram className="mr-2 h-4 w-4" />
                    <a href={organizer.instagram}target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Instagram
                    </a>
                  </Button>
                </div>
                {organizer.bio && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">About the Organizer</h3>
                    <p className="text-slate-300 leading-relaxed">{organizer.bio}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {suggestedEvents.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">More Events by This Organizer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedEvents.map((event) => (
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
        </section>
      )}
    </div>
  );
}