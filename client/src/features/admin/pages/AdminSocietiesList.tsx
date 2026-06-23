import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllVerifications } from "../../../api/scheme.api";
import type { SocietyVerificationData } from "../../../api/scheme.api";
import toast from "react-hot-toast";

const AdminSocietiesList = () => {
  const [applications, setApplications] = useState<SocietyVerificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const data = await getAllVerifications();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Approved</span>;
      case "REJECTED":
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">Rejected</span>;
      case "UNDER_REVIEW":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">Under Review</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Pending</span>;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Society Verification Applications</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Society Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Developer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No applications found.</td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{app.societyName}</div>
                        <div className="text-xs text-gray-500">{app.societyType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.developerCompany}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.city}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(app.createdAt || "").toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/admin/societies/${app.id}`} className="text-blue-600 hover:text-blue-900">
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSocietiesList;
