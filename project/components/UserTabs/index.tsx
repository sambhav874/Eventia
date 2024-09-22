'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const UserTabs = () => {
    const pathname = usePathname();

    return (
        <div className="tabs flex flex-row gap-4 space-x-4">
            <div>
                <Button 
                    className={`duration-300 ${pathname === '/profile' ? 'bg-white text-black' : 'bg-slate-900 text-white hover:bg-white hover:text-black'}`}>
                    <Link href={'/profile'}>Profile</Link>
                </Button>
            </div>
            <div>
                <Button 
                    className={`duration-300 ${pathname === '/my-payments' ? 'bg-white text-black' : 'bg-slate-900 text-white hover:bg-white hover:text-black'}`}>
                    <Link href={'/my-payments'}>My Payments</Link>
                </Button>
            </div>
            <div>
                <Button 
                    className={`duration-300 ${pathname === '/my-bookings' ? 'bg-white text-black' : 'bg-slate-900 text-white hover:bg-white hover:text-black'}`}>
                    <Link href={'/my-bookings'}>My Bookings</Link>
                </Button>
            </div>
        </div>
    );
}

export default UserTabs;