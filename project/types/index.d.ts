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