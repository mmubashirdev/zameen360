// client/src/features/marketplace/pages/TermsOfService.tsx
import LegalLayout from "./Legallayout";

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "eligibility", title: "Eligibility" },
  { id: "account", title: "Account Responsibilities" },
  { id: "listings", title: "Property Listings" },
  { id: "prohibited", title: "Prohibited Activities" },
  { id: "virtual-tour", title: "3D Virtual Tour Policy" },
  { id: "payments", title: "Payments & Fees" },
  { id: "intellectual", title: "Intellectual Property" },
  { id: "disclaimer", title: "Disclaimers" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "termination", title: "Termination" },
  { id: "governing", title: "Governing Law" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact Us" },
];

const TermsOfService = () => {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="Please read these terms carefully before using Zameen 360."
      lastUpdated="June 15, 2025"
      sections={sections}
    >
      <div className="prose prose-gray max-w-none space-y-10 text-gray-700 text-[15px] leading-relaxed">

        {/* 1 */}
        <section id="acceptance">
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Zameen 360 ("Platform", "we", "us", or "our"), you agree to be
            bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may
            not use the Platform. These Terms apply to all visitors, registered users, property
            listers, buyers, renters, and agents who access or use our services.
          </p>
          <p className="mt-3">
            Your continued use of the Platform after any changes to these Terms constitutes your
            acceptance of the revised Terms. We recommend reviewing this page periodically.
          </p>
        </section>

        {/* 2 */}
        <section id="eligibility">
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Eligibility</h2>
          <p>
            You must be at least 18 years of age to create an account or list a property on Zameen
            360. By using the Platform, you represent and warrant that:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>You are at least 18 years old.</li>
            <li>You have the legal capacity to enter into a binding agreement.</li>
            <li>You are not prohibited by any applicable law from using the Platform.</li>
            <li>All information you provide is truthful, accurate, and current.</li>
          </ul>
        </section>

        {/* 3 */}
        <section id="account">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Account Responsibilities</h2>
          <p>
            When you register for an account, you are responsible for maintaining the confidentiality
            of your credentials and for all activities that occur under your account. You agree to:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Provide accurate and complete registration information.</li>
            <li>Keep your password secure and not share it with third parties.</li>
            <li>Notify us immediately at <a href="mailto:adminzameen360@gmail.com" className="text-blue-600 hover:underline">adminzameen360@gmail.com</a> of any unauthorized use of your account.</li>
            <li>Not create multiple accounts or impersonate another person or entity.</li>
          </ul>
          <p className="mt-3">
            Zameen 360 reserves the right to suspend or terminate your account if any information
            provided is found to be inaccurate, misleading, or in violation of these Terms.
          </p>
        </section>

        {/* 4 */}
        <section id="listings">
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Property Listings</h2>
          <p>
            Users who post properties on Zameen 360 ("Listers") are solely responsible for the
            accuracy and completeness of their listings. By posting a listing, you represent that:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>You are the lawful owner or authorized agent of the property being listed.</li>
            <li>All listing details, including price, location, area, and amenities, are accurate.</li>
            <li>Images and media uploaded belong to you or you have the right to use them.</li>
            <li>The property complies with all applicable local laws and regulations in Pakistan.</li>
          </ul>
          <p className="mt-3">
            Zameen 360 reserves the right to review, reject, or remove any listing that violates
            these Terms or that we determine, at our sole discretion, is inappropriate or fraudulent.
            All listings are subject to admin approval before going live on the platform.
          </p>
        </section>

        {/* 5 */}
        <section id="prohibited">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Prohibited Activities</h2>
          <p>You agree not to engage in any of the following activities:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Posting false, misleading, or fraudulent property listings.</li>
            <li>Using the Platform for any unlawful purpose or in violation of any regulations.</li>
            <li>Attempting to reverse-engineer, scrape, or copy any part of the Platform.</li>
            <li>Uploading malicious files, viruses, or harmful code.</li>
            <li>Harassing, threatening, or abusing other users or Zameen 360 staff.</li>
            <li>Using bots, automated scripts, or scraping tools on the Platform.</li>
            <li>Circumventing our listing approval process or admin workflows.</li>
            <li>Listing properties you do not own or are not authorized to sell or rent.</li>
          </ul>
          <p className="mt-3">
            Violation of any prohibited activity may result in immediate account termination and
            potential legal action.
          </p>
        </section>

        {/* 6 */}
        <section id="virtual-tour">
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. 3D Virtual Tour Policy</h2>
          <p>
            Zameen 360 offers a 3D Virtual Tour feature that allows users to upload 360° panoramic
            images of their properties. By uploading panoramic content, you agree to the following:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>
              All uploaded panorama images must be <strong>equirectangular</strong> (2:1 aspect ratio,
              minimum 2048px wide) and captured using a legitimate 360° camera or application.
            </li>
            <li>
              You must have the legal right to capture and publish the interior or exterior spaces
              shown in panoramic images, including consent from any occupants.
            </li>
            <li>
              Panoramic images must accurately represent the property — staging, editing, or
              misrepresenting a property through 3D tour content is prohibited.
            </li>
            <li>
              Zameen 360 is not responsible for the quality of third-party 3D tour links
              (e.g. Matterport) pasted by users.
            </li>
          </ul>
          <p className="mt-3">
            Any 3D tour content found to misrepresent a property will be removed and the account
            may be suspended.
          </p>
        </section>

        {/* 7 */}
        <section id="payments">
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Payments & Fees</h2>
          <p>
            Zameen 360 may offer both free and premium listing plans. By subscribing to any paid
            plan, you agree to pay all applicable fees as described at the time of purchase. All
            payments are processed securely and are non-refundable unless otherwise stated.
          </p>
          <p className="mt-3">
            We reserve the right to change our pricing plans at any time with reasonable notice
            provided to existing subscribers. Continued use of a paid feature after a price change
            constitutes acceptance of the new pricing.
          </p>
        </section>

        {/* 8 */}
        <section id="intellectual">
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Intellectual Property</h2>
          <p>
            All content on the Zameen 360 Platform — including logos, UI design, code, features,
            and branding — is the exclusive property of Zameen 360 and protected under applicable
            intellectual property laws. You may not reproduce, copy, distribute, or create
            derivative works without our express written permission.
          </p>
          <p className="mt-3">
            By uploading content (images, videos, 360° tours, descriptions) to the Platform,
            you grant Zameen 360 a non-exclusive, royalty-free, worldwide license to use, display,
            and distribute that content for the purpose of operating and improving the Platform.
          </p>
        </section>

        {/* 9 */}
        <section id="disclaimer">
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. Disclaimers</h2>
          <p>
            Zameen 360 is a listing platform and does not act as a real estate broker, agent,
            or legal advisor. We do not verify the ownership, legality, or accuracy of any listing.
            All transactions between buyers, sellers, renters, and agents are solely their
            responsibility.
          </p>
          <p className="mt-3">
            The Platform is provided "as is" and "as available" without warranties of any kind,
            either express or implied, including but not limited to merchantability, fitness for
            a particular purpose, or non-infringement.
          </p>
        </section>

        {/* 10 */}
        <section id="liability">
          <h2 className="text-xl font-bold text-gray-900 mb-3">10. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Zameen 360 and its affiliates, directors,
            employees, and partners shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising out of your use of, or inability to use,
            the Platform or any listing content thereon.
          </p>
        </section>

        {/* 11 */}
        <section id="termination">
          <h2 className="text-xl font-bold text-gray-900 mb-3">11. Termination</h2>
          <p>
            We reserve the right to suspend or permanently terminate your account at any time,
            without prior notice, if you violate these Terms or if we determine that your
            continued use poses a risk to the Platform or other users. Upon termination, your
            right to use the Platform ceases immediately.
          </p>
          <p className="mt-3">
            You may also delete your account at any time by contacting us at{" "}
            <a href="mailto:adminzameen360@gmail.com" className="text-blue-600 hover:underline">
              adminzameen360@gmail.com
            </a>
            . Certain data may be retained as required by law.
          </p>
        </section>

        {/* 12 */}
        <section id="governing">
          <h2 className="text-xl font-bold text-gray-900 mb-3">12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the
            Islamic Republic of Pakistan. Any disputes arising under these Terms shall be subject
            to the exclusive jurisdiction of the courts located in Lahore, Punjab, Pakistan.
          </p>
        </section>

        {/* 13 */}
        <section id="changes">
          <h2 className="text-xl font-bold text-gray-900 mb-3">13. Changes to Terms</h2>
          <p>
            Zameen 360 reserves the right to modify these Terms at any time. We will notify
            registered users of material changes via email or an in-app notification. The
            updated Terms will be effective immediately upon posting. Your continued use of the
            Platform after notification constitutes your acceptance of the updated Terms.
          </p>
        </section>

        {/* 14 */}
        <section id="contact">
          <h2 className="text-xl font-bold text-gray-900 mb-3">14. Contact Us</h2>
          <p>
            If you have questions, concerns, or complaints regarding these Terms, please contact
            our legal team:
          </p>
          <ul className="list-none mt-3 space-y-2">
            <li>📧 <a href="mailto:adminzameen360@gmail.com" className="text-blue-600 hover:underline">adminzameen360@gmail.com</a></li>
            <li>🏢 Zameen 360, Lahore, Punjab, Pakistan</li>
          </ul>
        </section>

      </div>
    </LegalLayout>
  );
};

export default TermsOfService;