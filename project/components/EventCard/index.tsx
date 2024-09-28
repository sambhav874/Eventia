import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";



const EventCard: React.FC<EventCardProps> = ({
  tag,
  id,
  title,
  description,
  start_date,
  location,
  images,
}) => {
  const router = useRouter();

  const handleBooking = () => {
    const encodedTag = Array.isArray(tag) ? encodeURIComponent(tag[0]) : encodeURIComponent(tag);
    const url = `/events/tag/${encodedTag}/${id}`;
    console.log(`Navigating to: ${url}`);
    router.push(url);
  };

  return (
    <Card className="event-card h-auto w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={images[0]}
          width={400}
          height={200}
          alt={`Event ${title}`}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <div className="flex text-muted-foreground items-center text-lg space-x-2">
          <CalendarIcon className="w-4 h-4" />
          <span>Date: {new Date(start_date).toLocaleDateString()}</span>
        </div>
        <div className="flex text-muted-foreground items-center text-lg space-x-2">
          <FontAwesomeIcon
            icon={faMapPin}
            className="text-coral text-xl mr-2"
          />
          <span>Location: {location}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="bg-primary-accent1 text-primary-accent3 hover:bg-primary-light w-full"
          onClick={handleBooking}
        >
          Book Tickets
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;