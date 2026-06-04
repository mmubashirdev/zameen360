import React, { useState } from 'react';
import { useUser } from './UserContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  title: string;
  company: string;
  location: string;
  joinDate: string;
  badge: string;
  about: string;
  specializations: string;
  languages: string;
  workingHours: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  profileImage: string | null;
  notificationCount: number;
}

const EditProfileModal: React.FC<Props> = ({ open, onClose }) => {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState<FormData>(user);

  if (!open) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateUser(formData);
    onClose();
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'joinDate', label: 'Joined', type: 'text' },
    { key: 'badge', label: 'Badge', type: 'text' },
    { key: 'specializations', label: 'Specializations', type: 'text' },
    { key: 'languages', label: 'Languages', type: 'text' },
    { key: 'workingHours', label: 'Working Hours', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'whatsapp', label: 'WhatsApp', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'website', label: 'Website', type: 'text' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-[16px] font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                {f.label}
              </label>
              <input
                type={f.type}
                value={(formData as any)[f.key] || ''}
                onChange={(e) => handleChange(f.key, e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}

          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">
              About Me
            </label>
            <textarea
              value={formData.about}
              onChange={(e) => handleChange('about', e.target.value)}
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-[13px] font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;