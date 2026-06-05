// src/features/marketplace/pages/TermsOfService.tsx
import React, { useState, useEffect } from "react";

const TermsOfService: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );
  const [heroVisible, setHeroVisible] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    document.querySelectorAll(".reveal-section").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sections = [
    {
      number: "01",
      id: "acceptance",
      title: "Acceptance of Terms",
      content: (
        <>
          <p>
            By accessing or using Zameen 360, you agree to be bound by these
            Terms of Service. If you do not agree to these Terms, please do not
            use our services.
          </p>
          <p>
            You must be at least 18 years old to use Zameen 360. By using our
            platform, you represent and warrant that you meet this requirement.
          </p>
        </>
      ),
    },
    {
      number: "02",
      id: "definitions",
      title: "Definitions",
      content: (
        <ul className="space-y-3 list-none">
          <li className="pl-6 border-l-2 border-blue-200 hover:border-[#1A73E8] transition-all duration-300">
            <strong className="text-gray-900">Platform</strong> — The Zameen 360
            website, mobile apps, and all related services.
          </li>
          <li className="pl-6 border-l-2 border-blue-200 hover:border-[#1A73E8] transition-all duration-300">
            <strong className="text-gray-900">User</strong> — Any individual or
            entity using our platform.
          </li>
          <li className="pl-6 border-l-2 border-blue-200 hover:border-[#1A73E8] transition-all duration-300">
            <strong className="text-gray-900">Listing</strong> — Any property
            advertisement posted on our platform.
          </li>
          <li className="pl-6 border-l-2 border-blue-200 hover:border-[#1A73E8] transition-all duration-300">
            <strong className="text-gray-900">Seller</strong> — Users who list
            properties for sale or rent.
          </li>
          <li className="pl-6 border-l-2 border-blue-200 hover:border-[#1A73E8] transition-all duration-300">
            <strong className="text-gray-900">Buyer</strong> — Users searching
            for properties to buy or rent.
          </li>
        </ul>
      ),
    },
    {
      number: "03",
      id: "eligibility",
      title: "Eligibility Requirements",
      content: (
        <>
          <p>To use Zameen 360, you must meet the following requirements:</p>
          <ul className="mt-4 space-y-2 list-disc pl-6 marker:text-[#1A73E8]">
            <li>Be at least 18 years of age</li>
            <li>Have legal capacity to enter into binding contracts</li>
            <li>Not be barred from using services under applicable laws</li>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
          </ul>
        </>
      ),
    },
    {
      number: "04",
      id: "account",
      title: "User Accounts",
      content: (
        <>
          <h4 className="font-bold text-gray-900 text-lg mb-2">
            Account Registration
          </h4>
          <p className="mb-5">
            To access certain features, you must create an account. You agree
            to provide accurate, current, and complete information during
            registration.
          </p>

          <h4 className="font-bold text-gray-900 text-lg mb-2">
            Account Security
          </h4>
          <p>You are responsible for:</p>
          <ul className="mt-3 space-y-2 list-disc pl-6 marker:text-[#1A73E8]">
            <li>Maintaining the confidentiality of your password</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized access</li>
            <li>Ensuring your account information remains up to date</li>
          </ul>
        </>
      ),
    },
    {
      number: "05",
      id: "listings",
      title: "Property Listings",
      content: (
        <>
          <h4 className="font-bold text-gray-900 text-lg mb-2">
            Listing Requirements
          </h4>
          <p>When posting a property listing, you must:</p>
          <ul className="mt-3 mb-6 space-y-2 list-disc pl-6 marker:text-[#1A73E8]">
            <li>Provide accurate property information</li>
            <li>Use only authentic photographs of the property</li>
            <li>Have legal authority to list the property</li>
            <li>Set realistic and fair pricing</li>
            <li>Respond to inquiries promptly</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-[#1A73E8] p-5 rounded-r-lg my-4 transition-all duration-300 hover:bg-blue-100">
            <h4 className="font-bold text-gray-900 mb-2">
              Prohibited Listings
            </h4>
            <ul className="space-y-1 list-disc pl-6 text-gray-700 marker:text-[#1A73E8]">
              <li>Fake or fraudulent properties</li>
              <li>Properties involved in illegal activities</li>
              <li>Discriminatory listings</li>
              <li>Duplicate listings</li>
              <li>Misleading information</li>
            </ul>
          </div>
        </>
      ),
    },
    {
      number: "06",
      id: "payments",
      title: "Payments and Fees",
      content: (
        <>
          <p>
            Some features of Zameen 360 require payment. By using paid
            services, you agree to:
          </p>
          <ul className="mt-3 mb-5 space-y-2 list-disc pl-6 marker:text-[#1A73E8]">
            <li>Pay all applicable fees and taxes</li>
            <li>Provide valid payment information</li>
            <li>Authorize us to charge your payment method</li>
            <li>Accept our refund policy</li>
          </ul>
          <div className="bg-blue-50 border-l-4 border-[#1A73E8] p-5 rounded-r-lg">
            <p className="text-gray-800">
              All payments are processed securely through trusted payment
              partners. We never store your full payment card details.
            </p>
          </div>
        </>
      ),
    },
    {
      number: "07",
      id: "conduct",
      title: "User Conduct",
      content: (
        <>
          <p className="mb-3">
            <strong className="text-gray-900">You agree NOT to:</strong>
          </p>
          <ul className="space-y-2 list-disc pl-6 marker:text-[#1A73E8]">
            <li>Violate any laws or regulations</li>
            <li>Post false, misleading, or fraudulent content</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Use automated systems to access the platform</li>
            <li>Attempt to bypass security measures</li>
            <li>Upload viruses or malicious code</li>
            <li>Collect user information without consent</li>
            <li>Impersonate any person or entity</li>
          </ul>
        </>
      ),
    },
    {
      number: "08",
      id: "intellectual",
      title: "Intellectual Property",
      content: (
        <>
          <p>
            All content on Zameen 360, including text, graphics, logos, images,
            and software, is the property of Zameen 360 or its content
            suppliers and is protected by copyright and intellectual property
            laws.
          </p>
          <p className="mt-3">
            You retain ownership of content you upload but grant us a
            worldwide, royalty-free license to use, display, and distribute
            your content on our platform.
          </p>
        </>
      ),
    },
    {
      number: "09",
      id: "disclaimer",
      title: "Disclaimer",
      content: (
        <>
          <p>
            Zameen 360 is a platform connecting buyers and sellers. We do not
            own, sell, or rent properties listed on our platform.
          </p>
          <p className="mt-3">
            The platform is provided{" "}
            <strong className="text-gray-900">"AS IS"</strong> without
            warranties of any kind. We do not guarantee:
          </p>
          <ul className="mt-3 space-y-2 list-disc pl-6 marker:text-[#1A73E8]">
            <li>The accuracy of property listings</li>
            <li>The reliability of users</li>
            <li>Uninterrupted service availability</li>
            <li>The quality of properties listed</li>
          </ul>
        </>
      ),
    },
    {
      number: "10",
      id: "liability",
      title: "Limitation of Liability",
      content: (
        <>
          <p>
            To the maximum extent permitted by law, Zameen 360 shall not be
            liable for:
          </p>
          <ul className="mt-3 space-y-2 list-disc pl-6 marker:text-[#1A73E8]">
            <li>Any indirect, incidental, or consequential damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Actions or content of other users</li>
            <li>Property transactions between users</li>
            <li>Service interruptions or technical issues</li>
          </ul>
        </>
      ),
    },
    {
      number: "11",
      id: "termination",
      title: "Account Termination",
      content: (
        <>
          <p>We reserve the right to suspend or terminate your account if you:</p>
          <ul className="mt-3 space-y-2 list-disc pl-6 marker:text-[#1A73E8]">
            <li>Violate these Terms of Service</li>
            <li>Engage in fraudulent activities</li>
            <li>Provide false information</li>
            <li>Misuse our platform</li>
          </ul>
          <p className="mt-5">
            You may also terminate your account at any time by contacting{" "}
            <a
              href="mailto:support@zameen360.com"
              className="text-[#1A73E8] font-semibold border-b-2 border-transparent hover:border-[#1A73E8] transition-all duration-300"
            >
              support@zameen360.com
            </a>
          </p>
        </>
      ),
    },
    {
      number: "12",
      id: "changes",
      title: "Changes to Terms",
      content: (
        <p>
          We may update these Terms from time to time. We will notify users of
          significant changes via email or through our platform. Your continued
          use of Zameen 360 after changes constitutes acceptance of the new
          Terms.
        </p>
      ),
    },
    {
      number: "13",
      id: "contact",
      title: "Contact Us",
      content: (
        <>
          <p className="mb-5">
            If you have questions about these Terms, please contact us:
          </p>
          <div className="bg-gradient-to-br from-blue-50 to-white p-7 rounded-2xl border border-blue-100 transition-all duration-500 hover:shadow-lg hover:border-[#1A73E8]">
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider w-20">
                  Email
                </span>
                <a
                  href="mailto:legal@zameen360.com"
                  className="text-[#1A73E8] font-semibold border-b-2 border-transparent hover:border-[#1A73E8] transition-all duration-300"
                >
                  legal@zameen360.com
                </a>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider w-20">
                  Phone
                </span>
                <span className="text-gray-800 font-semibold">
                  +92 300 1234567
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider w-20">
                  Address
                </span>
                <span className="text-gray-800 font-semibold">
                  Lahore, Pakistan
                </span>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-gray-100 z-[60]">
        <div
          className="h-full bg-[#1A73E8] transition-all duration-200 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* TOP NAVBAR */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-[3px] z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Zameen <span className="text-[#1A73E8]">360</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <a
              href="/"
              className="relative hover:text-[#1A73E8] transition-colors duration-300 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#1A73E8] after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </a>
            <a
              href="/buy"
              className="relative hover:text-[#1A73E8] transition-colors duration-300 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#1A73E8] after:transition-all after:duration-300 hover:after:w-full"
            >
              Buy
            </a>
            <a
              href="/rent"
              className="relative hover:text-[#1A73E8] transition-colors duration-300 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#1A73E8] after:transition-all after:duration-300 hover:after:w-full"
            >
              Rent
            </a>
            <a
              href="/contact"
              className="relative hover:text-[#1A73E8] transition-colors duration-300 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#1A73E8] after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact
            </a>
          </div>
          <button className="bg-[#1A73E8] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1565C0] hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all duration-300">
            Post Property
          </button>
        </div>
      </nav>

      {/* HERO HEADER */}
      <div className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Subtle decorative line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#1A73E8] to-transparent opacity-30" />

        <div className="max-w-4xl mx-auto px-6 py-24 text-center relative">
          {/* Label with slide-in animation */}
          <div
            className={`inline-block transition-all duration-1000 ${
              heroVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#1A73E8] border border-[#1A73E8] px-5 py-2 rounded-full">
              Legal Document
            </span>
          </div>

          {/* Main heading with reveal */}
          <h1
            className={`text-5xl md:text-7xl font-extrabold text-gray-900 mt-8 mb-6 tracking-tight transition-all duration-1000 delay-200 ${
              heroVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Terms of <span className="text-[#1A73E8]">Service</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
              heroVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Please read these terms carefully before using the Zameen 360
            platform
          </p>

          {/* Last updated badge */}
          <div
            className={`mt-10 inline-flex items-center gap-3 text-sm text-gray-500 transition-all duration-1000 delay-500 ${
              heroVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="w-2 h-2 bg-[#1A73E8] rounded-full animate-pulse" />
            <span>
              Last Updated:{" "}
              <strong className="text-gray-800">January 15, 2025</strong>
            </span>
          </div>

          {/* Animated scroll indicator */}
          <div
            className={`mt-16 transition-all duration-1000 delay-700 ${
              heroVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="inline-flex flex-col items-center gap-2 text-gray-400">
              <span className="text-xs uppercase tracking-widest">
                Scroll to read
              </span>
              <div className="w-px h-12 bg-gradient-to-b from-gray-300 to-transparent animate-scroll-line" />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Welcome Box */}
        <div
          className={`mb-20 reveal-section transition-all duration-1000 ${
            visibleSections.has("welcome")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
          id="welcome"
        >
          <div className="relative p-10 bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100 overflow-hidden group">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1A73E8] opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-500" />

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1A73E8] mb-4">
                Welcome
              </p>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Thank you for choosing Zameen 360
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                These Terms of Service govern your access to and use of Zameen
                360's website, mobile applications, and services. By accessing
                or using our platform, you agree to be bound by these Terms.
              </p>
            </div>
          </div>
        </div>

        {/* SECTIONS WITH ANIMATIONS */}
        <div className="space-y-16">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className={`reveal-section transition-all duration-1000 ${
                visibleSections.has(section.id)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
              }`}
              style={{
                transitionDelay: visibleSections.has(section.id)
                  ? "0ms"
                  : `${(index % 3) * 100}ms`,
              }}
            >
              <div className="group">
                {/* Section number */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-7xl font-extrabold text-gray-100 group-hover:text-[#1A73E8] transition-colors duration-500 leading-none">
                    {section.number}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                </div>

                {/* Section title */}
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                  {section.title}
                </h2>

                {/* Section content */}
                <div className="text-gray-700 leading-[1.85] text-base md:text-lg space-y-4 pl-0 md:pl-2">
                  {section.content}
                </div>

                {/* Separator */}
                <div className="mt-12 h-px bg-gradient-to-r from-gray-100 via-blue-100 to-transparent" />
              </div>
            </section>
          ))}
        </div>

        {/* AGREEMENT BOX */}
        <div
          id="agreement"
          className={`mt-24 reveal-section transition-all duration-1000 ${
            visibleSections.has("agreement")
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-12 scale-95"
          }`}
        >
          <div className="relative p-12 bg-[#1A73E8] rounded-3xl text-white overflow-hidden">
            {/* Animated decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-5 rounded-full animate-float-slow" />
            <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white opacity-5 rounded-full animate-float-slow-reverse" />

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-200 mb-4">
                Important Notice
              </p>
              <h3 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
                Your Agreement
              </h3>
              <p className="text-white/90 leading-relaxed text-lg max-w-3xl">
                By using Zameen 360, you acknowledge that you have read,
                understood, and agreed to these terms. If you have any
                questions, please contact us at{" "}
                <a
                  href="mailto:legal@zameen360.com"
                  className="text-white font-bold border-b-2 border-white/40 hover:border-white transition-all duration-300"
                >
                  legal@zameen360.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLL TO TOP */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-[#1A73E8] text-white w-14 h-14 rounded-full shadow-lg shadow-blue-300 hover:bg-[#1565C0] hover:scale-110 hover:-translate-y-1 flex items-center justify-center z-50 transition-all duration-500 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-400">
            &copy; 2025 Zameen 360. All rights reserved.
          </p>
          <div className="flex items-center gap-6">     
            <a          
              href="/terms"       
              className="text-gray-400 hover:text-white transition-colors duration-300"

            >       Terms of Service          
            </a>  
            <a            
              href="/privacy" 
              className="text-gray-400 hover:text-white transition-colors duration-300" 
            >       Privacy Policy          
            </a>  
            <a  
              href="/contact" 
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >       Contact Us          
            </a>  
          </div>                  
        </div>  
      </footer>       
    </div>  
  );    
};  

export default TermsOfService;  
                                    