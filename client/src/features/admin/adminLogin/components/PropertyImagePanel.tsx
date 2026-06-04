// src/components/PropertyImagePanel.jsx
import { useState, useEffect } from "react";
import image1 from "../../../auth/assets/photo-1721815693498-cc28507c0ba2.avif";
import image2 from "../../../auth/assets/photo-1722421492323-eaf9c401befe.avif";
const PropertyImagePanel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      // Replace with your actual property images
      image: image1,
      title: "Find Your Sweet Home",
      subtitle: "Schedule visit just a few clicks, visit in just a few clicks",
    },
    {
      image: image2,
      title: "Your Dream Property",
      subtitle: "Browse thousands of listings at your fingertips",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-l-2xl">
      {/* Background Image with Transition */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0  from-black/70 via-black/20 to-transparent z-10" />


      {/* Bottom Content */}
      <div className="absolute bottom-12 left-8 right-8 z-20">
        <h2 className="text-white text-3xl font-bold mb-2 transition-all duration-500">
          {slides[currentSlide].title}
        </h2>
        <p className="text-white/80 text-sm max-w-md">
          {slides[currentSlide].subtitle}
        </p>

        {/* Slide Indicators */}
        <div className="flex items-center gap-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-8 h-2.5 bg-white"
                  : "w-2.5 h-2.5 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyImagePanel;
