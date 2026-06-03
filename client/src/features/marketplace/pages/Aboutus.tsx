import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import Footer from '../components/Footer';

// Icon components
const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const HandshakeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const RocketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" style={{ color: '#2b6aff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const QuoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 opacity-50" style={{ color: '#2b6aff' }} fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

// Counter Animation Hook
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return { count, setIsVisible };
};


// Hero Section
const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #000000 0%, #0a1f4d 50%, #2b6aff 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2360a5fa' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(43, 106, 255, 0.2)' }}></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(96, 165, 250, 0.15)' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
        <div className="inline-flex items-center space-x-2 border rounded-full px-6 py-2 mb-8" style={{ backgroundColor: 'rgba(43, 106, 255, 0.15)', borderColor: 'rgba(96, 165, 250, 0.3)' }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#60a5fa' }}></div>
          <span className="text-sm font-medium" style={{ color: '#60a5fa' }}>Pakistan's Leading Real Estate Platform</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          About <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #2b6aff 100%)' }}>Zameen 360</span>
        </h1>

        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Your trusted partner in real estate — providing 360° comprehensive property solutions 
          across Pakistan since 2015. We turn your property dreams into reality.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/buy')}
            className="text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl flex items-center space-x-2"
            style={{ background: 'linear-gradient(135deg, #2b6aff 0%, #60a5fa 100%)', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.45)' }}
          >
            <span>Explore Properties</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button className="group border-2 border-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all flex items-center space-x-3 hover:border-[#60a5fa]">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#2b6aff]/30 transition-colors">
              <PlayIcon />
            </div>
            <span>Watch Our Story</span>
          </button>
        </div>

        <div className="mt-16 flex items-center justify-center space-x-8 md:space-x-16">
          {[
            { label: 'Years Experience', value: '9+' },
            { label: 'Properties Sold', value: '5000+' },
            { label: 'Happy Clients', value: '3500+' },
            { label: 'Cities Covered', value: '15+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold" style={{ color: '#60a5fa' }}>{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

// Company Story Section
const CompanyStory: React.FC = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-6" style={{ backgroundColor: 'rgba(43, 106, 255, 0.1)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2b6aff' }}></div>
            <span className="text-sm font-semibold uppercase tracking-wider text-black">Our Story</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-black">
            Building Dreams, <br />
            <span style={{ color: '#2b6aff' }}>
              Creating Futures
            </span>
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Founded in 2015, <strong className="text-black">Zameen 360</strong> began with a simple yet powerful vision — 
              to revolutionize the real estate industry in Pakistan by providing transparent, reliable, and comprehensive 
              property solutions to every Pakistani.
            </p>
            <p>
              What started as a small team of passionate real estate professionals in Lahore has now grown into one of 
              Pakistan's most trusted real estate companies, operating across 15+ cities with a portfolio spanning 
              residential, commercial, and investment properties.
            </p>
            <p>
              Our name "360" represents our commitment to providing a complete, all-encompassing view of every property 
              and transaction — ensuring our clients make informed decisions with confidence and peace of mind.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              'RERA Certified',
              'ISO 9001 Certified',
              'Award Winning Agency',
              'Trusted by 3500+ Clients',
            ].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <CheckIcon />
                <span className="text-sm text-black font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-[4/5] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}>
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-xl" style={{ background: 'linear-gradient(135deg, #2b6aff 0%, #60a5fa 100%)', boxShadow: '0 20px 50px rgba(37, 99, 235, 0.45)' }}>
                  <span className="text-white text-5xl font-bold">Z</span>
                </div>
                <h3 className="text-2xl font-bold text-black">Zameen 360</h3>
                <p className="text-gray-700 mt-2">Established 2015</p>
                <div className="mt-6 flex items-center justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="text-yellow-400">
                      <StarIcon filled={true} />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">Rated 4.9/5 by 2000+ clients</p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(43, 106, 255, 0.1)', color: '#2b6aff' }}>
                <TrophyIcon />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">9+</p>
                <p className="text-xs text-gray-600">Years of Excellence</p>
              </div>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(96, 165, 250, 0.15)', color: '#2b6aff' }}>
                <BuildingIcon />
              </div>
              <div>
                <p className="text-2xl font-bold text-black">5000+</p>
                <p className="text-xs text-gray-600">Properties Sold</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Stats Counter Section
const StatsSection: React.FC = () => {
  const stats = [
    { end: 5000, suffix: '+', label: 'Properties Sold', icon: <BuildingIcon /> },
    { end: 3500, suffix: '+', label: 'Happy Clients', icon: <UsersIcon /> },
    { end: 15, suffix: '+', label: 'Cities Covered', icon: <MapPinIcon /> },
    { end: 250, suffix: '+', label: 'Expert Agents', icon: <HandshakeIcon /> },
    { end: 50, suffix: '+', label: 'Awards Won', icon: <TrophyIcon /> },
    { end: 98, suffix: '%', label: 'Client Satisfaction', icon: <ShieldIcon /> },
  ];

  const counters = stats.map((stat) => useCounter(stat.end));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            counters.forEach((counter) => counter.setIsVisible(true));
          }
        });
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('stats-section');
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #000000 0%, #0a1f4d 50%, #2b6aff 100%)' }}>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(43, 106, 255, 0.1)' }}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(96, 165, 250, 0.1)' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Numbers Speak <span style={{ color: '#60a5fa' }}>Volumes</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Trusted by thousands across Pakistan — our track record of excellence defines who we are.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center group">
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 transform duration-300" style={{ backgroundColor: 'rgba(43, 106, 255, 0.2)', color: '#60a5fa' }}>
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {counters[index].count}{stat.suffix}
              </div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Mission & Vision Section
const MissionVision: React.FC = () => (
  <section className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-6" style={{ backgroundColor: 'rgba(43, 106, 255, 0.1)' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2b6aff' }}></div>
          <span className="text-sm font-semibold uppercase tracking-wider text-black">What Drives Us</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
          Our Mission & <span style={{ color: '#2b6aff' }}>Vision</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-shadow border border-gray-100 group">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #2b6aff 0%, #60a5fa 100%)', boxShadow: '0 10px 30px rgba(37, 99, 235, 0.45)' }}>
            <RocketIcon />
          </div>
          <h3 className="text-2xl font-bold text-black mb-4">Our Mission</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            To democratize real estate in Pakistan by providing transparent, technology-driven, and customer-centric 
            property solutions. We aim to make property buying, selling, and investing accessible, reliable, and 
            hassle-free for every Pakistani — from first-time homebuyers to seasoned investors.
          </p>
          <ul className="space-y-3">
            {[
              'Transparent property dealings with no hidden costs',
              'Technology-powered property search and verification',
              'Expert guidance at every step of your journey',
              'Affordable solutions for every budget range',
            ].map((item) => (
              <li key={item} className="flex items-start space-x-3">
                <CheckIcon />
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-shadow border border-gray-100 group">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #2b6aff 100%)', boxShadow: '0 10px 30px rgba(37, 99, 235, 0.45)' }}>
            <EyeIcon />
          </div>
          <h3 className="text-2xl font-bold text-black mb-4">Our Vision</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            To become Pakistan's most trusted and innovative real estate platform — where every property transaction 
            is secure, transparent, and value-driven. We envision a future where finding your perfect property is 
            as simple as a few clicks, backed by the trust of a dedicated team.
          </p>
          <ul className="space-y-3">
            {[
              'Become the #1 real estate platform in Pakistan by 2030',
              'Expand to 50+ cities across Pakistan',
              'Integrate AI and VR in property experiences',
              'Build the largest verified property database',
            ].map((item) => (
              <li key={item} className="flex items-start space-x-3">
                <CheckIcon />
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

// Core Values Section
const CoreValues: React.FC = () => {
  const values = [
    {
      icon: <ShieldIcon />,
      title: 'Trust & Transparency',
      description: 'We believe in complete honesty and openness in every transaction. No hidden fees, no surprises — just transparent dealings.',
    },
    {
      icon: <UsersIcon />,
      title: 'Customer First',
      description: 'Our clients are at the heart of everything we do. We go above and beyond to ensure your satisfaction and peace of mind.',
    },
    {
      icon: <TrophyIcon />,
      title: 'Excellence',
      description: 'We strive for excellence in every property listing, every consultation, and every transaction. Quality is our hallmark.',
    },
    {
      icon: <TargetIcon />,
      title: 'Innovation',
      description: 'We leverage cutting-edge technology to provide virtual tours, AI-powered recommendations, and seamless digital experiences.',
    },
    {
      icon: <HandshakeIcon />,
      title: 'Integrity',
      description: 'We operate with the highest ethical standards, ensuring every deal is fair, legal, and in the best interest of our clients.',
    },
    {
      icon: <BuildingIcon />,
      title: 'Community Impact',
      description: 'We are committed to developing communities, creating sustainable living spaces, and contributing to Pakistan\'s growth.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-6" style={{ backgroundColor: 'rgba(43, 106, 255, 0.1)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2b6aff' }}></div>
            <span className="text-sm font-semibold uppercase tracking-wider text-black">Our Foundation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Core <span style={{ color: '#2b6aff' }}>Values</span>
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            The principles that guide every decision we make and every relationship we build.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300"
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#60a5fa'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
            >
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(90deg, #2b6aff 0%, #60a5fa 100%)' }}></div>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(43, 106, 255, 0.1)', color: '#2b6aff' }}>
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{value.title}</h3>
              <p className="text-gray-700 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Services Section
const ServicesSection: React.FC = () => {
  const services = [
    {
      title: 'Property Sales & Purchase',
      description: 'Complete assistance in buying and selling residential, commercial, and agricultural properties across Pakistan.',
      features: ['Market Analysis', 'Price Negotiation', 'Legal Documentation', 'Registration Support'],
    },
    {
      title: 'Property Investment Advisory',
      description: 'Expert investment advice to maximize your ROI with data-driven insights and market forecasts.',
      features: ['ROI Analysis', 'Market Trends', 'Portfolio Management', 'Risk Assessment'],
    },
    {
      title: 'Property Management',
      description: 'End-to-end property management services including tenant screening, rent collection, and maintenance.',
      features: ['Tenant Screening', 'Rent Collection', 'Maintenance', 'Legal Compliance'],
    },
    {
      title: 'Home Loans & Financing',
      description: 'We partner with leading banks to help you secure the best mortgage rates and financing options.',
      features: ['Bank Partnerships', 'EMI Calculator', 'Documentation Help', 'Quick Approvals'],
    },
    {
      title: 'Legal & Documentation',
      description: 'Complete legal support for property verification, title clearance, transfer, and registration.',
      features: ['Title Verification', 'Transfer Deeds', 'NOC Processing', 'Court Matters'],
    },
    {
      title: 'Virtual Property Tours',
      description: '360° virtual tours and drone footage to help you explore properties from the comfort of your home.',
      features: ['360° Virtual Tours', 'Drone Photography', 'HD Video Tours', 'Live Walkthroughs'],
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-6" style={{ backgroundColor: 'rgba(43, 106, 255, 0.1)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2b6aff' }}></div>
            <span className="text-sm font-semibold uppercase tracking-wider text-black">What We Offer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Our <span style={{ color: '#2b6aff' }}>Services</span>
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Comprehensive 360° real estate solutions tailored to meet your every property need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={service.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 font-bold text-lg shadow-lg" style={{ background: 'linear-gradient(135deg, #2b6aff 0%, #60a5fa 100%)', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)' }}>
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="text-xl font-bold text-black mb-3 transition-colors group-hover:text-[#2b6aff]">
                {service.title}
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">{service.description}</p>
              <div className="grid grid-cols-2 gap-2">
                {service.features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2b6aff' }}></div>
                    <span className="text-xs text-gray-600 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Team Section
const TeamSection: React.FC = () => {
  const team = [
    {
      name: 'Ahmed Khan',
      role: 'Founder & CEO',
      bio: '15+ years in real estate with a vision to transform Pakistan\'s property market.',
      initials: 'AK',
    },
    {
      name: 'Sara Malik',
      role: 'Chief Operations Officer',
      bio: 'Operations expert ensuring seamless property transactions across all cities.',
      initials: 'SM',
    },
    {
      name: 'Usman Ali',
      role: 'Head of Sales',
      bio: 'Sales strategist with 2000+ successful property deals under his belt.',
      initials: 'UA',
    },
    {
      name: 'Fatima Zahra',
      role: 'Legal Director',
      bio: 'Property law specialist ensuring every transaction is legally sound and secure.',
      initials: 'FZ',
    },
    {
      name: 'Hassan Raza',
      role: 'Tech Lead',
      bio: 'Technology innovator building next-gen property search and virtual tour platforms.',
      initials: 'HR',
    },
    {
      name: 'Ayesha Noor',
      role: 'Marketing Director',
      bio: 'Brand strategist driving Zameen 360\'s growth and market presence across Pakistan.',
      initials: 'AN',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-6" style={{ backgroundColor: 'rgba(43, 106, 255, 0.1)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2b6aff' }}></div>
            <span className="text-sm font-semibold uppercase tracking-wider text-black">Our People</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Meet Our <span style={{ color: '#2b6aff' }}>Leadership</span>
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            A team of passionate professionals dedicated to making your property dreams come true.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="group text-center">
              <div className="relative mb-6 inline-block">
                <div className="w-32 h-32 mx-auto rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 rotate-3 group-hover:rotate-0" style={{ background: 'linear-gradient(135deg, #2b6aff 0%, #60a5fa 100%)', boxShadow: '0 15px 40px rgba(37, 99, 235, 0.45)' }}>
                  {member.initials}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center shadow-md" style={{ backgroundColor: '#2b6aff' }}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-black transition-colors group-hover:text-[#2b6aff]">{member.name}</h3>
              <p className="font-semibold text-sm mb-3" style={{ color: '#2b6aff' }}>{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Timeline Section
const TimelineSection: React.FC = () => {
  const milestones = [
    { year: '2015', title: 'Company Founded', description: 'Zameen 360 was established in Lahore with a small team of 5 passionate real estate professionals.' },
    { year: '2016', title: 'First 100 Properties', description: 'Reached our first milestone of 100 property listings and expanded to Islamabad.' },
    { year: '2017', title: 'Digital Platform Launch', description: 'Launched our online property portal, enabling customers to search and explore properties digitally.' },
    { year: '2018', title: 'Expanded to 5 Cities', description: 'Extended operations to Karachi, Faisalabad, and Rawalpindi with 50+ team members.' },
    { year: '2019', title: '1000+ Properties Sold', description: 'Celebrated the milestone of 1000+ successful property transactions.' },
    { year: '2020', title: 'Virtual Tours Introduced', description: 'Pioneered 360° virtual property tours in Pakistan during the pandemic era.' },
    { year: '2021', title: 'Award-Winning Agency', description: 'Recognized as "Best Real Estate Agency" at Pakistan Property Awards.' },
    { year: '2022', title: '10+ Cities Coverage', description: 'Expanded to 10+ cities with a team of 150+ professionals.' },
    { year: '2023', title: 'AI-Powered Platform', description: 'Integrated AI for property recommendations and automated valuations.' },
    { year: '2024', title: '5000+ Properties Sold', description: 'Reached 5000+ property sales milestone with 3500+ happy clients.' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-6" style={{ backgroundColor: 'rgba(43, 106, 255, 0.1)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2b6aff' }}></div>
            <span className="text-sm font-semibold uppercase tracking-wider text-black">Our Journey</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Our <span style={{ color: '#2b6aff' }}>Timeline</span>
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            A decade of growth, innovation, and building trust in Pakistan's real estate market.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 hidden md:block" style={{ background: 'linear-gradient(180deg, #2b6aff 0%, #60a5fa 100%)' }}></div>

          <div className="space-y-8 md:space-y-0">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} mb-8`}>
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group">
                    <span className="inline-block font-bold px-3 py-1 rounded-lg text-sm mb-3" style={{ backgroundColor: 'rgba(43, 106, 255, 0.1)', color: '#2b6aff' }}>
                      {milestone.year}
                    </span>
                    <h3 className="text-lg font-bold text-black mb-2 transition-colors group-hover:text-[#2b6aff]">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{milestone.description}</p>
                  </div>
                </div>

                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                  <div className="w-4 h-4 rounded-full border-4 border-white shadow-lg" style={{ backgroundColor: '#2b6aff' }}></div>
                </div>

                <div className="hidden md:block w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: 'Muhammad Bilal',
      role: 'Home Buyer, Lahore',
      text: 'Zameen 360 made my dream of owning a home a reality. Their team was incredibly professional, transparent, and guided me through every step. I couldn\'t have asked for a better experience!',
      rating: 5,
      initials: 'MB',
    },
    {
      name: 'Sana Aslam',
      role: 'Property Investor, Islamabad',
      text: 'As an investor, I need reliable data and honest advice. Zameen 360 delivered both. My portfolio has grown 40% thanks to their expert guidance. Highly recommended!',
      rating: 5,
      initials: 'SA',
    },
    {
      name: 'Tariq Mehmood',
      role: 'Commercial Property, Karachi',
      text: 'Finding the perfect office space seemed impossible until I worked with Zameen 360. Their commercial property team understood our needs perfectly and found us an ideal location.',
      rating: 5,
      initials: 'TM',
    },
    {
      name: 'Amina Sheikh',
      role: 'First-Time Buyer, Rawalpindi',
      text: 'Being a first-time buyer was overwhelming, but Zameen 360 made it so easy. From home loans to documentation, they handled everything. I\'m grateful for their support!',
      rating: 5,
      initials: 'AS',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-6" style={{ backgroundColor: 'rgba(43, 106, 255, 0.1)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2b6aff' }}></div>
            <span className="text-sm font-semibold uppercase tracking-wider text-black">Client Love</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            What Our Clients <span style={{ color: '#2b6aff' }}>Say</span>
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Don't just take our word for it — hear from the thousands who trust Zameen 360.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                index === activeIndex
                  ? 'shadow-xl scale-105'
                  : 'border-gray-100 hover:shadow-lg'
              }`}
              style={index === activeIndex 
                ? { borderColor: '#2b6aff', boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)' } 
                : {}}
              onClick={() => setActiveIndex(index)}
            >
              <QuoteIcon />
              <p className="text-gray-700 text-sm leading-relaxed mt-4 mb-6">{testimonial.text}</p>
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="text-yellow-400">
                    <StarIcon filled={star <= testimonial.rating} />
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #2b6aff 0%, #60a5fa 100%)' }}>
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-black">{testimonial.name}</p>
                  <p className="text-xs text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-3 rounded-full transition-all ${
                index === activeIndex ? 'w-8' : 'w-3 bg-gray-300 hover:bg-gray-400'
              }`}
              style={index === activeIndex ? { backgroundColor: '#2b6aff' } : {}}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Why Choose Us Section
const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      title: 'Verified Properties',
      description: 'Every property listed on Zameen 360 is physically verified by our team to ensure authenticity.',
      stat: '100%',
      statLabel: 'Verified',
    },
    {
      title: 'Best Price Guarantee',
      description: 'We negotiate the best market prices ensuring maximum value for your investment.',
      stat: '15%',
      statLabel: 'Avg. Savings',
    },
    {
      title: 'Legal Protection',
      description: 'Full legal support with document verification and fraud protection at every step.',
      stat: '0%',
      statLabel: 'Fraud Cases',
    },
    {
      title: 'After-Sale Support',
      description: 'Our relationship doesn\'t end at the sale. We provide lifetime after-sale support.',
      stat: '24/7',
      statLabel: 'Support',
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2b6aff 0%, #1d4fd6 100%)' }}>
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose Zameen 360?
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            We don't just sell properties — we build trust, create value, and deliver excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason) => (
            <div key={reason.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all group">
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-white">{reason.stat}</span>
                <p className="text-blue-100 text-sm font-medium mt-1">{reason.statLabel}</p>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">{reason.title}</h3>
              <p className="text-blue-50 text-sm text-center leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Areas We Serve Section
const AreasSection: React.FC = () => {
  const cities = [
    { name: 'Lahore', properties: '1200+', status: 'active' },
    { name: 'Islamabad', properties: '800+', status: 'active' },
    { name: 'Karachi', properties: '950+', status: 'active' },
    { name: 'Rawalpindi', properties: '500+', status: 'active' },
    { name: 'Faisalabad', properties: '350+', status: 'active' },
    { name: 'Multan', properties: '250+', status: 'active' },
    { name: 'Peshawar', properties: '200+', status: 'active' },
    { name: 'Sialkot', properties: '150+', status: 'active' },
    { name: 'Gujranwala', properties: '120+', status: 'active' },
    { name: 'Hyderabad', properties: '180+', status: 'coming' },
    { name: 'Quetta', properties: '100+', status: 'coming' },
    { name: 'Bahawalpur', properties: '80+', status: 'coming' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-6" style={{ backgroundColor: 'rgba(43, 106, 255, 0.1)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2b6aff' }}></div>
            <span className="text-sm font-semibold uppercase tracking-wider text-black">Our Presence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Cities We <span style={{ color: '#2b6aff' }}>Serve</span>
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            From Lahore to Karachi, we're expanding our footprint across Pakistan's major cities.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities.map((city) => (
            <div 
              key={city.name} 
              className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-all group cursor-pointer"
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#60a5fa'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2" style={{ color: '#2b6aff' }}>
                  <MapPinIcon />
                  <h3 className="font-bold text-black transition-colors group-hover:text-[#2b6aff]">{city.name}</h3>
                </div>
                {city.status === 'coming' && (
                  <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">Coming Soon</span>
                )}
              </div>
              <p className="text-sm text-gray-600">{city.properties} Properties</p>
              <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: city.status === 'active' ? '80%' : '30%', background: 'linear-gradient(90deg, #2b6aff 0%, #60a5fa 100%)' }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Partners Section
const PartnersSection: React.FC = () => {
  const partners = [
    'DHA', 'Bahria Town', 'LDA', 'CDA', 'NHA', 'Bank Alfalah', 'HBL', 'UBL',
    'Meezan Bank', 'Allied Bank', 'JS Bank', 'Askari Bank'
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-lg font-semibold text-black uppercase tracking-wider">Trusted Partners & Affiliations</h3>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {partners.map((partner) => (
            <div 
              key={partner} 
              className="bg-gray-50 rounded-xl p-4 flex items-center justify-center h-20 hover:shadow-sm transition-all group cursor-pointer border border-transparent"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(43, 106, 255, 0.05)';
                e.currentTarget.style.borderColor = '#60a5fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <span className="text-gray-500 font-bold text-sm transition-colors group-hover:text-[#2b6aff]">{partner}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-12 md:p-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #000000 0%, #0a1f4d 50%, #2b6aff 100%)' }}>
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(43, 106, 255, 0.2)' }}></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(96, 165, 250, 0.15)' }}></div>
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Find Your <span style={{ color: '#60a5fa' }}>Dream Property?</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Whether you're buying, selling, or investing — our expert team is ready to guide you 
                every step of the way. Let's start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/buy')}
                  className="text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl"
                  style={{ backgroundColor: '#2b6aff', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.45)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4fd6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2b6aff'}
                >
                  Schedule Consultation
                </button>
                <button 
                  onClick={() => navigate('/buy')}
                  className="border-2 border-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:border-[#60a5fa]"
                >
                  Browse Properties
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-gray-300">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(43, 106, 255, 0.3)', color: '#60a5fa' }}>
                    <PhoneIcon />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Call Us</p>
                    <p className="font-semibold text-white">+92 300 1234567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-gray-300">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(43, 106, 255, 0.3)', color: '#60a5fa' }}>
                    <MailIcon />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email Us</p>
                    <p className="font-semibold text-white">info@zameen360.pk</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-gray-300">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(43, 106, 255, 0.3)', color: '#60a5fa' }}>
                    <MapPinIcon />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Visit Us</p>
                    <p className="font-semibold text-white">DHA Phase 6, Lahore</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                {['facebook', 'instagram', 'twitter', 'youtube'].map((social) => (
                  <button 
                    key={social} 
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2b6aff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                  >
                    <span className="text-xs font-bold uppercase">{social[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



// Main About Page Component
const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <DashboardNavbar />
      <HeroSection />
      <CompanyStory />
      <StatsSection />
      <MissionVision />
      <CoreValues />
      <ServicesSection />
      <WhyChooseUs />
      <TeamSection />
      <TimelineSection />
      <TestimonialsSection />
      <AreasSection />
      <PartnersSection />
      <CTASection />
      <Footer />

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/923001234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform z-50"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

// Scroll to Top Component
const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return isVisible ? (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors z-50"
      style={{ backgroundColor: '#2b6aff' }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4fd6'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2b6aff'}
    >
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  ) : null;
};

export default AboutPage;