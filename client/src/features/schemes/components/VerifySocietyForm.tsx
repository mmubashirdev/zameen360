import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { submitVerification } from "../../../api/scheme.api";

// File type helper
const fileSchema = z.any().optional();

const verifySocietySchema = z.object({
  // Society Info
  societyName: z.string().min(2, "Society name is required"),
  societyType: z.enum(["Residential", "Commercial", "Mixed Use"], { message: "Society type is required" }),
  city: z.string().min(2, "City is required"),
  areaSector: z.string().min(2, "Area / Sector is required"),
  address: z.string().min(5, "Complete address is required"),
  googleMapsLocation: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  officialEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  officialContact: z.string().min(10, "Contact number is required"),

  // Developer Info
  developerCompany: z.string().min(2, "Company name is required"),
  ownerName: z.string().min(2, "Owner/Rep name is required"),
  cnicNumber: z.string().min(13, "CNIC must be 13 digits"),
  designation: z.string().min(2, "Designation is required"),
  contactNumber: z.string().min(10, "Contact number is required"),
  emailAddress: z.string().email("Invalid email").min(1, "Email is required"),

  // Documents
  cnicFront: fileSchema,
  cnicBack: fileSchema,
  companyRegistration: fileSchema,
  ntnCertificate: fileSchema,
  authorityLetter: fileSchema,

  // NOC Status
  nocStatus: z.enum(["Approved", "Under Process", "Not Available"], { message: "NOC Status is required" }),
  approvingAuthority: z.enum(["LDA", "RDA", "CDA", "FDA", "MDA", "PHATA", "Other"], { message: "Approving authority is required" }),
  nocNumber: z.string().optional(),
  nocIssueDate: z.string().optional(),
  nocExpiryDate: z.string().optional(),

  // Upload Documents
  nocCopy: fileSchema,
  ownershipDocuments: fileSchema,
  fardRegistry: fileSchema,
  landTransfer: fileSchema,

  // Plot Information
  availablePlotSizes: z.array(z.string()).min(1, "Select at least one plot size"),
});

type VerifySocietyFormValues = z.infer<typeof verifySocietySchema>;

const PLOT_SIZES = ["3 Marla", "5 Marla", "7 Marla", "10 Marla", "1 Kanal", "2 Kanal", "Commercial Plots"];

const VerifySocietyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<VerifySocietyFormValues>({
    resolver: zodResolver(verifySocietySchema),
    defaultValues: {
      availablePlotSizes: [],
    },
  });

  const onSubmit = async (data: VerifySocietyFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append standard text/array fields
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;

        // Skip file lists, handle them below
        const fileFields = ["cnicFront", "cnicBack", "companyRegistration", "ntnCertificate", "authorityLetter", "nocCopy", "ownershipDocuments", "fardRegistry", "landTransfer"];
        if (fileFields.includes(key)) return;

        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });

      // Append file fields
      const appendFile = (fieldName: string, fileList: any) => {
        if (fileList && fileList.length > 0) {
          formData.append(fieldName, fileList[0]);
        }
      };

      appendFile("cnicFront", data.cnicFront);
      appendFile("cnicBack", data.cnicBack);
      appendFile("companyRegistration", data.companyRegistration);
      appendFile("ntnCertificate", data.ntnCertificate);
      appendFile("authorityLetter", data.authorityLetter);
      appendFile("nocCopy", data.nocCopy);
      appendFile("ownershipDocuments", data.ownershipDocuments);
      appendFile("fardRegistry", data.fardRegistry);
      appendFile("landTransfer", data.landTransfer);

      const response = await submitVerification(formData);
      
      if (response.success) {
        toast.success("Verification application submitted successfully!");
        reset();
      } else {
        toast.error(response.message || "Failed to submit application");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ label, name, type = "text", required = false, placeholder = "" }: any) => (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
      {errors[name as keyof VerifySocietyFormValues] && (
        <span className="text-xs text-red-500">{(errors[name as keyof VerifySocietyFormValues] as any)?.message}</span>
      )}
    </div>
  );

  const FileField = ({ label, name, required = false }: any) => {
    const fileList = watch(name as keyof VerifySocietyFormValues);
    let previewUrl = null;
    let fileName = null;
    
    if (fileList && (fileList as FileList).length > 0) {
      const file = (fileList as FileList)[0];
      fileName = file.name;
      if (file.type && file.type.startsWith("image/")) {
        previewUrl = URL.createObjectURL(file);
      }
    }

    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-md border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            Choose File
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              {...register(name)}
              className="hidden"
            />
          </label>
          <span className="text-sm text-gray-500 truncate max-w-[200px]">
            {fileName ? fileName : "No file chosen"}
          </span>
        </div>

        {previewUrl && (
          <div className="mt-3 relative inline-block">
            <img 
              src={previewUrl} 
              alt={`${label} Preview`} 
              className="max-h-40 object-contain rounded-md border border-gray-200 shadow-sm" 
            />
          </div>
        )}
        {errors[name as keyof VerifySocietyFormValues] && (
          <span className="text-xs text-red-500 mt-1">{(errors[name as keyof VerifySocietyFormValues] as any)?.message}</span>
        )}
      </div>
    );
  };

  const SelectField = ({ label, name, options, required = false }: any) => (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...register(name)}
        className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
      >
        <option value="">Select an option</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {errors[name as keyof VerifySocietyFormValues] && (
        <span className="text-xs text-red-500">{(errors[name as keyof VerifySocietyFormValues] as any)?.message}</span>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Housing Society Verification Form</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Information */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Society Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Housing Society Name" name="societyName" required />
            <SelectField label="Society Type" name="societyType" options={["Residential", "Commercial", "Mixed Use"]} required />
            <InputField label="City" name="city" required />
            <InputField label="Area / Sector" name="areaSector" required />
            <InputField label="Complete Address" name="address" required />
            <InputField label="Google Maps Location" name="googleMapsLocation" placeholder="https://maps.google.com/..." />
            <InputField label="Official Website" name="website" placeholder="https://..." />
            <InputField label="Official Email" name="officialEmail" type="email" />
            <InputField label="Official Contact Number" name="officialContact" required />
          </div>
        </section>

        {/* Developer Information */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-t pt-6">2. Developer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Developer Company Name" name="developerCompany" required />
            <InputField label="Owner / Authorized Representative Name" name="ownerName" required />
            <InputField label="CNIC Number" name="cnicNumber" required placeholder="XXXXX-XXXXXXX-X" />
            <InputField label="Designation" name="designation" required />
            <InputField label="Contact Number" name="contactNumber" required />
            <InputField label="Email Address" name="emailAddress" type="email" required />
          </div>
        </section>

        {/* Identification Documents */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-t pt-6">3. Identification Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileField label="CNIC Front" name="cnicFront" required />
            <FileField label="CNIC Back" name="cnicBack" required />
            <FileField label="Company Registration Certificate" name="companyRegistration" required />
            <FileField label="NTN Certificate" name="ntnCertificate" />
            <FileField label="Authority Letter (if representative)" name="authorityLetter" />
          </div>
        </section>

        {/* NOC Status */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-t pt-6">4. NOC Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField label="NOC Status" name="nocStatus" options={["Approved", "Under Process", "Not Available"]} required />
            <SelectField label="Approving Authority" name="approvingAuthority" options={["LDA", "RDA", "CDA", "FDA", "MDA", "PHATA", "Other"]} required />
            <InputField label="NOC Number" name="nocNumber" />
            <InputField label="NOC Issue Date" name="nocIssueDate" type="date" />
            <InputField label="NOC Expiry Date (if applicable)" name="nocExpiryDate" type="date" />
          </div>
        </section>

        {/* Legal & Ownership Documents */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-t pt-6">5. Legal & Ownership Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileField label="NOC Copy" name="nocCopy" required />
            <FileField label="Ownership Documents" name="ownershipDocuments" required />
            <FileField label="Fard / Registry Documents" name="fardRegistry" required />
            <FileField label="Land Transfer Documents" name="landTransfer" required />
          </div>
        </section>

        {/* Plot Information */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-t pt-6">6. Plot Information</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Available Plot Sizes <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PLOT_SIZES.map((size) => (
                <label key={size} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    value={size}
                    {...register("availablePlotSizes")}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  {size}
                </label>
              ))}
            </div>
            {errors.availablePlotSizes && (
              <span className="text-xs text-red-500">{errors.availablePlotSizes.message}</span>
            )}
          </div>
        </section>

        <div className="border-t pt-6 mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifySocietyForm;
