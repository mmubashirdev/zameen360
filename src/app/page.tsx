import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import MortgageCalculator from "@/components/MortgageCalculator";
import { getFeaturedProperties } from "@/data/properties";

const stats = [
  { value: "50,000+", label: "Properties Listed" },
  { value: "15,000+", label: "Happy Families" },
  { value: "100+", label: "Cities Covered" },
  { value: "500+", label: "Verified Agents" },
];

const howItWorks = [
  {
    step: "01",
    icon: "🔍",
    title: "Search Property",
    description:
      "Use our powerful search to filter properties by city, type, purpose, and budget. Find your perfect match instantly.",
  },
  {
    step: "02",
    icon: "🏠",
    title: "Visit & Inspect",
    description:
      "Schedule a visit with our verified agents. Tour properties in person or via virtual 360° walkthroughs.",
  },
  {
    step: "03",
    icon: "🤝",
    title: "Close the Deal",
    description:
      "Our legal experts assist with documentation, verification, and a smooth handover so you can move in stress-free.",
  },
];

const propertyTypes = [
  { icon: "🏡", type: "House", count: 18200, color: "#059669" },
  { icon: "🏢", type: "Apartment", count: 12500, color: "#0284c7" },
  { icon: "🏪", type: "Commercial", count: 4800, color: "#7c3aed" },
  { icon: "📐", type: "Plot", count: 9100, color: "#d97706" },
];

const testimonials = [
  {
    name: "Asim Raza",
    city: "Lahore",
    rating: 5,
    quote:
      "Zar Zameen made finding our dream home so easy! Within a week we found a beautiful house in DHA that matched our budget perfectly. The agent was professional and responsive throughout.",
    avatar: "AR",
  },
  {
    name: "Nadia Farooq",
    city: "Karachi",
    rating: 5,
    quote:
      "I was skeptical at first, but the listings are genuine and up-to-date. I found a great apartment in Clifton through Zar Zameen and the whole process was transparent and stress-free.",
    avatar: "NF",
  },
  {
    name: "Khurram Shahid",
    city: "Islamabad",
    rating: 5,
    quote:
      "Best real estate portal in Pakistan, hands down. The mortgage calculator helped me plan my finances, and the agent I connected with was extremely knowledgeable about F-sector properties.",
    avatar: "KS",
  },
];

export default function HomePage() {
  const featured = getFeaturedProperties();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 py-28 md:py-40 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #059669 0%, #0f172a 70%)",
        }}
      >
        {/* decorative circles */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "#f59e0b", transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "#059669", transform: "translate(-30%, 30%)" }}
        />

        <p className="relative text-sm uppercase tracking-widest font-semibold text-emerald-300 mb-3">
          Pakistan&apos;s #1 Property Portal
        </p>
        <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
          Find Your{" "}
          <span style={{ color: "#f59e0b" }}>Dream Home</span>
          <br />
          in Pakistan
        </h1>
        <p className="relative text-lg text-emerald-100 mb-10 max-w-xl">
          <span className="font-semibold italic">Zar Zameen</span> – Apna Ghar
          Dhundein. Browse 50,000+ verified properties across all major cities.
        </p>

        <div className="relative w-full max-w-4xl">
          <SearchBar />
        </div>

        <div className="relative flex flex-wrap justify-center gap-6 mt-10 text-sm text-emerald-200">
          <span>✅ Verified Listings</span>
          <span>✅ No Hidden Fees</span>
          <span>✅ Trusted Agents</span>
          <span>✅ Free Registration</span>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#0f172a" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p
                  className="text-3xl font-extrabold"
                  style={{ color: "#f59e0b" }}
                >
                  {s.value}
                </p>
                <p className="text-sm text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Properties ───────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mb-2">
                Hand-Picked
              </p>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Featured Properties
              </h2>
            </div>
            <Link
              href="/properties"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: "#059669" }}
            >
              View All Properties →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mb-2">
            Simple Process
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <div key={i} className="relative flex flex-col items-center px-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-lg"
                  style={{ backgroundColor: "#f0fdf4" }}
                >
                  {item.icon}
                </div>
                <span
                  className="absolute top-0 right-6 text-6xl font-extrabold opacity-10 select-none"
                  style={{ color: "#059669" }}
                >
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Property Types ────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mb-2">
            Browse By
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-12">
            Property Types
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {propertyTypes.map((pt) => (
              <Link
                key={pt.type}
                href={`/properties?type=${pt.type}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 flex flex-col items-center gap-3 transition-all hover:scale-105 group"
              >
                <span className="text-4xl">{pt.icon}</span>
                <p className="font-bold text-gray-900 group-hover:text-emerald-700">
                  {pt.type}
                </p>
                <p className="text-sm text-gray-400">
                  {pt.count.toLocaleString()} listings
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mortgage Calculator ──────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mb-2">
              Plan Your Finances
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Mortgage Calculator
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Use our calculator to estimate your monthly loan repayment and
              plan your home purchase in Pakistan with confidence.
            </p>
          </div>
          <MortgageCalculator />
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ backgroundColor: "#f0fdf4" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600 mb-2">
              Happy Customers
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {"★".repeat(t.rating)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ backgroundColor: "#059669" }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section
        className="py-20 px-4 text-center"
        style={{
          background: "linear-gradient(135deg, #059669 0%, #0f172a 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to List Your Property?
          </h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Reach millions of potential buyers and renters across Pakistan. List
            your property on Zar Zameen today — it&apos;s free!
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-gray-900 text-base transition-all hover:scale-105"
            style={{ backgroundColor: "#f59e0b" }}
          >
            🏡 List Your Property Today
          </Link>
        </div>
      </section>
    </>
  );
}
