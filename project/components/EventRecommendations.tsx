'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import EventCard from "@/components/EventCard";

interface RecommendationSystemProps {
  onEventClick: (eventId: string, tags: string[]) => void;
}

export default function RecommendationSystem({ onEventClick }: RecommendationSystemProps) {
  const [recommendations, setRecommendations] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user && user.emailAddresses && user.emailAddresses.length > 0) {
      const userEmail = user.emailAddresses[0].emailAddress;
      
      axios.post('/api/recommendations', { userEmail })
        .then(response => {
          const recommendationIds = response.data.map(rec => rec.eventId).join(',');
          return axios.get(`/api/events?eventIds=${recommendationIds}`);
        })
        .then(response => {
          setRecommendations(response.data);
        })
        .catch(error => {
          console.error('Error fetching recommendations:', error);
          if (error.response && error.response.status === 404) {
            console.log('User not found or has no recommendations');
            setRecommendations([]);
          }
        });
    }
  }, [user]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="recommendations bg-white py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Recommended Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((event: any) => (
            <EventCard 
              key={event._id}
              id={event._id}
              title={event.title}
              description={event.description}
              start_date={event.start_date}
              location={event.location}
              images={event.images}
              tag={event.tags || []}
              onClick={onEventClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}