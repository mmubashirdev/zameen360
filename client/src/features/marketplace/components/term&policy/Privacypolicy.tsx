// client/src/features/marketplace/pages/PrivacyPolicy.tsx
import LegalLayout from "./Legallayout";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "data-collect", title: "Data We Collect" },
  { id: "how-we-use", title: "How We Use Your Data" },
  { id: "data-sharing", title: "Data Sharing" },
  { id: "cookies", title: "Cookies & Tracking" },
  { id: "media-uploads", title: "Media & Image Uploads" },
  { id: "security", title: "Data Security" },
  { id: "retention", title: "Data Retention" },
  { id: "rights", title: "Your Rights" },
  { id: "children", title: "Children's Privacy" },
  { id: "third-party", title: "Third-Party Links" },
  { id: "changes", title: "Changes to Policy" },
  { id: "contact", title: "Contact Us" },
];

const PrivacyPolicy = () => {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="Your privacy matters to us. Here's exactly how we handle your data."
      lastUpdated="June 15, 2025"
      sections={sections}
    >
      <div className="prose prose-gray max-w-none space-y-10 text-gray-700 text-[15px] leading-relaxed">

        {/* 1 */}
        <section id="overview">
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Overview</h2>
          <p>
            Zameen 360 ("we", "us", "our") is committed to protecting your personal information.
            This Privacy Policy explains what data we collect, why we collect it, how we use it,
            and what choices you have. It applies to all users of the Zameen 360 platform,
            including visitors, registered users, property listers, and buyers.
          </p>
          <p className="mt-3">
            By using Zameen 360, you consent to the practices described in this Policy. If you
            do not agree with any part of this Policy, please discontinue use of the Platform.
          </p>
        </section>

        {/* 2 */}
        <section id="data-collect">
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Data We Collect</h2>
          <p>We collect the following categories of information:</p>

          <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">A. Information You Provide</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account data:</strong> Full name, email address, phone number, city, password (hashed).</li>
            <li><strong>Profile data:</strong> Profile picture, seller details, verification documents.</li>
            <li><strong>Listing data:</strong> Property title, description, price, area, images, videos, 360° panoramas, floor plans, location coordinates.</li>
            <li><strong>Communication data:</strong> Messages sent between buyers and sellers through our messaging system.</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">B. Automatically Collected Data</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Device data:</strong> Browser type, operating system, IP address, device identifiers.</li>
            <li><strong>Usage data:</strong> Pages visited, search queries, time on page, clicks, and referral URLs.</li>
            <li><strong>Location data:</strong> Approximate location inferred from IP, or precise location if you permit it for property mapping features.</li>
          </ul>

          <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">C. Third-Party Data</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>If you sign in using Google or another OAuth provider, we receive your name, email, and profile picture from that provider.</li>
          </ul>
        </section>

        {/* 3 */}
        <section id="how-we-use">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Data</h2>
          <p>We use collected data for the following purposes:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Creating and managing your account and authentication (JWT-based sessions).</li>
            <li>Processing and displaying your property listings on the Platform.</li>
            <li>Enabling communication between buyers and sellers via our messaging system.</li>
            <li>Sending transactional emails (OTP verification, listing status, inquiry alerts) via Nodemailer.</li>
            <li>Improving search results, recommendations, and platform features.</li>
            <li>Detecting and preventing fraud, fake listings, and platform abuse.</li>
            <li>Complying with legal obligations under Pakistani law.</li>
            <li>Sending optional performance notifications if you opted in during listing.</li>
          </ul>
        </section>

        {/* 4 */}
        <section id="data-sharing">
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Sharing</h2>
          <p>
            We do not sell your personal data. We may share your information in the following
            limited circumstances:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>
              <strong>With other users:</strong> Your name, profile photo, and contact info may
              be visible to other users when you post a listing or send a message.
            </li>
            <li>
              <strong>With service providers:</strong> We use Cloudinary for media storage, and
              may use email and analytics providers. These partners process data only as instructed
              by us under strict confidentiality agreements.
            </li>
            <li>
              <strong>Legal compliance:</strong> We may disclose your data if required by law,
              court order, or government authority in Pakistan.
            </li>
            <li>
              <strong>Business transfer:</strong> In the event of a merger, acquisition, or sale,
              user data may be transferred as part of that transaction.
            </li>
          </ul>
        </section>

        {/* 5 */}
        <section id="cookies">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookies & Tracking</h2>
          <p>
            Zameen 360 uses cookies and similar technologies to maintain your session, remember
            preferences, and analyze Platform usage. Types of cookies we use:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Essential cookies:</strong> Required for authentication and core functionality (e.g. keeping you logged in).</li>
            <li><strong>Analytics cookies:</strong> Help us understand how users interact with the Platform (page views, clicks, errors).</li>
            <li><strong>Preference cookies:</strong> Store settings like city filters or saved searches.</li>
          </ul>
          <p className="mt-3">
            You can disable cookies in your browser settings, but doing so may affect Platform
            functionality such as staying logged in.
          </p>
        </section>

        {/* 6 */}
        <section id="media-uploads">
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Media & Image Uploads</h2>
          <p>
            Property images, videos, floor plans, and 360° panoramic images uploaded to Zameen 360
            are stored securely on Cloudinary, our third-party media storage provider. By uploading
            media, you acknowledge:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Uploaded media may be publicly visible as part of your property listing.</li>
            <li>360° panoramic images are processed in-browser using Three.js and are not stored on our servers until you submit the listing.</li>
            <li>We do not use your uploaded property images for training AI models or for any purpose beyond displaying and managing your listing.</li>
            <li>Deleted listings result in removal of associated media from our CDN within 30 days.</li>
          </ul>
        </section>

        {/* 7 */}
        <section id="security">
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Passwords are hashed using <strong>bcrypt</strong> and never stored in plain text.</li>
            <li>All sessions are managed using signed <strong>JWT tokens</strong> with expiry.</li>
            <li>All API communications are transmitted over <strong>HTTPS</strong>.</li>
            <li>Database access is restricted to authorized server processes only.</li>
            <li>Media files are stored on Cloudinary's secure CDN with access controls.</li>
          </ul>
          <p className="mt-3">
            Despite these measures, no system is 100% secure. In the event of a data breach,
            we will notify affected users within a reasonable timeframe as required by applicable law.
          </p>
        </section>

        {/* 8 */}
        <section id="retention">
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Data Retention</h2>
          <p>
            We retain your personal data for as long as your account is active or as needed to
            provide the Platform's services. Specifically:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Account data is retained until you request account deletion.</li>
            <li>Listing data is retained for 90 days after a listing expires or is removed.</li>
            <li>Message history is retained for 12 months after the conversation ends.</li>
            <li>Activity logs may be retained for up to 2 years for fraud prevention.</li>
          </ul>
        </section>

        {/* 9 */}
        <section id="rights">
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. Your Rights</h2>
          <p>You have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Correction:</strong> Update inaccurate or incomplete data through your profile settings.</li>
            <li><strong>Deletion:</strong> Request deletion of your account and associated data.</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing or performance notification emails at any time.</li>
            <li><strong>Data portability:</strong> Request your listing and profile data in a portable format.</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email us at{" "}
            <a href="mailto:adminzameen360@gmail.com" className="text-blue-600 hover:underline">
              adminzameen360@gmail.com
            </a>.
            We will respond within 30 days.
          </p>
        </section>

        {/* 10 */}
        <section id="children">
          <h2 className="text-xl font-bold text-gray-900 mb-3">10. Children's Privacy</h2>
          <p>
            Zameen 360 is not intended for users under the age of 18. We do not knowingly collect
            personal information from minors. If we discover that a minor has registered on the
            Platform, we will delete their account and associated data immediately. If you believe
            a minor has provided us with personal data, please contact us at{" "}
            <a href="mailto:adminzameen360@gmail.com" className="text-blue-600 hover:underline">
              adminzameen360@gmail.com
            </a>.
          </p>
        </section>

        {/* 11 */}
        <section id="third-party">
          <h2 className="text-xl font-bold text-gray-900 mb-3">11. Third-Party Links</h2>
          <p>
            The Platform may contain links to third-party websites (e.g. YouTube video previews,
            Matterport 3D tour links). These sites have their own privacy policies, and we are not
            responsible for their content or data practices. We encourage you to review the privacy
            policies of any third-party site you visit from our Platform.
          </p>
        </section>

        {/* 12 */}
        <section id="changes">
          <h2 className="text-xl font-bold text-gray-900 mb-3">12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices
            or legal requirements. When we make significant changes, we will notify you via email
            or an in-app banner. The date at the top of this page reflects when the Policy was
            last revised. Continued use of the Platform after any changes constitutes your
            acceptance of the revised Policy.
          </p>
        </section>

        {/* 13 */}
        <section id="contact">
          <h2 className="text-xl font-bold text-gray-900 mb-3">13. Contact Us</h2>
          <p>
            For any privacy-related questions, data requests, or concerns, please contact us:
          </p>
          <ul className="list-none mt-3 space-y-2">
            <li>📧 <a href="mailto:adminzameen360@gmail.com" className="text-blue-600 hover:underline">adminzameen360@gmail.com</a></li>
            <li>🏢 Zameen 360, Lahore, Punjab, Pakistan</li>
          </ul>
          <p className="mt-3">
            We are committed to resolving privacy concerns promptly and transparently.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
};

export default PrivacyPolicy;