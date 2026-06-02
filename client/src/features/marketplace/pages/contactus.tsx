// App.tsx
import { useForm } from "react-hook-form";
import {
  Home,
  Phone,
  MessageCircle,
  Globe,
  Mail,
  MapPin,
  Clock,
  Headphones,
  User,

  Tag,
  Key,
  Users,
  MessageSquare,
  Navigation,
  Send,
  Shield,
  FileText,
} from "lucide-react";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer from "../components/Footer";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  propertyId: string;
  city: string;
  contactMethod: string;
  subject: string;
  message: string;
  interest: string;
  agree: boolean;
};

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      contactMethod: "email",
      interest: "",
    },
  });

  const message = watch("message", "");
  const contactMethod = watch("contactMethod");
  const interest = watch("interest");

  const onSubmit = (data: FormData) => {
    console.log(data);
    alert("Message sent!");
  };

  const interests = [
    { id: "buying", label: "Buying", sub: "Property", icon: Home },
    { id: "selling", label: "Selling", sub: "Property", icon: Tag },
    { id: "renting", label: "Renting", sub: "Property", icon: Key },
    { id: "agent", label: "Becoming", sub: "an Agent", icon: Users },
    { id: "general", label: "General", sub: "Inquiry", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-white">
      <DashboardNavbar />
      {/* Main Content */}
      <div className="px-8 py-10 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-3 gap-6">
          {/* Left + Center */}
          <div className="col-span-2">
            {/* Header */}
            <div className="relative mb-6">
              <p className="text-blue-600 text-xs font-semibold tracking-widest mb-2">
                GET IN TOUCH
              </p>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
              <p className="text-gray-500 max-w-md">
                We're here to help! Fill out the form and our team will get back to you
                within 24–48 hours.
              </p>
            </div>

            {/* Form */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Send Us a Message</h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Row 1 */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register("fullName", { required: true })}
                        placeholder="e.g., Ali"
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">Required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register("email", { required: true })}
                        type="email"
                        placeholder="e.g., Ali@gmail.com"
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">Required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register("phone")}
                        placeholder="e.g., +92 300 1234567"
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Inquiry Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("inquiryType", { required: true })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="">Select Inquiry Type</option>
                      <option value="buying">Buying</option>
                      <option value="selling">Selling</option>
                      <option value="renting">Renting</option>
                      <option value="general">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Property ID (Optional)
                    </label>
                    <div className="relative">
                      <Home className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register("propertyId")}
                        placeholder="e.g., PROP-2026-1234"
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      City / Location
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register("city")}
                        placeholder="e.g., Lahore"
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3 - Contact Method + Subject */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">
                      Preferred Contact Method
                    </label>
                    <div className="flex gap-6 py-2.5">
                      {["email", "phone", "whatsapp"].map((method) => (
                        <label key={method} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value={method}
                            {...register("contactMethod")}
                            className="w-4 h-4 accent-blue-600"
                          />
                          <span className="text-sm text-gray-700 capitalize">
                            {method === "whatsapp" ? "WhatsApp" : method}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register("subject", { required: true })}
                        placeholder="e.g., Property Listing Issue"
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      {...register("message", { required: true, maxLength: 2000 })}
                      placeholder="Please provide details of your inquiry..."
                      rows={5}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                    />
                    <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                      {message.length}/2000
                    </span>
                  </div>
                </div>

                {/* Interests */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-3">
                    Are you interested in?
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {interests.map((item) => {
                      const Icon = item.icon;
                      const active = interest === item.id;
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setValue("interest", item.id)}
                          className={`border rounded-lg p-3 flex items-center gap-2 text-left transition ${
                            active
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <Icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-gray-800 leading-tight">
                              {item.label}
                            </div>
                            <div className="text-xs text-gray-500 leading-tight">
                              {item.sub}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Privacy */}
                <div className="mb-5 flex items-start gap-2">
                  <input
                    type="checkbox"
                    {...register("agree", { required: true })}
                    className="mt-0.5 accent-blue-600"
                  />
                  <p className="text-xs text-gray-600">
                    I agree that Zameen 360 may contact me regarding my inquiry and I have
                    read the{" "}
                    <a href="#" className="text-blue-600">
                      Privacy Policy.
                    </a>
                  </p>
                </div>

                {/* Captcha mock */}
                <div className="mb-6">
                  <div className="border border-gray-200 rounded p-3 w-72 flex items-center gap-3 bg-gray-50">
                    <input type="checkbox" className="w-6 h-6" />
                    <span className="text-sm text-gray-700">I'm not a robot</span>
                    <div className="ml-auto text-center">
                      <div className="text-[10px] text-gray-400 leading-tight">
                        reCAPTCHA
                      </div>
                      <div className="text-[8px] text-gray-400">Privacy - Terms</div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Your information is secure and will never be shared with anyone.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            {/* Contact Information */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Contact Information</h3>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Support Email", value: "support@zameen360.com" },
                  { icon: Phone, label: "Phone", value: "0300-1234567" },
                  { icon: MessageCircle, label: "WhatsApp", value: "0300-1234567" },
                  { icon: Globe, label: "Website", value: "www.zameen360.com" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">{item.label}</div>
                        <div className="text-sm text-gray-800">{item.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Office Address */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Office Address</h3>
              </div>
              <p className="font-semibold text-gray-800 mb-2">Zameen360 (Pvt.) Ltd.</p>
              <p className="text-sm text-gray-600">
                2nd Floor, Arfa Software Technology Park,
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Ferozepur Road, Lahore, Punjab, Pakistan.
              </p>
              <button className="w-full bg-blue-50 text-blue-600 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-100">
                <Navigation className="w-4 h-4" />
                Get Directions
              </button>
            </div>

            {/* Working Hours */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Working Hours</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">We're available to help you</p>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Monday - Saturday</span>
                <span className="text-gray-800 font-medium">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-700">Sunday</span>
                <span className="text-gray-800 font-medium">Closed</span>
              </div>
              <p className="text-xs text-blue-600">* Response time: 24–48 hours</p>
            </div>

            {/* Need Help */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Headphones className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Need Immediate Help?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                For urgent assistance, please call or WhatsApp us directly.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-700">
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </button>
                <button className="bg-blue-50 text-blue-600 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-100">
                  <Phone className="w-4 h-4" />
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}