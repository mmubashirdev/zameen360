const teamMembers = [
  {
    name: "Imran Tariq",
    role: "Founder & CEO",
    bio: "With over 20 years in Pakistan's real estate industry, Imran founded Zar Zameen to bring transparency and trust to property transactions across the country.",
    avatar: "IT",
    emoji: "👔",
  },
  {
    name: "Sana Baig",
    role: "Chief Operations Officer",
    bio: "Sana leads our nationwide operations, overseeing a network of 500+ verified agents and ensuring every listing on Zar Zameen meets our quality standards.",
    avatar: "SB",
    emoji: "👩‍💼",
  },
  {
    name: "Hamza Rehman",
    role: "Head of Technology",
    bio: "Hamza drives the digital innovation at Zar Zameen, building cutting-edge tools that make property search intuitive, fast, and reliable for millions of users.",
    avatar: "HR",
    emoji: "💻",
  },
];

const values = [
  {
    icon: "🛡️",
    title: "Verified Listings",
    description:
      "Every property on Zar Zameen undergoes a rigorous verification process. We confirm ownership documents, physical inspections, and agent credentials.",
  },
  {
    icon: "💡",
    title: "Transparent Pricing",
    description:
      "No hidden fees, no inflated prices. We display actual market values and facilitate honest negotiations between buyers and sellers.",
  },
  {
    icon: "🤝",
    title: "Dedicated Support",
    description:
      "Our team of real estate experts is available 6 days a week to guide you through every step of buying, selling, or renting a property.",
  },
  {
    icon: "📱",
    title: "Technology-First",
    description:
      "From virtual tours to AI-powered recommendations and our mortgage calculator, we leverage technology to make real estate accessible to everyone.",
  },
];

const stats = [
  { value: "2015", label: "Founded" },
  { value: "50K+", label: "Active Listings" },
  { value: "15K+", label: "Happy Families" },
  { value: "500+", label: "Verified Agents" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="py-24 px-4 text-center text-white"
        style={{
          background: "linear-gradient(135deg, #059669 0%, #0f172a 70%)",
        }}
      >
        <p className="text-sm uppercase tracking-widest font-semibold text-emerald-300 mb-3">
          Our Story
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-5">
          About Zar Zameen
        </h1>
        <p className="text-emerald-100 max-w-2xl mx-auto text-lg leading-relaxed">
          We started with a simple belief: finding your dream home in Pakistan
          should be easy, trustworthy, and stress-free. Since 2015, Zar Zameen
          has been fulfilling that promise for millions of Pakistanis.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-3">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To democratise access to real estate in Pakistan by providing a
              transparent, technology-driven platform where buyers, sellers, and
              renters can connect with confidence. We empower Pakistanis to make
              informed property decisions with data, trust, and expert guidance.
            </p>
          </div>
          <div
            className="rounded-2xl p-8 text-white"
            style={{ backgroundColor: "#059669" }}
          >
            <div className="text-4xl mb-4">🌟</div>
            <h2 className="text-xl font-extrabold mb-3">Our Vision</h2>
            <p className="leading-relaxed opacity-90">
              To become South Asia&apos;s most trusted real estate ecosystem —
              connecting every Pakistani family with their perfect home,
              wherever they are. We envision a Pakistan where property ownership
              is accessible, fair, and celebrated by all.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ backgroundColor: "#0f172a" }} className="py-14 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p
                className="text-4xl font-extrabold"
                style={{ color: "#f59e0b" }}
              >
                {s.value}
              </p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mb-2">
              Why Us
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why Choose Zar Zameen?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-gray-50 rounded-2xl p-6 flex gap-5"
              >
                <span className="text-3xl shrink-0">{v.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4" style={{ backgroundColor: "#f0fdf4" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mb-2">
              The People
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Meet Our Leadership
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl shadow-sm p-6 text-center"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-extrabold mx-auto mb-4"
                  style={{ backgroundColor: "#059669" }}
                >
                  {member.avatar}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {member.name}
                </h3>
                <p className="text-sm font-semibold text-emerald-600 mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
