import ContactForm from '../components/contactus/ContactForm';
import ContactInfo from '../components/contactus/ContactInfo';
import TrustBadges from '../components/contactus/TrustBadges';
import SupportBanner from '../components/contactus/SupportBanner';
import DashboardNavbar from '../components/DashboardNavbar';
import Footer from '../components/Footer';

function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#EEF5FF] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-32 left-10 w-48 h-48 rounded-full bg-[#E6F0FF] pointer-events-none" />
      <div
        className="absolute top-20 right-10 w-32 h-32 pointer-events-none opacity-50"
        style={{
          backgroundImage: 'radial-gradient(#D7E5FF 2px, transparent 2px)',
          backgroundSize: '16px 16px',
        }}
      />

      <DashboardNavbar />

      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 text-[#0D6EFD] text-sm font-semibold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-[#0D6EFD] animate-pulse" />
            Contact Us
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#061A57]">
            We're Here to <span className="text-[#0D6EFD]">Help You</span>
          </h1>
          <p className="mt-6 text-[#475569] max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Whether you're buying, selling, or renting - our team of property
            experts is ready to guide you every step of the way across Pakistan.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <TrustBadges />
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <ContactInfo />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <SupportBanner />
      </section>

      <Footer />
    </div>
  );
}

export default ContactPage;
