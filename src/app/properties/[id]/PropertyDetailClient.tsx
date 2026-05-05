"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getRelatedProperties } from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/types";

interface PropertyDetailClientProps {
  property: Property;
}

export default function PropertyDetailClient({
  property,
}: PropertyDetailClientProps) {
  const [activeTab, setActiveTab] = useState<"description" | "features">(
    "description"
  );
  const [activeImg, setActiveImg] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: `Hi, I am interested in "${property.title}". Please get in touch with me.`,
  });
  const [submitted, setSubmitted] = useState(false);

  const related = getRelatedProperties(property.id, 3);

  const handleForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 py-3 px-4">
        <div className="max-w-7xl mx-auto text-sm text-gray-500 flex gap-2 items-center">
          <Link href="/" className="hover:text-emerald-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-emerald-600">
            Properties
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium line-clamp-1">
            {property.title}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column */}
          <div className="flex-1 min-w-0">
            {/* Hero Image */}
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-3">
              <Image
                src={property.images[activeImg]}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 65vw"
                priority
              />
              <span
                className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white rounded-full ${
                  property.purpose === "Rent" ? "bg-blue-600" : "bg-emerald-600"
                }`}
              >
                For {property.purpose}
              </span>
            </div>

            {/* Thumbnail Gallery */}
            {property.images.length > 1 && (
              <div className="flex gap-2 mb-6">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImg === i
                        ? "border-emerald-500"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`View ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Price */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">
                  {property.title}
                </h1>
                <p className="text-gray-500 flex items-center gap-1 mt-1">
                  <span>📍</span> {property.address}, {property.city}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-3xl font-extrabold text-emerald-700">
                  {property.priceLabel}
                </p>
                <p className="text-sm text-gray-400">{property.type}</p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 rounded-2xl p-5 mb-6">
              {property.bedrooms > 0 && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {property.bedrooms}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">🛏 Bedrooms</p>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {property.bathrooms}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">🚿 Bathrooms</p>
                </div>
              )}
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {property.area.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">📐 Sq. Ft.</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {property.yearBuilt}
                </p>
                <p className="text-xs text-gray-500 mt-1">🏗 Year Built</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1 w-fit">
              {(["description", "features"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "description" && (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                <p>{property.description}</p>
              </div>
            )}
            {activeTab === "features" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700"
                  >
                    <span className="text-emerald-500">✓</span> {f}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column – Agent Card */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                Contact Agent
              </h3>

              {/* Agent Info */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 rounded-full overflow-hidden relative flex-shrink-0">
                  <Image
                    src={property.agent.avatar}
                    alt={property.agent.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {property.agent.name}
                  </p>
                  <p className="text-xs text-gray-500">Verified Agent</p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    {property.agent.phone}
                  </p>
                </div>
              </div>

              {submitted ? (
                <div className="text-center py-6">
                  <p className="text-4xl mb-2">✅</p>
                  <p className="font-semibold text-gray-800">Inquiry Sent!</p>
                  <p className="text-sm text-gray-500 mt-1">
                    The agent will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleForm}
                    placeholder="Your Name"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleForm}
                    placeholder="Your Phone"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleForm}
                    placeholder="Your Email"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleForm}
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-white text-sm transition-colors"
                    style={{ backgroundColor: "#059669" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#047857")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#059669")
                    }
                  >
                    Send Inquiry
                  </button>
                </form>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-emerald-600 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition-colors"
                >
                  📞 Call Agent
                </a>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  ✉️ Email Agent
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        <div className="mt-16">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            Related Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
