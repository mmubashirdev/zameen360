// import Header from "./Header";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";
import ContactInfo from "../components/contactus/ContactInfo";
import ContactForm from "../components/contactus/ContactForm";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <DashboardNavbar />
      <main className="max-w-1500px mx-auto px-8 py-12">
        <div className="grid grid-cols-2 gap-12">
          <ContactInfo />
          <ContactForm />
          
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;