"use client";

import { useState } from "react";

const contactCards = [
  {
    icon: "📞",
    title: "Call Us",
    detail: "+92 51 111 927 926",
    sub: "Mon – Sat, 9am – 6pm",
    color: "#059669",
  },
  {
    icon: "✉️",
    title: "Email Us",
    detail: "info@zarzameen.pk",
    sub: "We reply within 24 hours",
    color: "#0284c7",
  },
  {
    icon: "📍",
    title: "Visit Us",
    detail: "F-5/1, Islamabad",
    sub: "Evacuee Trust Complex",
    color: "#7c3aed",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="py-20 px-4 text-center text-white"
        style={{
          background: "linear-gradient(135deg, #059669 0%, #0f172a 70%)",
        }}
      >
        <p className="text-sm uppercase tracking-widest font-semibold text-emerald-300 mb-3">
          Get In Touch
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Contact Zar Zameen
        </h1>
        <p className="text-emerald-100 max-w-xl mx-auto">
          Have a question about a property? Want to list your home? Our team is
          here to help you every step of the way.
        </p>
      </section>

      {/* Contact Cards */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {contactCards.map((card) => (
            <div
              key={card.title}
              className="bg-gray-50 rounded-2xl p-6 text-center flex flex-col items-center gap-3"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: card.color + "15" }}
              >
                {card.icon}
              </div>
              <h3 className="font-bold text-gray-900">{card.title}</h3>
              <p className="font-semibold text-sm" style={{ color: card.color }}>
                {card.detail}
              </p>
              <p className="text-xs text-gray-400">{card.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form & Map */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="text-center py-12">
                <p className="text-5xl mb-4">🎉</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-500 text-sm">
                  Thank you for reaching out. Our team will get back to you
                  within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "",
                      message: "",
                    });
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: "#059669" }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Muhammad Ali"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 0000000"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-800"
                  >
                    <option value="">Select a subject</option>
                    <option value="property-inquiry">Property Inquiry</option>
                    <option value="list-property">List My Property</option>
                    <option value="agent-inquiry">Agent Inquiry</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
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
                  Send Message →
                </button>
              </form>
            )}
          </div>

          {/* Map Placeholder */}
          <div className="flex flex-col gap-5">
            <div
              className="flex-1 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center min-h-64"
              style={{ backgroundColor: "#0f172a" }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 40px, #059669 40px, #059669 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #059669 40px, #059669 41px)",
                }}
              />
              <div className="relative text-center px-6">
                <p className="text-5xl mb-4">📍</p>
                <h3 className="text-white font-bold text-lg mb-2">Find Us</h3>
                <p className="text-gray-400 text-sm">
                  Evacuee Trust Complex
                  <br />
                  Agha Khan Road, F-5/1
                  <br />
                  Islamabad, Pakistan
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-5 py-2 rounded-lg text-sm font-semibold text-white border border-emerald-500 hover:bg-emerald-800 transition-colors"
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-3">🕐 Office Hours</h3>
              <div className="space-y-2 text-sm">
                {[
                  { day: "Monday – Friday", hours: "9:00 AM – 6:00 PM" },
                  { day: "Saturday", hours: "10:00 AM – 4:00 PM" },
                  { day: "Sunday", hours: "Closed" },
                ].map((row) => (
                  <div
                    key={row.day}
                    className="flex justify-between text-gray-600"
                  >
                    <span>{row.day}</span>
                    <span className="font-semibold text-gray-900">
                      {row.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
