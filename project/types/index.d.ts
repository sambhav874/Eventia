declare global {
  interface Window {
    locoScroll: any; 
  }
}

export {};

interface ImageUploaderProps {
    onChange: (images: File[]) => void;
    value: string[];
  }

  interface VideoUploaderProps {
    onChange: (videos: string[]) => void;
    value: string[];
  }


  interface EventCardProps {
    tag: string[] | string ,
    id: string;
    title: string;
    description: string;
    start_date: Date;
    location: string;
    images: string[];
    onClick?: () => void;
  }


  interface EventDetailsProps{
    id: string;
  }

  interface OrganizerInfo {
    email: string;
    name: string;
    phoneNumber: string;
    username: string;
    website?: string;
    linkedin?: string;
    instagram?: string;
    organizerType: string;
    organizerRef?: mongoose.Types.ObjectId;
    profileLogo?: string;
    events?: mongoose.Types.ObjectId[];
    bio?:[];
    founder?:[]
  }

  interface UserInfo {
    email: string;
    username : string;
    name: string;
    phoneNumber: string;
    dob?: Date;
    gender?: string;
    address?: string;
    website?: string;
    linkedin?: string;
    instagram?: string;
    userRef?: mongoose.Types.ObjectId;
    profilePicture?: string
  }
interface UserTagInteraction extends Document {
  userEmail: string;
  tagCounts: Record<string, number>;
  lastUpdated: Date;
}


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
  