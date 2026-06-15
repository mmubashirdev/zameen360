import React, { useState, useEffect } from 'react';
import { switchToSeller } from '../../../../api/buyer.api';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormErrors {
  companyName?: string;
  experience?: string;
  specialization?: string;
  aboutBusiness?: string;
  licenseNumber?: string;
}

const SwitchToSellerModal: React.FC<Props> = ({ open, onClose }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    companyName: '',
    experience: '',
    licenseNumber: '',
    specialization: '',
    aboutBusiness: '',
  });

  // Hide navbar when modal is open
  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open');
      const navbar = document.querySelector('.navbar-main') as HTMLElement;
      if (navbar) navbar.style.display = 'none';
    } else {
      document.body.classList.remove('modal-open');
      const navbar = document.querySelector('.navbar-main') as HTMLElement;
      if (navbar) navbar.style.display = '';
    }

    return () => {
      document.body.classList.remove('modal-open');
      const navbar = document.querySelector('.navbar-main') as HTMLElement;
      if (navbar) navbar.style.display = '';
    };
  }, [open]);

  if (!open) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // CNIC validation - only numbers, auto format, max 13 digits
  const handleCnicChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, '');
    const limited = numbersOnly.slice(0, 13);

    let formatted = limited;
    if (limited.length > 5) {
      formatted = limited.slice(0, 5) + '-' + limited.slice(5);
    }
    if (limited.length > 12) {
      formatted = limited.slice(0, 5) + '-' + limited.slice(5, 12) + '-' + limited.slice(12);
    }

    setFormData((prev) => ({ ...prev, licenseNumber: formatted }));

    if (limited.length > 0 && limited.length < 13) {
      setErrors((prev) => ({ ...prev, licenseNumber: `CNIC must be 13 digits (currently ${limited.length})` }));
    } else {
      setErrors((prev) => ({ ...prev, licenseNumber: undefined }));
    }
  };

  // Validate Step 1
  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    // Company Name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    } else if (formData.companyName.trim().length < 3) {
      newErrors.companyName = 'Company name must be at least 3 characters';
    } else if (formData.companyName.trim().length > 50) {
      newErrors.companyName = 'Company name must not exceed 50 characters';
    } else if (!/^[a-zA-Z0-9\s&.\-']+$/.test(formData.companyName)) {
      newErrors.companyName = 'Company name contains invalid characters';
    }

    // Experience validation
    if (!formData.experience) {
      newErrors.experience = 'Please select your experience';
    }

    // Specialization validation
    if (!formData.specialization) {
      newErrors.specialization = 'Please select your specialization';
    }

    // About Business validation
    if (!formData.aboutBusiness.trim()) {
      newErrors.aboutBusiness = 'Please tell us about your business';
    } else if (formData.aboutBusiness.trim().length < 20) {
      newErrors.aboutBusiness = 'Please provide at least 20 characters';
    } else if (formData.aboutBusiness.trim().length > 500) {
      newErrors.aboutBusiness = 'Maximum 500 characters allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 2
  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    const digits = formData.licenseNumber.replace(/\D/g, '');
    if (!formData.licenseNumber) {
      newErrors.licenseNumber = 'CNIC is required for verification';
    } else if (digits.length !== 13) {
      newErrors.licenseNumber = 'CNIC must be exactly 13 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    try {
      setSaving(true);
      setError(null);

      await switchToSeller(formData);

      setSuccess(true);

      setTimeout(() => {
        window.location.href = '/profile';
      }, 2000);
    } catch (err: any) {
      console.error('Switch error:', err);
      setError(err.response?.data?.message || 'Failed to switch to seller');
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
      style={{ zIndex: 999999 }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header - Blue Theme */}
        <div className="bg-blue-600 px-6 py-5 relative">
          <button
            onClick={onClose}
            disabled={saving}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">Become a Seller</h2>
              <p className="text-white/90 text-sm">Start listing your properties</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>1</div>
              <span className="text-sm font-medium">Business Info</span>
            </div>
            <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>2</div>
              <span className="text-sm font-medium">Verification</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="m-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-blue-800 mb-1">Congratulations!</h3>
            <p className="text-sm text-blue-700">You are now a Seller. Redirecting...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {!success && (
          <>
            {/* Step 1: Business Info */}
            {step === 1 && (
              <div className="p-6 space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-800">
                    Tell us about your business. All fields are required.
                  </p>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Company / Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    placeholder="e.g., Malik Properties"
                    maxLength={50}
                    className={`w-full bg-gray-50 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                      errors.companyName ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.companyName ? (
                    <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">{formData.companyName.length}/50 characters</p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    className={`w-full bg-gray-50 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                      errors.experience ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Select Experience</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  {errors.experience && (
                    <p className="text-xs text-red-600 mt-1">{errors.experience}</p>
                  )}
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => handleChange('specialization', e.target.value)}
                    className={`w-full bg-gray-50 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                      errors.specialization ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Select Specialization</option>
                    <option value="Residential">Residential Properties</option>
                    <option value="Commercial">Commercial Properties</option>
                    <option value="Both">Both Residential & Commercial</option>
                    <option value="Plots">Plots & Land</option>
                    <option value="Rental">Rental Properties</option>
                  </select>
                  {errors.specialization && (
                    <p className="text-xs text-red-600 mt-1">{errors.specialization}</p>
                  )}
                </div>

                {/* About Business */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    About Your Business <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.aboutBusiness}
                    onChange={(e) => handleChange('aboutBusiness', e.target.value)}
                    rows={3}
                    placeholder="Describe your business, services, and experience (minimum 20 characters)..."
                    maxLength={500}
                    className={`w-full bg-gray-50 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none ${
                      errors.aboutBusiness ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.aboutBusiness ? (
                    <p className="text-xs text-red-600 mt-1">{errors.aboutBusiness}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">{formData.aboutBusiness.length}/500 characters (min 20)</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Verification */}
            {step === 2 && (
              <div className="p-6 space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-800">
                    Provide your CNIC for identity verification
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    CNIC Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => handleCnicChange(e.target.value)}
                    placeholder="35202-1234567-8"
                    maxLength={15}
                    className={`w-full bg-gray-50 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                      errors.licenseNumber ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    }`}
                  />
                  {errors.licenseNumber ? (
                    <p className="text-xs text-red-600 mt-1">{errors.licenseNumber}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your 13-digit CNIC number (Format: XXXXX-XXXXXXX-X)
                    </p>
                  )}
                </div>

                {/* Benefits */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Seller Benefits:</h4>
                  <ul className="space-y-2 text-xs text-gray-700">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>List unlimited properties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Get inquiries from buyers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Access seller analytics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Boost listings for more visibility</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between gap-2">
              {step === 1 ? (
                <button
                  onClick={onClose}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={handleBack}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
              )}

              {step < 2 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Converting...
                    </>
                  ) : (
                    'Become a Seller'
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SwitchToSellerModal;