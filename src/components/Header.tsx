"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🏡</span>
            <span className="text-xl font-bold">
              <span style={{ color: "#059669" }}>Zar </span>
              <span style={{ color: "#f59e0b" }}>Zameen</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/properties"
              className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
            >
              Properties
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#059669" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#047857")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#059669")
              }
            >
              List Property
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-current mb-1"></div>
            <div className="w-5 h-0.5 bg-current mb-1"></div>
            <div className="w-5 h-0.5 bg-current"></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-emerald-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/properties"
                className="text-sm font-medium text-gray-700 hover:text-emerald-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Properties
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-gray-700 hover:text-emerald-600"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-gray-700 hover:text-emerald-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/contact"
                className="w-full text-center px-5 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: "#059669" }}
                onClick={() => setIsMenuOpen(false)}
              >
                List Property
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
