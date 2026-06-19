// src/components/LegalLayout.tsx
import React, { useState, useEffect } from "react";
import DashboardNavbar from "../DashboardNavbar";
import Footer from "../Footer";

interface Section {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
  children: React.ReactNode;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({
  title,
  subtitle,
  lastUpdated,
  sections,
  children,
}) => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Update active section based on scroll
      const sectionElements = sections.map((s) =>
        document.getElementById(s.id)
      );
      const currentSection = sectionElements.find((el) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      });
      if (currentSection) setActiveSection(currentSection.id);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      {/* HERO HEADER */}
      <div className="bg-linear-to-br from-blue-50 to-white border-b border-gray-200" role="region">
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <div className="inline-block bg-[#EEF4FF] text-[#1A73E8] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            Legal Documents
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            {title}
          </h1>
          <p className="text-gray-600 text-lg mb-4">{subtitle}</p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Last Updated:</span> {lastUpdated}
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR - TABLE OF CONTENTS */}
          <aside className="lg:w-72 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                📑 Table of Contents
              </h3>
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      activeSection === section.id
                        ? "bg-[#1A73E8] text-white font-semibold"
                        : "text-gray-600 hover:bg-gray-100 hover:text-[#1A73E8]"
                    }`}
                  >
                    <span className="opacity-60 mr-2">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </button>
                ))}
              </nav>

              {/* Quick contact */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Questions?</p>
                <a
                  href="mailto:adminzameen360@gmail.com"
                  className="text-sm font-semibold text-[#1A73E8] hover:underline"
                >
                     adminzameen360@gmail.com                </a>
              </div>
            </div>
          </aside>

          {/* CONTENT AREA */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
              {children}

              {/* AGREEMENT BOX AT BOTTOM */}
              <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">📌 Important:</strong> By
                  using Zameen 360, you acknowledge that you have read,
                  understood, and agreed to these terms. If you have any
                  questions, please contact us at{" "}
                  <a
                    href="mailto:adminzameen360@gmail.com"
                    className="text-[#1A73E8] font-semibold hover:underline"
                  >
                     adminzameen360@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[#1A73E8] text-white w-12 h-12 rounded-full shadow-lg hover:bg-[#1565C0] transition flex items-center justify-center z-50"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default LegalLayout;