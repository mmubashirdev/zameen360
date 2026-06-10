// client/src/features/marketplace/pages/PropertySubmitted.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  Shield,
  FileCheck,
  Home,
  ArrowRight,
  Bell,
  Mail,
  Phone,
  HelpCircle,
} from "lucide-react";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";
import styles from "../styles/PropertySubmitted.module.css";

// ✅ Confetti colors defined outside component
const CONFETTI_COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

// ✅ Confetti item type
interface ConfettiItem {
  id: number;
  left: string;
  animationDelay: string;
  animationDuration: string;
  backgroundColor: string;
}

// ✅ Generate confetti data ONCE using useMemo — never during render
const generateConfetti = (count: number): ConfettiItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.floor(Math.random() * 100)}%`,
    animationDelay: `${(Math.random() * 3).toFixed(2)}s`,
    animationDuration: `${(2 + Math.random() * 3).toFixed(2)}s`,
    backgroundColor:
      CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  }));

const PropertySubmitted: React.FC = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  // ✅ Generate once on mount — stable across re-renders
  const confettiItems = useMemo(() => generateConfetti(50), []);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      icon: <FileCheck size={22} />,
      title: "Property Submitted",
      description: "Your listing has been received successfully",
      status: "completed" as const,
    },
    {
      icon: <Shield size={22} />,
      title: "Document Verification",
      description: "Our team is reviewing your property documents",
      status: "active" as const,
    },
    {
      icon: <CheckCircle2 size={22} />,
      title: "Admin Approval",
      description: "Admin will verify property details and images",
      status: "pending" as const,
    },
    {
      icon: <Home size={22} />,
      title: "Published & Live",
      description: "Your property will be visible to all users",
      status: "pending" as const,
    },
  ];

  const faqs = [
    {
      question: "How long does the review process take?",
      answer:
        "Our team typically reviews and approves properties within 24-48 hours during business days.",
    },
    {
      question: "What if my property is rejected?",
      answer:
        "You'll receive an email with the reason. You can edit the listing and resubmit for review.",
    },
    {
      question: "Can I edit my listing while it's under review?",
      answer:
        "Yes, you can edit your listing anytime from your dashboard. Editing will restart the review process.",
    },
    {
      question: "Will I be notified when it's approved?",
      answer:
        "Yes! You'll receive an email, SMS, and in-app notification once your property is approved.",
    },
  ];


  return (
    <div className={styles.page}>
      <DashboardNavbar />

      {/* ✅ Confetti — rendered from pre-generated stable data */}
      {showConfetti && (
        <div className={styles.confettiContainer}>
          {confettiItems.map((item) => (
            <div
              key={item.id}
              className={styles.confetti}
              style={{
                left: item.left,
                animationDelay: item.animationDelay,
                animationDuration: item.animationDuration,
                backgroundColor: item.backgroundColor,
              }}
            />
          ))}
        </div>
      )}

      <main className={styles.main}>
        {/* ── Hero Section ── */}
        <div className={styles.hero}>
          <div className={styles.iconCircle}>
            <div className={styles.iconInner}>
              <Clock size={40} color="#2563eb" />
            </div>
            <div className={styles.pulseRing} />
            <div className={styles.pulseRing2} />
          </div>

          <h1 className={styles.title}>Property Submitted Successfully!</h1>
          <p className={styles.subtitle}>
            Your property listing is now under review. Our team will verify your
            documents and property details before publishing.
          </p>

          
        </div>

        {/* ── Timeline / Progress ── */}
        <div className={styles.timelineCard}>
          <h2 className={styles.sectionTitle}>Review Progress</h2>
          <p className={styles.sectionSub}>
            Track the status of your property listing
          </p>

          <div className={styles.timeline}>
            {steps.map((step, idx) => (
              <div key={idx} className={styles.timelineStep}>
                {idx < steps.length - 1 && (
                  <div
                    className={`${styles.connector} ${
                      step.status === "completed"
                        ? styles.connectorDone
                        : styles.connectorPending
                    }`}
                  />
                )}

                <div
                  className={`${styles.stepIcon} ${
                    step.status === "completed"
                      ? styles.stepDone
                      : step.status === "active"
                        ? styles.stepActive
                        : styles.stepPending
                  }`}
                >
                  {step.status === "completed" ? (
                    <CheckCircle2 size={22} />
                  ) : (
                    step.icon
                  )}
                </div>

                <div className={styles.stepText}>
                  <h4
                    className={
                      step.status === "active"
                        ? styles.stepTitleActive
                        : step.status === "completed"
                          ? styles.stepTitleDone
                          : styles.stepTitlePending
                    }
                  >
                    {step.title}
                  </h4>
                  <p className={styles.stepDesc}>{step.description}</p>
                  {step.status === "active" && (
                    <span className={styles.activeBadge}>
                      <span className={styles.dot} />
                      In Progress
                    </span>
                  )}
                  {step.status === "completed" && (
                    <span className={styles.doneBadge}>Completed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Info Cards ── */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon} style={{ background: "#eff6ff" }}>
              <Clock size={24} color="#2563eb" />
            </div>
            <h3>Estimated Review Time</h3>
            <p className={styles.infoHighlight}>24 – 48 Hours</p>
            <p className={styles.infoDesc}>
              During business days (Mon–Sat, 9AM–6PM)
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon} style={{ background: "#f0fdf4" }}>
              <Bell size={24} color="#16a34a" />
            </div>
            <h3>You'll Be Notified</h3>
            <div className={styles.notifyList}>
              <div className={styles.notifyItem}>
                <Mail size={14} /> Email notification
              </div>
              <div className={styles.notifyItem}>
                <Phone size={14} /> SMS alert
              </div>
              <div className={styles.notifyItem}>
                <Bell size={14} /> In-app notification
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon} style={{ background: "#fefce8" }}>
              <HelpCircle size={24} color="#ca8a04" />
            </div>
            <h3>What Happens Next?</h3>
            <ul className={styles.nextList}>
              <li>Our team reviews your documents</li>
              <li>Property images are verified</li>
              <li>Listing goes live upon approval</li>
            </ul>
          </div>
        </div>

        {/* ── Tips While You Wait ── */}
        <div className={styles.tipsCard}>
          <h2 className={styles.sectionTitle}>💡 Tips While You Wait</h2>
          <div className={styles.tipsGrid}>
            {[
              {
                num: "01",
                title: "Complete Your Profile",
                desc: "A verified profile with photo builds trust and gets 3x more inquiries.",
              },
              {
                num: "02",
                title: "Prepare Documents",
                desc: "Keep ownership documents ready. Admin may request verification during review.",
              },
              {
                num: "03",
                title: "Set Competitive Price",
                desc: "Research similar properties in your area to ensure your pricing attracts buyers.",
              },
              {
                num: "04",
                title: "Share Your Listing",
                desc: "Once approved, share on WhatsApp, Facebook, and social media for faster results.",
              },
            ].map((tip) => (
              <div key={tip.num} className={styles.tip}>
                <span className={styles.tipNum}>{tip.num}</span>
                <h4>{tip.title}</h4>
                <p>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ Section ── */}
        <div className={styles.faqCard}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <details key={i} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{faq.question}</summary>
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className={styles.actionButtons}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/buy")}
          >
            <Home size={18} />
            Browse Properties
          </button>
          <button
            className={styles.secondaryBtn}
            onClick={() => navigate("/post-property")}
          >
            Post Another Property
            <ArrowRight size={18} />
          </button>
        </div>

        {/* ── Support ── */}
        <div className={styles.supportCard}>
          <Shield size={20} color="#2563eb" />
          <div>
            <p className={styles.supportTitle}>Need Help?</p>
            <p className={styles.supportDesc}>
              Contact our support team at{" "}
              <a href="mailto:support@zameen360.com">support@zameen360.com</a>{" "}
              or call <a href="tel:+923001234567">0300-1234567</a> for any
              queries about your listing.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertySubmitted;
