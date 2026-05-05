import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0f172a" }} className="text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏡</span>
              <span className="text-xl font-bold">
                <span className="text-emerald-400">Zar </span>
                <span style={{ color: "#f59e0b" }}>Zameen</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              <span className="text-white font-semibold italic">
                "Apna Ghar Dhundein"
              </span>
              <br />
              Pakistan's most trusted real estate platform, connecting buyers,
              sellers, and renters since 2015.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-emerald-600 transition-colors text-sm"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-emerald-600 transition-colors text-sm"
                aria-label="Twitter/X"
              >
                𝕏
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-emerald-600 transition-colors text-sm"
                aria-label="Instagram"
              >
                📸
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-emerald-600 transition-colors text-sm"
                aria-label="YouTube"
              >
                ▶
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "All Properties", href: "/properties" },
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "List Your Property", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">
              Property Types
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                "Houses for Sale",
                "Apartments for Rent",
                "Commercial Properties",
                "Residential Plots",
                "Luxury Villas",
                "Office Spaces",
              ].map((type) => (
                <li key={type}>
                  <Link
                    href="/properties"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    → {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-emerald-400 shrink-0">📍</span>
                <span>
                  3rd Floor, Evacuee Trust Complex, Agha Khan Road, F-5/1,
                  Islamabad
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-400 shrink-0">📞</span>
                <span>+92 51 111 927 926</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-400 shrink-0">✉️</span>
                <span>info@zarzameen.pk</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-400 shrink-0">🕐</span>
                <span>Mon – Sat: 9:00 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© 2024 Zar Zameen. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
