import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons'; // Update with the correct icon names

import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-primary-accent3 text-primary-light">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Eventia</h2>
            <p className="text-sm">
              Transforming the way you plan and manage events. Your perfect event is just a click away.
            </p>
            <div className="flex space-x-4">
 
  <a href="https://twitter.com" className="hover:text-primary-accent1 transition-colors" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={faXTwitter} className="h-6 w-6" />
  </a>

  <a href="https://instagram.com" className="hover:text-primary-accent1 transition-colors" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
  </a>

 
  <a href="https://linkedin.com" className="hover:text-primary-accent1 transition-colors" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6" />
  </a>
</div></div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Events", "About", "Contact", "Bookings"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm hover:text-primary-accent1 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <a href="mailto:info@eventia.com" className="text-sm hover:text-primary-accent1 transition-colors">sambhav@eventia.com</a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <a href="tel:+1234567890" className="text-sm hover:text-primary-accent1 transition-colors">+919873291449</a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span className="text-sm">Delhi , India</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-4">Stay updated with our latest events and offers.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-accent2 text-primary-light placeholder-primary-light/50 border-primary-light"
              />
              <Button type="submit" className="w-full bg-primary-accent1 text-primary-accent3 hover:bg-primary-light">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm mb-4 sm:mb-0">
            © {new Date().getFullYear()} Eventia. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="/privacy-policy" className="text-sm hover:text-primary-accent1 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm hover:text-primary-accent1 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;