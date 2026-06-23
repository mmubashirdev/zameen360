import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVerificationById, updateVerificationStatus } from "../../../api/scheme.api";
import type { SocietyVerificationData } from "../../../api/scheme.api";
import toast from "react-hot-toast";

const AdminSocietyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<SocietyVerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("PENDING");
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const data = await getVerificationById(Number(id));
      if (data.success) {
        setApp(data.application);
        setStatus(data.application.status || "PENDING");
        setNotes(data.application.adminNotes || "");
      } else {
        toast.error("Application not found");
        navigate("/admin/societies");
      }
    } catch (error) {
      toast.error("Failed to load application details");
      navigate("/admin/societies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const data = await updateVerificationStatus(Number(id), { status, adminNotes: notes });
      if (data.success) {
        toast.success("Application updated successfully");
        fetchDetails(); // refresh
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      toast.error("An error occurred during update");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!app) return null;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  const getDocUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  const InfoRow = ({ label, value }: { label: string, value?: string | React.ReactNode }) => (
    <div className="py-3 flex border-b border-gray-100 last:border-0">
      <span className="w-1/3 text-sm font-medium text-gray-500">{label}</span>
      <span className="w-2/3 text-sm text-gray-900">{value || "-"}</span>
    </div>
  );

  const DocumentLink = ({ label, path }: { label: string, path?: string }) => {
    const url = getDocUrl(path);
    const [imgError, setImgError] = useState(false);

    if (!url) return <InfoRow label={label} value={<span className="text-gray-400 italic">Not provided</span>} />;

    // Check if it's definitely a PDF
    const isPdf = url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('application/pdf');

    return (
      <div className="py-4 border-b border-gray-100 last:border-0 flex flex-col sm:flex-row sm:items-start sm:gap-4">
        <span className="w-full sm:w-1/3 text-sm font-medium text-gray-500 mb-2 sm:mb-0 flex-shrink-0">{label}</span>
        <div className="flex-1">
          {!isPdf && !imgError ? (
            <button
              type="button"
              className="relative group inline-block cursor-zoom-in rounded-lg border border-gray-200 bg-gray-50 p-1 shadow-sm transition hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => setPreviewImage(url)}
              aria-label={`Preview ${label}`}
            >
              <img
                src={url}
                alt={label}
                className="h-32 w-auto max-w-xs object-contain rounded-md"
                onError={() => setImgError(true)}
              />
              <div className="absolute inset-1 rounded-md bg-black/0 transition-colors group-hover:bg-black/25 flex items-center justify-center">
                <svg className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </button>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              View Document
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative max-h-full max-w-5xl" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 rounded-full p-2 text-white hover:bg-white/10 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close preview"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <img src={previewImage} alt="Document preview" className="max-h-[85vh] max-w-full rounded bg-white object-contain" />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/societies")} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Application #{app.id}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Submitted: {new Date(app.createdAt || "").toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Society Information</h2>
            </div>
            <div className="px-6 py-2">
              <InfoRow label="Society Name" value={app.societyName} />
              <InfoRow label="Society Type" value={app.societyType} />
              <InfoRow label="City" value={app.city} />
              <InfoRow label="Area / Sector" value={app.areaSector} />
              <InfoRow label="Complete Address" value={app.address} />
              <InfoRow label="Google Maps" value={app.googleMapsLocation ? <a href={app.googleMapsLocation} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">View on Map</a> : "-"} />
              <InfoRow label="Website" value={app.website} />
              <InfoRow label="Official Email" value={app.officialEmail} />
              <InfoRow label="Official Contact" value={app.officialContact} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Developer Information</h2>
            </div>
            <div className="px-6 py-2">
              <InfoRow label="Developer Company" value={app.developerCompany} />
              <InfoRow label="Owner / Rep Name" value={app.ownerName} />
              <InfoRow label="CNIC Number" value={app.cnicNumber} />
              <InfoRow label="Designation" value={app.designation} />
              <InfoRow label="Contact Number" value={app.contactNumber} />
              <InfoRow label="Email Address" value={app.emailAddress} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">NOC & Plot Information</h2>
            </div>
            <div className="px-6 py-2">
              <InfoRow label="NOC Status" value={app.nocStatus} />
              <InfoRow label="Approving Authority" value={app.approvingAuthority} />
              <InfoRow label="NOC Number" value={app.nocNumber} />
              <InfoRow label="NOC Issue Date" value={app.nocIssueDate} />
              <InfoRow label="NOC Expiry Date" value={app.nocExpiryDate} />
              <InfoRow 
                label="Available Plot Sizes" 
                value={
                  <div className="flex flex-wrap gap-2 mt-1">
                    {app.availablePlotSizes.map(size => (
                      <span key={size} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">{size}</span>
                    ))}
                  </div>
                } 
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Uploaded Documents</h2>
            </div>
            <div className="px-6 py-2">
              <DocumentLink label="CNIC Front" path={app.cnicFront} />
              <DocumentLink label="CNIC Back" path={app.cnicBack} />
              <DocumentLink label="Company Registration" path={app.companyRegistration} />
              <DocumentLink label="NTN Certificate" path={app.ntnCertificate} />
              <DocumentLink label="Authority Letter" path={app.authorityLetter} />
              <DocumentLink label="NOC Copy" path={app.nocCopy} />
              <DocumentLink label="Ownership Documents" path={app.ownershipDocuments} />
              <DocumentLink label="Fard / Registry" path={app.fardRegistry} />
              <DocumentLink label="Land Transfer" path={app.landTransfer} />
            </div>
          </div>

        </div>

        {/* Right Column: Admin Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-6">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Admin Review</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3 bg-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes (Internal)</label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
                  placeholder="Leave notes about document verification, missing items, etc."
                />
              </div>

              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isUpdating ? "Saving..." : "Save Review"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSocietyDetails;
