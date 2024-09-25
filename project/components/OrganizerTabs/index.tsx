'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const OrganizerTabs = () => {
    const pathname = usePathname();

    return (
        <div className="tabs flex flex-row gap-4 space-x-4 flex-wrap">
            <div>
                <Button 
                    className={`duration-300 ${pathname === '/profile' ? 'bg-white text-black' : 'bg-slate-900 text-white hover:bg-white hover:text-black'}`}>
                    <Link href={'/profile'}>Profile</Link>
                </Button>
            </div>
            <div>
                <Button 
                    className={`duration-300 ${pathname === '/my-payments' ? 'bg-white text-black' : 'bg-slate-900 text-white hover:bg-white hover:text-black'}`}>
                    <Link href={'/my-payments'}>Event Attendees</Link>
                </Button>
            </div>
            <div>
                <Button 
                    className={`duration-300 ${pathname === '/my-bookings' ? 'bg-white text-black' : 'bg-slate-900 text-white hover:bg-white hover:text-black'}`}>
                    <Link href={'/my-bookings'}>My Events</Link>
                </Button>
            </div>
            <div>
                <Button 
                    className={`duration-300 ${pathname === '/my-bookings' ? 'bg-white text-black' : 'bg-slate-900 text-white hover:bg-white hover:text-black'}`}>
                    <Link href={'/new-event'}>New Event</Link>
                </Button>
            </div>
            <div>
                <Button 
                    className={`duration-300 ${pathname === '/my-bookings' ? 'bg-white text-black' : 'bg-slate-900 text-white hover:bg-white hover:text-black'}`}>
                    <Link href={'/my-bookings'}>Event Updates</Link>
                </Button>
            </div>
        </div>
    );
}

export default OrganizerTabs;