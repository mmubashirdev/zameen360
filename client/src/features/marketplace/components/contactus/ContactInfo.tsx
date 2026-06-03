import {
  Phone,
  Mail,
  MessageCircle,
  Globe,
  MapPin,
  Send,
  Clock,
  Headphones,
} from "lucide-react";
import type { ReactNode } from "react";
import image from "../../../auth/assets/Gemini_Generated_Image_1092l1092l1092l1.png"

interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <div className="flex items-start gap-3">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-sm text-gray-900 font-medium">{value}</p>
    </div>
  </div>
);

const ContactInfo = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-blue-500 text-sm font-semibold tracking-wider uppercase mb-3">
          Get in Touch
        </p>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 text-base leading-relaxed max-w-md">
          We're here to help! Fill out the form and our team will get back to
          you within 24–48 hours.
        </p>
      </div>

      {/* Illustration */}
      <div className="py-4">
        <img
          src={image}
          alt="Building"
          className="w-full h-64 object-cover rounded-xl"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/600x300/EFF6FF/3B82F6?text=Building+Illustration";
          }}
        />
      </div>

      {/* Contact Information & Office Address */}
      <div className="grid grid-cols-2 gap-5">
        {/* Contact Information */}
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-50 p-2.5 rounded-full">
              <Phone className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="font-bold text-gray-900">Contact Information</h3>
          </div>

          <div className="space-y-4">
            <InfoItem
              icon={<Mail className="w-4 h-4 text-blue-500" />}
              label="Support Email"
              value="support@zameen360.com"
            />
            <InfoItem
              icon={<Phone className="w-4 h-4 text-blue-500" />}
              label="Phone"
              value="0300-1234567"
            />
            <InfoItem
              icon={<MessageCircle className="w-4 h-4 text-blue-500" />}
              label="WhatsApp"
              value="0300-1234567"
            />
            <InfoItem
              icon={<Globe className="w-4 h-4 text-blue-500" />}
              label="Website"
              value="www.zameen360.com"
            />
          </div>
        </div>

        {/* Office Address */}
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-50 p-2.5 rounded-full">
              <MapPin className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="font-bold text-gray-900">Office Address</h3>
          </div>

          <div className="space-y-2 mb-6">
            <p className="font-semibold text-gray-900 text-sm">
              Zameen360 (Pvt.) Ltd.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              2nd Floor, Arfa Software Technology Park,
              <br />
              Ferozepur Road, Lahore, Punjab, Pakistan.
            </p>
          </div>

          <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-500 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 text-sm">
            <Send className="w-4 h-4" />
            Get Directions
          </button>
        </div>
      </div>

      {/* Working Hours & Need Help */}
      <div className="grid grid-cols-2 gap-5">
        {/* Working Hours */}
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-50 p-2.5 rounded-full">
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="font-bold text-gray-900">Working Hours</h3>
          </div>

          <p className="text-gray-600 text-sm mb-4">
            We're available to help you
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Monday - Saturday</span>
              <span className="text-gray-900 font-medium">
                9:00 AM - 6:00 PM
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Sunday</span>
              <span className="text-gray-900 font-medium">Closed</span>
            </div>
          </div>

          <p className="text-blue-500 text-xs mt-5">
            * Response time: 24–48 hours
          </p>
        </div>

        {/* Need Immediate Help */}
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-50 p-2.5 rounded-full">
              <Headphones className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="font-bold text-gray-900">Need Immediate Help?</h3>
          </div>

          <p className="text-gray-600 text-sm mb-5 leading-relaxed">
            For urgent assistance, please call or WhatsApp us directly.
          </p>

          <div className="space-y-2.5">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm">
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </button>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm">
              <Phone className="w-4 h-4" />
              Call Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;