import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { submitVerification } from "../../../api/scheme.api";

const ACCEPTED_DOCUMENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;

const requiredText = (fieldName: string, min = 3, max = 120) =>
  z
    .string()
    .trim()
    .min(min, `${fieldName} must be at least ${min} characters`)
    .max(max, `${fieldName} must be at most ${max} characters`);

const numericString = (fieldName: string, minLength = 1, maxLength = 20, message?: string) =>
  z
    .string()
    .trim()
    .refine((value) => /^\d+$/.test(value), message || `${fieldName} must contain digits only`)
    .refine(
      (value) => value.length >= minLength && value.length <= maxLength,
      message || `${fieldName} must be between ${minLength} and ${maxLength} digits`,
    );

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((value) => !value || z.string().url().safeParse(value).success, "Must be a valid URL");

const optionalText = z.string().trim().optional().or(z.literal(""));
const dateString = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), "Please enter a valid date");

const hasFile = (value: unknown) =>
  Boolean(
    value &&
      typeof value === "object" &&
      "length" in value &&
      typeof value.length === "number" &&
      value.length > 0,
  );

const getFirstFile = (value: unknown): File | null => {
  if (!hasFile(value)) return null;
  const file = (value as FileList | File[])[0];
  return file instanceof File ? file : null;
};

const fileSchema = z
  .any()
  .optional()
  .refine((value) => {
    const file = getFirstFile(value);
    return !file || ACCEPTED_DOCUMENT_TYPES.includes(file.type);
  }, "Only JPG, PNG, WebP, PDF, DOC, or DOCX files are allowed")
  .refine((value) => {
    const file = getFirstFile(value);
    return !file || file.size <= MAX_DOCUMENT_SIZE;
  }, "File size must be 5MB or less");

const requiredFileSchema = fileSchema.refine(hasFile, "This document is required");

const plotSizeValues = ["3 Marla", "5 Marla", "7 Marla", "10 Marla", "1 Kanal", "2 Kanal", "Commercial Plots"] as const;
const plotSizeSchema = z.enum(plotSizeValues);

const verifySocietySchema = z
  .object({
    // Society Info
    societyName: requiredText("Society name"),
    societyType: z.enum(["Residential", "Commercial", "Mixed Use"], { message: "Society type is required" }),
    city: requiredText("City"),
    areaSector: requiredText("Area / Sector"),
    address: requiredText("Complete address", 5, 220),
    googleMapsLocation: optionalUrl,
    website: optionalUrl,
    officialEmail: z.string().trim().email("Invalid email").optional().or(z.literal("")),
    officialContact: numericString("Official contact number", 10, 15, "Official contact number must contain 10 to 15 digits only"),

    // Developer Info
    developerCompany: requiredText("Company name"),
    ownerName: requiredText("Owner / Representative name"),
    cnicNumber: numericString("CNIC number", 13, 13, "CNIC must contain exactly 13 digits only"),
    designation: requiredText("Designation"),
    contactNumber: numericString("Contact number", 11, 11, "Mobile number must be 11 digits and start with 03").refine(
      (value) => /^03\d{9}$/.test(value),
      "Mobile number must be 11 digits and start with 03",
    ),
    emailAddress: z.string().trim().min(1, "Email is required").email("Invalid email"),

    // Documents
    cnicFront: requiredFileSchema,
    cnicBack: requiredFileSchema,
    companyRegistration: requiredFileSchema,
    ntnCertificate: fileSchema,
    authorityLetter: fileSchema,

    // NOC Status
    nocStatus: z.enum(["Approved", "Under Process", "Not Available"], { message: "NOC Status is required" }),
    approvingAuthority: z.enum(["LDA", "RDA", "CDA", "FDA", "MDA", "PHATA", "Other"], { message: "Approving authority is required" }),
    nocNumber: optionalText,
    nocIssueDate: dateString,
    nocExpiryDate: dateString,

    // Upload Documents
    nocCopy: requiredFileSchema,
    ownershipDocuments: requiredFileSchema,
    fardRegistry: requiredFileSchema,
    landTransfer: requiredFileSchema,

    // Plot Information
    availablePlotSizes: z.array(plotSizeSchema).min(1, "Select at least one plot size"),
  })
  .superRefine((data, ctx) => {
    if ((data.nocStatus === "Approved" || data.nocStatus === "Under Process") && !data.nocNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nocNumber"],
        message: "NOC number is required when NOC status is approved or under process",
      });
    }

    if (data.nocIssueDate && data.nocExpiryDate && data.nocExpiryDate < data.nocIssueDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nocExpiryDate"],
        message: "NOC expiry date cannot be earlier than the issue date",
      });
    }
  });

type VerifySocietyFormValues = z.infer<typeof verifySocietySchema>;

const PLOT_SIZES = [...plotSizeValues];

// ─── Sub-components defined OUTSIDE the form to prevent remounting on re-render ─

const InputField = ({
  label,
  name,
  type = "text",
  required = false,
  placeholder = "",
  numericOnly = false,
  register,
  errors,
}: any) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      inputMode={numericOnly ? "numeric" : undefined}
      pattern={numericOnly ? "[0-9]*" : undefined}
      onKeyDown={(event) => {
        if (!numericOnly) return;
        const allowedKeys = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"];
        if (allowedKeys.includes(event.key)) return;
        if (/\d/.test(event.key)) return;
        event.preventDefault();
      }}
      onPaste={(event) => {
        if (!numericOnly) return;
        const pasted = event.clipboardData.getData("text");
        if (!/^\d*$/.test(pasted)) event.preventDefault();
      }}
      {...register(name)}
      placeholder={placeholder}
      className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    />
    {errors[name] && (
      <span className="text-xs text-red-500">{(errors[name] as any)?.message}</span>
    )}
  </div>
);

const FileField = ({ label, name, required = false, register, errors, watch }: any) => {
  const fileList = watch(name);
  let previewUrl: string | null = null;
  let fileName: string | null = null;

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
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
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
      {errors[name] && (
        <span className="text-xs text-red-500 mt-1">{(errors[name] as any)?.message}</span>
      )}
    </div>
  );
};

const SelectField = ({ label, name, options, required = false, register, errors }: any) => (
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
    {errors[name] && (
      <span className="text-xs text-red-500">{(errors[name] as any)?.message}</span>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

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
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    defaultValues: {
      availablePlotSizes: [],
    },
  });

  const onSubmit = async (data: VerifySocietyFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      const fileFields = [
        "cnicFront", "cnicBack", "companyRegistration", "ntnCertificate",
        "authorityLetter", "nocCopy", "ownershipDocuments", "fardRegistry", "landTransfer",
      ];

      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        if (fileFields.includes(key)) return;
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });

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
      toast.error(error.response?.data?.message || "An error occurred while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Housing Society Verification Form</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* 1. Society Information */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Society Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Housing Society Name" name="societyName" required register={register} errors={errors} />
            <SelectField label="Society Type" name="societyType" options={["Residential", "Commercial", "Mixed Use"]} required register={register} errors={errors} />
            <InputField label="City" name="city" required register={register} errors={errors} />
            <InputField label="Area / Sector" name="areaSector" required register={register} errors={errors} />
            <InputField label="Complete Address" name="address" required register={register} errors={errors} />
            <InputField label="Google Maps Location" name="googleMapsLocation" placeholder="https://maps.google.com/..." register={register} errors={errors} />
            <InputField label="Official Website" name="website" placeholder="https://..." register={register} errors={errors} />
            <InputField label="Official Email" name="officialEmail" type="email" register={register} errors={errors} />
            <InputField label="Official Contact Number" name="officialContact" required placeholder="Digits only" numericOnly register={register} errors={errors} />
          </div>
        </section>

        {/* 2. Developer Information */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-t pt-6">2. Developer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Developer Company Name" name="developerCompany" required register={register} errors={errors} />
            <InputField label="Owner / Authorized Representative Name" name="ownerName" required register={register} errors={errors} />
            <InputField label="CNIC Number" name="cnicNumber" required placeholder="13 digits only" numericOnly register={register} errors={errors} />
            <InputField label="Designation" name="designation" required register={register} errors={errors} />
            <InputField label="Contact Number" name="contactNumber" required placeholder="03XXXXXXXXX" numericOnly register={register} errors={errors} />
            <InputField label="Email Address" name="emailAddress" type="email" required register={register} errors={errors} />
          </div>
        </section>

        {/* 3. Identification Documents */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-t pt-6">3. Identification Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileField label="CNIC Front" name="cnicFront" required register={register} errors={errors} watch={watch} />
            <FileField label="CNIC Back" name="cnicBack" required register={register} errors={errors} watch={watch} />
            <FileField label="Company Registration Certificate" name="companyRegistration" required register={register} errors={errors} watch={watch} />
            <FileField label="NTN Certificate" name="ntnCertificate" register={register} errors={errors} watch={watch} />
            <FileField label="Authority Letter (if representative)" name="authorityLetter" register={register} errors={errors} watch={watch} />
          </div>
        </section>

        {/* 4. NOC Status */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-t pt-6">4. NOC Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField label="NOC Status" name="nocStatus" options={["Approved", "Under Process", "Not Available"]} required register={register} errors={errors} />
            <SelectField label="Approving Authority" name="approvingAuthority" options={["LDA", "RDA", "CDA", "FDA", "MDA", "PHATA", "Other"]} required register={register} errors={errors} />
            <InputField label="NOC Number" name="nocNumber" register={register} errors={errors} />
            <InputField label="NOC Issue Date" name="nocIssueDate" type="date" register={register} errors={errors} />
            <InputField label="NOC Expiry Date (if applicable)" name="nocExpiryDate" type="date" register={register} errors={errors} />
          </div>
        </section>

        {/* 5. Legal & Ownership Documents */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-t pt-6">5. Legal &amp; Ownership Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileField label="NOC Copy" name="nocCopy" required register={register} errors={errors} watch={watch} />
            <FileField label="Ownership Documents" name="ownershipDocuments" required register={register} errors={errors} watch={watch} />
            <FileField label="Fard / Registry Documents" name="fardRegistry" required register={register} errors={errors} watch={watch} />
            <FileField label="Land Transfer Documents" name="landTransfer" required register={register} errors={errors} watch={watch} />
          </div>
        </section>

        {/* 6. Plot Information */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-t pt-6">6. Plot Information</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Available Plot Sizes <span className="text-red-500">*</span>
            </label>
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
