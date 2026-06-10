import React, { useState, useEffect, useRef } from "react";

const PrivacyPolicy: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );
  const [activeSection, setActiveSection] = useState<string>("introduction");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [headerVisible, setHeaderVisible] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowScrollTop(window.scrollY > 500);
      setHeaderVisible(window.scrollY < 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.15 }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll(".animate-section").forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const sections = [
    {
      id: "introduction",
      number: "01",
      title: "Introduction",
      content: (
        <>
          <p>
            Zameen 360 is committed to protecting the privacy of users of our
            website and mobile applications. This Privacy Policy describes how
            we collect, use, disclose, and safeguard your information when you
            use our platform.
          </p>
          <p className="mt-4">
            By using Zameen 360, you consent to the data practices described in
            this policy. We encourage you to read this document carefully to
            understand our approach to handling your personal information.
          </p>
        </>
      ),
    },
    {
      id: "information",
      number: "02",
      title: "Information We Collect",
      content: (
        <>
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 text-lg mb-3 tracking-tight">
              Personal Information
            </h4>
            <div className="grid gap-2">
              {[
                "Name and contact details (email, phone, address)",
                "Government-issued ID for verification",
                "Profile photos and information",
                "Payment and billing information",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 hover:bg-blue-50 transition-all duration-500 hover:translate-x-2"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-3 tracking-tight">
              Technical Information
            </h4>
            <div className="grid gap-2">
              {[
                "IP address and device information",
                "Browser type and version",
                "Usage data and analytics",
                "Cookies and tracking data",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 hover:bg-blue-50 transition-all duration-500 hover:translate-x-2"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ),
    },
    {
      id: "usage",
      number: "03",
      title: "How We Use Information",
      content: (
        <>
          <p className="mb-4 text-gray-700">We use your information to:</p>
          <div className="grid gap-2">
            {[
              "Provide and improve our services",
              "Process property listings and transactions",
              "Verify user identity and prevent fraud",
              "Send notifications about properties",
              "Recommend properties based on preferences",
              "Communicate updates and information",
              "Comply with legal obligations",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all duration-500 group hover:translate-x-2"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xs font-bold text-blue-600 group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white transition-all duration-500 flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "sharing",
      number: "04",
      title: "Information Sharing",
      content: (
        <>
          <p className="text-gray-700 mb-6">
            We may share your information with other users, service providers,
            and as required by law. We are transparent about every instance
            where your data may be shared.
          </p>
          <div className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl relative overflow-hidden group hover:border-blue-400 transition-all duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative">
              <p className="text-blue-900 font-bold text-xl mb-2">
                We NEVER sell your personal data
              </p>
              <p className="text-blue-700 text-sm leading-relaxed">
                Zameen 360 does not sell your personal information to third
                parties for marketing purposes. Your trust is our highest
                priority.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "cookies",
      number: "05",
      title: "Cookies & Tracking",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            We use cookies and similar technologies to enhance your experience:
          </p>
          <div className="space-y-3">
            {[
              {
                title: "Essential Cookies",
                desc: "Required for platform functionality",
                level: "Required",
              },
              {
                title: "Performance Cookies",
                desc: "Help us analyze usage patterns",
                level: "Recommended",
              },
              {
                title: "Functionality Cookies",
                desc: "Remember your preferences and settings",
                level: "Optional",
              },
            ].map((cookie, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all duration-500 hover:shadow-lg group bg-white"
              >
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                    {cookie.title}
                  </h5>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full transition-all duration-300 ${
                      cookie.level === "Required"
                        ? "bg-blue-100 text-blue-700"
                        : cookie.level === "Recommended"
                        ? "bg-blue-50 text-blue-500"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {cookie.level}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{cookie.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            You can control cookies through your browser settings at any time.
          </p>
        </>
      ),
    },
    {
      id: "security",
      number: "06",
      title: "Data Security",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            We implement strong security measures to protect your data:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { title: "256-bit SSL", desc: "Encryption for data transmission" },
              { title: "Cloud Security", desc: "Secure cloud infrastructure" },
              { title: "Regular Audits", desc: "Security audits and updates" },
              { title: "Access Control", desc: "Authentication protocols" },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-gradient-to-br from-white to-blue-50/50 border border-gray-100 hover:border-blue-300 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group"
              >
                <h5 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 text-lg">
                  {item.title}
                </h5>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 group-hover:w-full w-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "rights",
      number: "07",
      title: "Your Privacy Rights",
      content: (
        <>
          <p className="mb-5 text-gray-700">
            You have the following rights regarding your personal data:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { text: "Access your data", action: "View" },
              { text: "Correct inaccurate info", action: "Edit" },
              { text: "Delete your account", action: "Remove" },
              { text: "Restrict processing", action: "Limit" },
              { text: "Data portability", action: "Export" },
              { text: "Withdraw consent", action: "Revoke" },
            ].map((right, i) => (
              <div
                key={i}
                className="group relative p-4 rounded-2xl border border-gray-100 bg-white hover:border-blue-300 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 cursor-default overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-500 group-hover:text-blue-200 transition-colors duration-500">
                    {right.action}
                  </span>
                  <p className="text-gray-800 font-semibold mt-1 group-hover:text-white transition-colors duration-500">
                    {right.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "retention",
      number: "08",
      title: "Data Retention",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            We retain your personal data only as long as necessary:
          </p>
          <div className="space-y-3">
            {[
              {
                period: "Active",
                detail: "While your account is active",
                width: "100%",
              },
              {
                period: "Listings",
                detail: "Duration + 1 year after expiry",
                width: "70%",
              },
              {
                period: "Transactions",
                detail: "7 years for legal compliance",
                width: "85%",
              },
              {
                period: "Marketing",
                detail: "Until consent is withdrawn",
                width: "40%",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white border border-gray-100 hover:border-blue-200 transition-all duration-500 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">{item.period}</span>
                  <span className="text-sm text-gray-500">{item.detail}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: visibleSections.has("retention") ? item.width : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "children",
      number: "09",
      title: "Children's Privacy",
      content: (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
          <p className="text-gray-700 leading-relaxed">
            Zameen 360 is not intended for users under 18 years of age. We do
            not knowingly collect personal information from children. If we
            discover we have collected data from a minor, we will delete it
            immediately and notify the relevant authorities if necessary.
          </p>
        </div>
      ),
    },
    {
      id: "international",
      number: "10",
      title: "International Transfers",
      content: (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
          <p className="text-gray-700 leading-relaxed">
            Your data may be transferred to and processed in countries other
            than Pakistan. We ensure appropriate safeguards are in place to
            protect your information during such transfers, including standard
            contractual clauses and encryption protocols.
          </p>
        </div>
      ),
    },
    {
      id: "thirdparty",
      number: "11",
      title: "Third-Party Services",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            Our platform may contain links to third-party websites. Third-party
            services we use include:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: "Google Maps", purpose: "Location services" },
              { name: "Google Analytics", purpose: "Usage tracking" },
              { name: "Payment Gateways", purpose: "Transaction processing" },
              { name: "Cloud Providers", purpose: "Data storage" },
            ].map((service, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-gray-100 hover:border-blue-300 transition-all duration-500 hover:shadow-lg group bg-white"
              >
                <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                  {service.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">{service.purpose}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "updates",
      number: "12",
      title: "Policy Updates",
      content: (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with a new "Last Updated" date. For significant
            changes, we will notify you via email or through our platform. We
            recommend reviewing this policy periodically to stay informed.
          </p>
        </div>
      ),
    },
    {
      id: "contact",
      number: "13",
      title: "Contact Us",
      content: (
        <>
          <p className="mb-5 text-gray-700">
            For privacy-related questions, please reach out through any of the
            following channels:
          </p>
          <div className="space-y-3">
            {[
              {
                label: "Privacy Email",
                value: "privacy@zameen360.com",
                isLink: true,
              },
              { label: "Phone", value: "+92 300 1234567", isLink: false },
              { label: "Address", value: "Lahore, Pakistan", isLink: false },
            ].map((info, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-gray-100 hover:border-blue-300 transition-all duration-500 hover:shadow-lg group bg-white flex items-center justify-between"
              >
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  {info.label}
                </span>
                {info.isLink ? (
                  <a
                    href={`mailto:${info.value}`}
                    className="text-blue-600 hover:text-blue-800 font-bold transition-colors duration-300 hover:underline"
                  >
                    {info.value}
                  </a>
                ) : (
                  <span className="text-gray-900 font-semibold">
                    {info.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-transparent z-[60]">
        <div
          className="h-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 transition-all duration-150 shadow-lg shadow-blue-500/30"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* CURSOR GLOW EFFECT */}
      <div
        className="fixed pointer-events-none z-[100] w-[500px] h-[500px] rounded-full opacity-[0.03] transition-all duration-700 ease-out"
        style={{
          background:
            "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
          left: mousePosition.x - 250,
          top: mousePosition.y - 250,
        }}
      />

      {/* TOP NAVBAR */}
      <nav
        className={`bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-[3px] z-50 transition-all duration-700 ${
          headerVisible ? "shadow-none" : "shadow-lg shadow-blue-500/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-blue-500/25">
              <span className="text-white font-black text-lg">Z</span>
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              Zameen{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                360
              </span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            {["Home", "Buy", "Rent", "Contact"].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="relative hover:text-blue-600 transition-colors duration-300 group py-1"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 group-hover:w-full transition-all duration-500" />
              </a>
            ))}
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95">
            Post Property
          </button>
        </div>
      </nav>

      {/* HERO HEADER */}
      <div
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white"
      >
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              animation: "gridMove 20s linear infinite",
            }}
          />
        </div>

        {/* Floating Orbs */}
        <div className="absolute top-20 left-[10%] w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-blue-300/15 rounded-full blur-3xl animate-float-slow-reverse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />

        {/* Geometric Lines */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute top-[20%] left-[-5%] w-[60%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent rotate-12 animate-line-slide" />
          <div className="absolute top-[60%] right-[-5%] w-[50%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent -rotate-6 animate-line-slide-reverse" />
          <div className="absolute top-[40%] left-[20%] w-[40%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent rotate-3 animate-line-slide-slow" />
        </div>

        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center relative z-10">
          <div className="inline-block bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-[0.2em] px-6 py-2.5 rounded-full mb-8 animate-fadeInDown border border-white/20 hover:bg-white/20 transition-all duration-500 cursor-default">
            Privacy & Protection
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 animate-fadeInUp tracking-tight leading-none">
            Privacy
            <br />
            <span className="bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/80 mb-8 animate-fadeInUp animation-delay-200 max-w-2xl mx-auto leading-relaxed font-light">
            Your privacy matters to us. Learn how we collect, use, and protect
            your personal data with complete transparency.
          </p>
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-sm animate-fadeInUp animation-delay-400 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-blue-100">
              Last Updated:{" "}
              <strong className="text-white">January 15, 2025</strong>
            </span>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-gentle-bounce">
            <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent mx-auto" />
          </div>
        </div>
      </div>

      {/* QUICK SUMMARY CARDS */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              title: "Encrypted",
              text: "256-bit encryption protects all your data end-to-end",
              gradient: "from-blue-500 to-blue-700",
            },
            {
              title: "No Selling",
              text: "We never sell your personal information to anyone",
              gradient: "from-blue-600 to-blue-800",
            },
            {
              title: "Your Control",
              text: "Access, edit, or delete your data at any time",
              gradient: "from-blue-400 to-blue-600",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="group bg-white rounded-3xl shadow-2xl shadow-blue-500/10 p-8 text-center hover:shadow-blue-500/20 transition-all duration-700 animate-fadeInUp cursor-default relative overflow-hidden"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
              />
              <div className="relative z-10">
                <div
                  className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} items-center justify-center mb-4 shadow-lg group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500`}
                >
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>
                <h3 className="font-black text-gray-900 text-xl mb-2 group-hover:text-white transition-colors duration-500">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-blue-100 transition-colors duration-500 leading-relaxed">
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT WITH SIDEBAR */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex gap-12">
          {/* STICKY SIDEBAR NAV */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
                Table of Contents
              </p>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-500 flex items-center gap-3 group ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`text-xs font-mono transition-all duration-300 ${
                        activeSection === section.id
                          ? "text-blue-500"
                          : "text-gray-300"
                      }`}
                    >
                      {section.number}
                    </span>
                    <span className="truncate">{section.title}</span>
                    <div
                      className={`ml-auto w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                        activeSection === section.id
                          ? "bg-blue-500 scale-100"
                          : "bg-transparent scale-0"
                      }`}
                    />
                  </button>
                ))}
              </nav>

              {/* Progress indicator */}
              <div className="mt-8 p-4 rounded-2xl bg-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Reading progress</span>
                  <span className="font-mono">
                    {Math.round(scrollProgress)}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* SECTIONS */}
          <div className="flex-1 max-w-3xl">
            {/* Intro Box */}
            <div className="mb-14 p-8 md:p-10 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl text-white shadow-2xl shadow-blue-500/20 animate-fadeInUp transform hover:scale-[1.01] transition-all duration-700 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                  <div className="w-4 h-4 rounded-full bg-white/60" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                  Your Privacy Matters
                </h2>
                <p className="text-blue-100/90 leading-relaxed text-lg font-light">
                  At Zameen 360, we are committed to protecting your privacy and
                  being transparent about how we collect, use, and safeguard
                  your personal information. This Privacy Policy explains our
                  practices in detail.
                </p>
              </div>
            </div>

            {/* SECTIONS WITH ANIMATIONS */}
            {sections.map((section, index) => (
              <div
                key={section.id}
                id={section.id}
                className={`animate-section mb-8 transition-all duration-1000 ${
                  visibleSections.has(section.id)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-16"
                }`}
                style={{ transitionDelay: `${(index % 4) * 80}ms` }}
              >
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 p-8 md:p-10 transition-all duration-700 hover:-translate-y-1 border border-gray-100 hover:border-blue-100 group relative overflow-hidden">
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative">
                    {/* Section Header */}
                    <div className="flex items-center gap-5 mb-8">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        {section.number}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight group-hover:text-blue-800 transition-colors duration-500">
                          {section.title}
                        </h2>
                        <div className="mt-2 h-[2px] bg-gradient-to-r from-blue-500 to-transparent w-0 group-hover:w-full transition-all duration-700" />
                      </div>
                    </div>

                    {/* Section Content */}
                    <div className="text-gray-600 leading-relaxed text-[15px]">
                      {section.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* AGREEMENT BOX */}
            <div className="mt-14 p-8 md:p-10 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-3xl shadow-xl animate-fadeInUp relative overflow-hidden group hover:border-blue-400 transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors duration-500">
                  <div className="w-4 h-4 rounded-full bg-blue-500 group-hover:bg-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">
                  We Protect Your Privacy
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Your trust is important to us. We are committed to
                  maintaining the highest standards of data protection. For any
                  privacy-related questions, contact{" "}
                  <a
                    href="mailto:privacy@zameen360.com"
                    className="text-blue-600 font-bold hover:text-blue-800 transition-colors duration-300 underline underline-offset-4 decoration-blue-300 hover:decoration-blue-600"
                  >
                    privacy@zameen360.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLL TO TOP */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-gradient-to-br from-blue-500 to-blue-700 text-white w-14 h-14 rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all duration-500 flex items-center justify-center z-50 active:scale-90 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-[2px] h-4 bg-white rounded-full" />
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-white rotate-180" />
        </div>
      </button>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-black text-lg">Z</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight">
              Zameen{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                360
              </span>
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-8 font-light">
            3D Property Experience Platform
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-500 mb-8">
            {[
              { label: "Terms of Service", href: "/terms" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors duration-500 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-500" />
              </a>
            ))}
          </div>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-auto mb-8" />
          <p className="text-xs text-gray-600">
            &copy; 2025 Zameen 360. All rights reserved.
          </p>
        </div>
      </footer>

      {/* CUSTOM ANIMATIONS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes float-slow-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 30px) scale(1.05); }
          66% { transform: translate(20px, -20px) scale(0.95); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes gentle-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(10px); opacity: 1; }
        }
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes line-slide {
          0% { transform: rotate(12deg) translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: rotate(12deg) translateX(100%); opacity: 0; }
        }
        @keyframes line-slide-reverse {
          0% { transform: rotate(-6deg) translateX(100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: rotate(-6deg) translateX(-100%); opacity: 0; }
        }
        @keyframes line-slide-slow {
          0% { transform: rotate(3deg) translateX(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: rotate(3deg) translateX(100%); opacity: 0; }
        }

        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fadeInDown { animation: fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-float-slow-reverse { animation: float-slow-reverse 14s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-gentle-bounce { animation: gentle-bounce 3s ease-in-out infinite; }
        .animate-line-slide { animation: line-slide 8s ease-in-out infinite; }
        .animate-line-slide-reverse { animation: line-slide-reverse 10s ease-in-out infinite; }
        .animate-line-slide-slow { animation: line-slide-slow 12s ease-in-out infinite; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }

        /* Selection color */
        ::selection {
          background: rgba(59, 130, 246, 0.2);
          color: #1E40AF;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;