import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useUser } from './UserContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  phone: string;
  city: string;
  bio: string;
  whatsappNumber: string;
  address: string;
  gender: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

// Zod validation schema for seller profile
const sellerProfileSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Full name can only contain letters and spaces'),
  phone: z.string()
    .refine((val) => !val || /^\d{11}$/.test(val.replace(/\s/g, '')), 'Phone number must be exactly 11 digits')
    .optional()
    .or(z.literal('')),
  whatsappNumber: z.string()
    .refine((val) => !val || /^\d{11}$/.test(val.replace(/\s/g, '')), 'WhatsApp number must be exactly 11 digits')
    .optional()
    .or(z.literal('')),
  city: z.string()
    .refine((val) => !val || val.length > 0, 'Please select a city')
    .optional()
    .or(z.literal('')),
  address: z.string()
    .max(100, 'Address must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  gender: z.string()
    .refine((val) => !val || ['MALE', 'FEMALE', 'OTHER'].includes(val), 'Invalid gender selection')
    .optional()
    .or(z.literal('')),
  bio: z.string()
    .max(500, 'Bio must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

const EditProfileModal: React.FC<Props> = ({ open, onClose }) => {
  const { user, updateUser } = useUser();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    city: '',
    bio: '',
    whatsappNumber: '',
    address: '',
    gender: '',
  });

  useEffect(() => {
    if (user && open) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        city: user.city || '',
        bio: user.bio || '',
        whatsappNumber: user.whatsappNumber || '',
        address: user.address || '',
        gender: user.gender || '',
      });
      setError(null);
      setSuccess(false);
      setFieldErrors({});
    }
  }, [user, open]);

  if (!open) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (fieldErrors[field as keyof FormData]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormData];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setFieldErrors({});

      // Validate using Zod schema
      const validationResult = sellerProfileSchema.safeParse(formData);

      if (!validationResult.success) {
        const errors: FormErrors = {};
        validationResult.error.issues.forEach((error: any) => {
          const field = error.path[0] as keyof FormData;
          if (field) {
            errors[field] = error.message;
          }
        });
        setFieldErrors(errors);
        setError('Please fix the errors above');
        return;
      }

      // Only send fields that have values
      const dataToSend: any = {};
      if (formData.fullName) dataToSend.fullName = formData.fullName;
      if (formData.phone) dataToSend.phone = formData.phone;
      if (formData.city) dataToSend.city = formData.city;
      if (formData.bio) dataToSend.bio = formData.bio;
      if (formData.whatsappNumber) dataToSend.whatsappNumber = formData.whatsappNumber;
      if (formData.address) dataToSend.address = formData.address;
      if (formData.gender) dataToSend.gender = formData.gender;

      await updateUser(dataToSend);

      setSuccess(true);
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Pakistan cities
  const cities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
    'Hyderabad', 'Bahawalpur', 'Other'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-[16px] font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-[13px] text-green-700 font-medium">Profile updated successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-[13px] text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              className={`w-full bg-gray-50 border rounded-lg px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent ${
                fieldErrors.fullName 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-blue-500'
              }`}
            />
            {fieldErrors.fullName && (
              <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586l-6.687-6.687a1 1 0 00-1.414 1.414l7.778 7.778a1.5 1.5 0 002.04.017l8.404-8.42z" clipRule="evenodd" />
                </svg>
                {fieldErrors.fullName}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value.replace(/[^\d]/g, ''))}
              placeholder="+92 300 1234567"
              className={`w-full bg-gray-50 border rounded-lg px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent ${
                fieldErrors.phone 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-blue-500'
              }`}
            />
            {fieldErrors.phone && (
              <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586l-6.687-6.687a1 1 0 00-1.414 1.414l7.778 7.778a1.5 1.5 0 002.04.017l8.404-8.42z" clipRule="evenodd" />
                </svg>
                {fieldErrors.phone}
              </p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">
              WhatsApp Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.whatsappNumber}
              onChange={(e) => handleChange('whatsappNumber', e.target.value.replace(/[^\d]/g, ''))}
              placeholder="+92 300 1234567"
              className={`w-full bg-gray-50 border rounded-lg px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent ${
                fieldErrors.whatsappNumber 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-blue-500'
              }`}
            />
            {fieldErrors.whatsappNumber && (
              <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586l-6.687-6.687a1 1 0 00-1.414 1.414l7.778 7.778a1.5 1.5 0 002.04.017l8.404-8.42z" clipRule="evenodd" />
                </svg>
                {fieldErrors.whatsappNumber}
              </p>
            )}
          </div>

          {/* City Dropdown */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">
              City
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className={`w-full bg-gray-50 border rounded-lg px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent ${
                fieldErrors.city 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-blue-500'
              }`}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {fieldErrors.city && (
              <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586l-6.687-6.687a1 1 0 00-1.414 1.414l7.778 7.778a1.5 1.5 0 002.04.017l8.404-8.42z" clipRule="evenodd" />
                </svg>
                {fieldErrors.city}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="House #, Street, Area"
              className={`w-full bg-gray-50 border rounded-lg px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent ${
                fieldErrors.address 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-blue-500'
              }`}
            />
            {fieldErrors.address && (
              <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586l-6.687-6.687a1 1 0 00-1.414 1.414l7.778 7.778a1.5 1.5 0 002.04.017l8.404-8.42z" clipRule="evenodd" />
                </svg>
                {fieldErrors.address}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className={`w-full bg-gray-50 border rounded-lg px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent ${
                fieldErrors.gender 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-blue-500'
              }`}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {fieldErrors.gender && (
              <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586l-6.687-6.687a1 1 0 00-1.414 1.414l7.778 7.778a1.5 1.5 0 002.04.017l8.404-8.42z" clipRule="evenodd" />
                </svg>
                {fieldErrors.gender}
              </p>
            )}
          </div>

          {/* Bio / About Me */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">
              About Me / Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={3}
              placeholder="Tell us about yourself..."
              className={`w-full bg-gray-50 border rounded-lg px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                fieldErrors.bio 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-blue-500'
              }`}
            />
            {fieldErrors.bio && (
              <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586l-6.687-6.687a1 1 0 00-1.414 1.414l7.778 7.778a1.5 1.5 0 002.04.017l8.404-8.42z" clipRule="evenodd" />
                </svg>
                {fieldErrors.bio}
              </p>
            )}
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">
              Email <span className="text-gray-400 text-[10px]">(cannot be changed)</span>
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !formData.fullName}
            className="px-4 py-2 text-[13px] font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;