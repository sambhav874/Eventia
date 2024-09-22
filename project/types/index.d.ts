interface ImageUploaderProps {
    onChange: (images: File[]) => void;
    value: string[];
  }

  interface VideoUploaderProps {
    onChange: (videos: string[]) => void;
    value: string[];
  }


  interface EventCardProps {
    id: string;
    title: string;
    description: string;
    start_date: Date;
    location: string;
    images: string[];
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
    profileLogo?: string
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