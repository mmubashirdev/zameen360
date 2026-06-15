import { MessageCircle, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface Notification {
  id: number;
  type: "user" | "admin-shield" | "admin-mail";
  name: string;
  message: string;
  time: string;
  avatar?: string;
  isUnread: boolean;
}

interface NotificationDropdownProps {
  onClose?: () => void;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
}

const NotificationDropdown = ({
  onMarkAllRead,
  onViewAll,
}: NotificationDropdownProps) => {
  const notifications: Notification[] = [
    {
      id: 1,
      type: "user",
      name: "Ali Raza",
      message: "sent you a message about Bahria Sky Apartment.",
      time: "5 min ago",
      avatar: "https://i.pravatar.cc/80?img=12",
      isUnread: true,
    },
    {
      id: 2,
      type: "admin-shield",
      name: "Admin Message",
      message:
        'Your property listing "Modern Villa in Lahore" has been approved.',
      time: "1 hour ago",
      isUnread: true,
    },
    {
      id: 3,
      type: "user",
      name: "Sara Ahmed",
      message: "sent you a message regarding your property.",
      time: "3 hours ago",
      avatar: "https://i.pravatar.cc/80?img=5",
      isUnread: true,
    },
    {
      id: 4,
      type: "admin-mail",
      name: "Admin Message",
      message: "New features have been added to improve your experience.",
      time: "1 day ago",
      isUnread: false,
    },
  ];

  const renderIcon = (notification: Notification): ReactNode => {
    if (notification.type === "user") {
      return (
        <div className="relative shrink-0">
          <img
            src={notification.avatar}
            alt={notification.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1 rounded-full border-2 border-white">
            <MessageCircle className="w-3 h-3 text-white fill-white" />
          </div>
        </div>
      );
    }

    if (notification.type === "admin-shield") {
      return (
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-purple-500" />
        </div>
      );
    }

    return (
      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
        <Mail className="w-6 h-6 text-orange-400" />
      </div>
    );
  };

  return (
    <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
        <button
          onClick={onMarkAllRead}
          className="text-sm font-medium text-blue-500 hover:text-blue-600 transition"
        >
          Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-480px overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-3 px-6 py-4 hover:bg-gray-50 cursor-pointer transition"
          >
            {renderIcon(notification)}

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                {notification.name}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                {notification.message}
              </p>
              <p className="text-xs text-gray-400">{notification.time}</p>
            </div>

            {notification.isUnread && (
              <div className="shrink-0 mt-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full block" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4">
        <button
          onClick={onViewAll}
          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-500 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition"
        >
          View all notifications
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;