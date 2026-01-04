import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">N1</div>
              <div>
                <h3 className="font-bold text-white">Number1 Motors</h3>
                <p className="text-xs text-gray-400">Premium Vehicle Dealer</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Your trusted partner for quality vehicles. Browse our extensive collection today.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/vehicles" className="hover:text-red-400 transition-colors">
                  All Vehicles
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-red-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-red-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-red-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white mb-4">Browse by Brand</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/vehicles/ford" className="hover:text-red-400 transition-colors">
                  Ford Vehicles
                </Link>
              </li>
              <li>
                <Link href="/vehicles/toyota" className="hover:text-red-400 transition-colors">
                  Toyota Vehicles
                </Link>
              </li>
              <li>
                <Link href="/vehicles/nissan" className="hover:text-red-400 transition-colors">
                  Nissan Vehicles
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.058.319.105.643.105.973 0 3.863 3.137 7 7 7s7-3.137 7-7c0-.33.047-.654.105-.973l-1.548-.773a1 1 0 01-.54-1.06l.74-4.435A1 1 0 0116.847 3h2.153a1 1 0 011 1v12a2 2 0 01-2 2H4a2 2 0 01-2-2V3z" />
                </svg>
                <span>+64 (0)9 000 0000</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>info@number1motors.co.nz</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Auckland, New Zealand</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="text-center sm:text-left">
              <p>&copy; {currentYear} Number1 Motors. All rights reserved.</p>
            </div>
            <div className="flex justify-center sm:justify-end gap-6">
              <Link href="/#privacy" className="hover:text-red-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/#terms" className="hover:text-red-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
