import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Phone,
  Home,
  MapPin,
  FileText,
  Send,
  Shield,
  Building,
  Tag,
  Key,
  UserCheck,
  MessageSquare,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  contactSchema,
  type ContactFormData,
} from "../contactus/contactSchema";

interface FormInputProps {
  label: string;
  required?: boolean;
  icon: ReactNode;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
}

const FormInput = ({
  label,
  required,
  icon,
  placeholder,
  register,
  error,
}: FormInputProps) => (
  <div>
    <label className="block text-sm font-semibold text-gray-900 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
      <input
        type="text"
        placeholder={placeholder}
        {...register}
        className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const ContactForm = () => {
  const [messageLength, setMessageLength] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      preferredContact: "email",
      interestedIn: [],
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log("Form submitted:", {
      ...data,
      interestedIn: selectedInterests,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Message sent successfully!");
    reset();
    setMessageLength(0);
    setSelectedInterests([]);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const interests = [
    { id: "buying", label: "Buying Property", icon: Home },
    { id: "selling", label: "Selling Property", icon: Tag },
    { id: "renting", label: "Renting Property", icon: Key },
    { id: "agent", label: "Becoming an Agent", icon: UserCheck },
    { id: "general", label: "General Inquiry", icon: MessageSquare },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-blue-500 mb-6">
        Send Us a Message
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name & Email */}
        <div className="grid grid-cols-2 gap-5">
          <FormInput
            label="Full Name"
            required
            icon={<User className="w-4 h-4 text-gray-400" />}
            placeholder="e.g., Ali"
            register={register("fullName")}
            error={errors.fullName?.message}
          />
          <FormInput
            label="Email Address"
            required
            icon={<Mail className="w-4 h-4 text-gray-400" />}
            placeholder="e.g., Ali@gmail.com"
            register={register("email")}
            error={errors.email?.message}
          />
        </div>

        {/* Phone & Inquiry Type */}
        <div className="grid grid-cols-2 gap-5">
          <FormInput
            label="Phone Number"
            icon={<Phone className="w-4 h-4 text-gray-400" />}
            placeholder="e.g., +92 300 1234567"
            register={register("phone")}
            error={errors.phone?.message}
          />
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Inquiry Type
            </label>
            <select
              {...register("inquiryType")}
              className={`w-full px-4 py-3 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.inquiryType ? "border-red-500" : "border-gray-200"
              }`}
            >
              <option value="">Select Inquiry Type</option>
              <option value="buying">Buying Property</option>
              <option value="selling">Selling Property</option>
              <option value="renting">Renting Property</option>
              <option value="agent">Agent Services</option>
              <option value="general">General Inquiry</option>
            </select>
            {errors.inquiryType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.inquiryType.message}
              </p>
            )}
          </div>
        </div>

        {/* Property ID & City */}
        <div className="grid grid-cols-2 gap-5">
          <FormInput
            label="Property ID (Optional)"
            icon={<Building className="w-4 h-4 text-gray-400" />}
            placeholder="e.g., PROP-2026-1234"
            register={register("propertyId")}
            error={errors.propertyId?.message}
          />
          <FormInput
            label="City / Location"
            icon={<MapPin className="w-4 h-4 text-gray-400" />}
            placeholder="e.g., Lahore"
            register={register("city")}
            error={errors.city?.message}
          />
        </div>

        {/* Preferred Contact Method */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Preferred Contact Method
          </label>
          <Controller
            name="preferredContact"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-4">
                {["email", "phone", "whatsapp"].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition ${
                      field.value === method
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      {...field}
                      value={method}
                      checked={field.value === method}
                      className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {method === "whatsapp" ? "WhatsApp" : method}
                    </span>
                  </label>
                ))}
              </div>
            )}
          />
          {errors.preferredContact && (
            <p className="text-red-500 text-xs mt-1">
              {errors.preferredContact.message}
            </p>
          )}
        </div>

        {/* Subject */}
        <FormInput
          label="Subject"
          required
          icon={<FileText className="w-4 h-4 text-gray-400" />}
          placeholder="e.g., Property Listing Issue"
          register={register("subject")}
          error={errors.subject?.message}
        />

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea
              {...register("message")}
              rows={5}
              maxLength={2000}
              placeholder="Please provide details of your inquiry..."
              onChange={(e) => setMessageLength(e.target.value.length)}
              className={`w-full px-4 py-3 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.message ? "border-red-500" : "border-gray-200"
              }`}
            />
            <span className="absolute bottom-3 right-3 text-xs text-gray-400">
              {messageLength}/2000
            </span>
          </div>
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Interested In */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Are you interested in?
          </label>
          <div className="grid grid-cols-5 gap-3">
            {interests.map((interest) => {
              const Icon = interest.icon;
              const isSelected = selectedInterests.includes(interest.id);
              return (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterest(interest.id)}
                  className={`flex flex-col items-start gap-2 p-3 border rounded-lg transition ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <Icon className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-700 text-left leading-tight">
                    {interest.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Privacy Policy Agreement */}
        <div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("agreePolicy")}
              className="mt-1 w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I agree that Zameen 360 may contact me regarding my inquiry and I
              have read the{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.agreePolicy && (
            <p className="text-red-500 text-xs mt-1">
              {errors.agreePolicy.message}
            </p>
          )}
        </div>

    

        {/* Submit Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold px-8 py-3 rounded-lg flex items-center gap-2 text-sm transition"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-4 h-4 text-blue-500" />
            Your information is secure and will never be shared with anyone.
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;