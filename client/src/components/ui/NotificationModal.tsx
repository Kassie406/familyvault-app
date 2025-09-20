import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell, X, Check, FileText, Users, Shield, Heart } from "lucide-react";

interface Notification {
  id: number;
  user: string;
  avatar?: string;
  action: string;
  time: string;
  type: 'file' | 'request' | 'activity' | 'system';
  file?: {
    name: string;
    size: string;
    type: 'image' | 'document' | 'csv';
  };
  request?: boolean;
  category?: string;
  unread?: boolean;
}

interface NotificationModalProps {
  className?: string;
}

export default function NotificationModal({ className = "" }: NotificationModalProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'mentions'>('all');
  const modalRef = useRef<HTMLDivElement>(null);

  // Sample notifications - replace with real data
  const notifications: Notification[] = [
    {
      id: 1,
      user: "Caitlyn",
      action: "shared two files in Family Documents",
      time: "2 hours ago",
      type: 'file',
      category: "Design",
      file: {
        name: "Insurance_Policy_2024.pdf",
        size: "240 KB",
        type: 'document'
      },
      unread: true
    },
    {
      id: 2,
      user: "Marco",
      action: "requested access to Family Passwords",
      time: "6 hours ago",
      type: 'request',
      category: "Security",
      request: true,
      unread: true
    },
    {
      id: 3,
      user: "Florence",
      action: "added a new file in Family Finance",
      time: "6 hours ago",
      type: 'file',
      category: "Finance",
      file: {
        name: "Tax_Documents_2024.csv",
        size: "2 MB",
        type: 'csv'
      },
      unread: false
    },
    {
      id: 4,
      user: "System",
      action: "Emergency contact information updated",
      time: "8 hours ago",
      type: 'system',
      category: "ICE",
      unread: false
    },
    {
      id: 5,
      user: "Zahra",
      action: "completed 6 items in Family Checklist",
      time: "8 hours ago",
      type: 'activity',
      category: "Tasks",
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'document': return '📄';
      case 'csv': return '📊';
      default: return '📎';
    }
  };

  const getUserAvatar = (user: string) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    const colorIndex = user.length % colors.length;
    return (
      <div className={`w-8 h-8 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white text-sm font-medium`}>
        {user.charAt(0).toUpperCase()}
      </div>
    );
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Security': return <Shield className="w-4 h-4 text-[#D4AF37]" />;
      case 'Finance': return <FileText className="w-4 h-4 text-[#D4AF37]" />;
      case 'ICE': return <Heart className="w-4 h-4 text-red-500" />;
      case 'Tasks': return <Check className="w-4 h-4 text-green-500" />;
      default: return <Users className="w-4 h-4 text-[#D4AF37]" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (activeTab) {
      case 'verified': return notification.type === 'system' || notification.category === 'Security';
      case 'mentions': return notification.action.includes('requested') || notification.action.includes('shared');
      default: return true;
    }
  });

  const markAllAsRead = () => {
    // TODO: Implement mark all as read functionality
    console.log('Mark all as read');
  };

  const handleAccept = (notificationId: number) => {
    // TODO: Implement accept functionality
    console.log('Accept notification:', notificationId);
  };

  const handleDecline = (notificationId: number) => {
    // TODO: Implement decline functionality
    console.log('Decline notification:', notificationId);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        data-testid="button-notifications"
      >
        <Bell className="h-5 w-5 text-white/70" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Modal */}
      {open && createPortal(
        <div 
          ref={modalRef}
          className="fixed top-16 right-6 w-96 bg-[var(--bg-900)] text-white shadow-xl rounded-xl border border-[var(--line-700)] overflow-hidden z-[9999]"
          style={{
            background: 'linear-gradient(135deg, #161616 0%, #0F0F0F 100%)',
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[var(--line-700)] flex justify-between items-center">
            <h3 className="font-semibold text-lg text-white">Your Notifications</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={markAllAsRead}
                className="text-sm text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors"
              >
                Mark all as read
              </button>
              <button 
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 py-2 border-b border-[var(--line-700)] flex gap-4">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'verified', label: 'Verified', count: notifications.filter(n => n.type === 'system' || n.category === 'Security').length },
              { key: 'mentions', label: 'Mentions', count: notifications.filter(n => n.action.includes('requested') || n.action.includes('shared')).length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`text-sm px-2 py-1 rounded transition-colors ${
                  activeTab === tab.key 
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10' 
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {tab.label} {tab.count > 0 && <span className="ml-1 text-xs">({tab.count})</span>}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-white/60">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-[var(--line-800)] hover:bg-white/5 transition-colors ${
                    notification.unread ? 'bg-white/[0.02]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getUserAvatar(notification.user)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {notification.unread && (
                          <div className="w-2 h-2 bg-[#D4AF37] rounded-full flex-shrink-0"></div>
                        )}
                        {getCategoryIcon(notification.category)}
                      </div>
                      
                      <p className="text-sm text-white">
                        <span className="font-semibold text-[#D4AF37]">{notification.user}</span>{" "}
                        {notification.action}
                      </p>
                      
                      <p className="text-xs text-white/60 mt-1 flex items-center gap-2">
                        {notification.time}
                        {notification.category && (
                          <>
                            <span>•</span>
                            <span>{notification.category}</span>
                          </>
                        )}
                      </p>

                      {/* File Preview */}
                      {notification.file && (
                        <div className="mt-2 p-2 bg-[var(--line-800)] rounded-md text-xs border border-[var(--line-700)]">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{getFileIcon(notification.file.type)}</span>
                            <div>
                              <div className="text-white font-medium">{notification.file.name}</div>
                              <div className="text-white/60">{notification.file.size}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {notification.request && (
                        <div className="mt-3 flex gap-2">
                          <button 
                            onClick={() => handleAccept(notification.id)}
                            className="px-3 py-1.5 rounded-md bg-[#D4AF37] text-black font-medium hover:bg-[#D4AF37]/80 transition-colors text-sm"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleDecline(notification.id)}
                            className="px-3 py-1.5 rounded-md bg-[var(--line-700)] text-white hover:bg-[var(--line-600)] transition-colors text-sm"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-[var(--line-700)] flex justify-between items-center">
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 rounded-md bg-[#D4AF37] text-black font-medium hover:bg-[#D4AF37]/80 transition-colors text-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
