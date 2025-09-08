import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Bell, 
  X, 
  Check, 
  MessageCircle, 
  FileText, 
  Calendar, 
  Shield,
  Users,
  AlertTriangle,
  Clock,
  Mail,
  CheckCircle
} from 'lucide-react';
import { LuxuryCard } from '@/components/luxury-cards';

type NotificationType = 'message' | 'document' | 'calendar' | 'security' | 'family' | 'reminder' | 'system';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  author?: {
    name: string;
    avatar?: string;
  };
};

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'message': return MessageCircle;
    case 'document': return FileText;
    case 'calendar': return Calendar;
    case 'security': return Shield;
    case 'family': return Users;
    case 'reminder': return Clock;
    case 'system': return AlertTriangle;
    default: return Bell;
  }
};

const getNotificationColor = (type: NotificationType, priority: string) => {
  if (priority === 'high') return 'text-red-400 bg-red-400/10';
  if (priority === 'medium') return 'text-[#D4AF37] bg-[#D4AF37]/10';
  
  switch (type) {
    case 'message': return 'text-blue-400 bg-blue-400/10';
    case 'document': return 'text-green-400 bg-green-400/10';
    case 'calendar': return 'text-purple-400 bg-purple-400/10';
    case 'security': return 'text-red-400 bg-red-400/10';
    case 'family': return 'text-[#D4AF37] bg-[#D4AF37]/10';
    default: return 'text-gray-400 bg-gray-400/10';
  }
};

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<{ top: number; right: number } | null>(null);
  const bellButtonRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
    refetchInterval: 30000, // Poll every 30 seconds
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark all as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const recentNotifications = notifications.slice(0, 5);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsReadMutation.mutate(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const calculateButtonPosition = () => {
    if (!bellButtonRef.current) return null;
    
    const rect = bellButtonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8, // 8px gap below button
      right: window.innerWidth - rect.right, // Distance from right edge
    };
  };

  const handleToggleNotifications = () => {
    if (!isOpen) {
      const position = calculateButtonPosition();
      setButtonPosition(position);
    }
    setIsOpen(!isOpen);
  };

  // Click outside and ESC to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Don't close if clicking the bell button or inside the notification panel
      if (
        bellButtonRef.current?.contains(target) ||
        target.closest('.notification-popover')
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Create the notification panel
  const notificationPanel = isOpen && buttonPosition && (
    <div
      role="dialog"
      aria-label="Notifications"
      className="notification-popover fixed w-96 max-h-[70vh] overflow-auto rounded-xl border border-[rgba(212,175,55,.25)] bg-[#0B0C0F] shadow-xl z-[110]"
      style={{
        top: `${buttonPosition.top}px`,
        right: `${buttonPosition.right}px`,
      }}
    >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold text-white">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsReadMutation.mutate()}
                className="text-xs text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors"
                data-testid="button-mark-all-read"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              data-testid="button-close-notifications"
            >
              <X className="h-4 w-4 text-white/70" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-white/60">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-white/60">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {recentNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                const colorClass = getNotificationColor(notification.type, notification.priority);
                
                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${!notification.read ? 'bg-white/2' : ''}`}
                    data-testid={`notification-${notification.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${colorClass}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium text-sm ${!notification.read ? 'text-white' : 'text-white/80'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#D4AF37] rounded-full flex-shrink-0" />
                          )}
                        </div>
                        
                        <p className={`text-sm ${!notification.read ? 'text-white/80' : 'text-white/60'} line-clamp-2`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-white/50">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.author && (
                            <span className="text-xs text-white/50">
                              {notification.author.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 5 && (
          <div className="p-3 border-t border-white/10 text-center">
            <button className="text-sm text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors">
              View all notifications
            </button>
          </div>
        )}
    </div>
  );

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        ref={bellButtonRef}
        onClick={handleToggleNotifications}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        data-testid="button-notifications"
      >
        <Bell className="h-5 w-5 text-white/70" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#D4AF37] text-black text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Render notification panel via portal */}
      {notificationPanel && createPortal(notificationPanel, document.body)}
    </div>
  );
}

export default NotificationCenter;