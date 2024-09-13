import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import './../../app/globals.css'

const CarouselComponent = () => {
  return (
    <div className="relative mx-auto w-auto p-4">
      <Carousel>
        <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
          {/* Previous button */}
          <button className="bg-gray-800 text-white p-6 rounded-full shadow-lg">
            {"<"}
          </button>
        </CarouselPrevious>

        <CarouselContent className="relative">
          {/* Slide 1 */}
          <CarouselItem>
            <div className="containe relative flex items-center justify-center">
              <Image
                width={728}
                height={728}
                alt="Event planning illustration"
                src="/steve-johnson-QDyQfPRtwaU copy.jpg"
                className="rounded-md image w-full h-full object-cover transition-all duration-300 ease-in-out"
              />
              <div className="text-overlay absolute bottom-5 left-5 p-4">
                Lets see
              </div>
            </div>
          </CarouselItem>

          {/* Slide 2 */}
          <CarouselItem>
            <div className="containe relative flex items-center justify-center">
              <Image
                width={728}
                height={728}
                alt="Event planning illustration"
                src="/steve-johnson-QDyQfPRtwaU copy.jpg"
                className="rounded-md image w-full h-full object-cover transition-all duration-300 ease-in-out"
              />
              <div className="text-overlay absolute bottom-5 left-5 p-4">
                Event Planning
              </div>
            </div>
          </CarouselItem>

          {/* Add more CarouselItem components as needed */}
        </CarouselContent>

        <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
          {/* Next button */}
          <button className="bg-gray-800 text-white p-6 rounded-full shadow-lg">
            {">"}
          </button>
        </CarouselNext>
      </Carousel>
    </div>
  );
};

export default CarouselComponent;