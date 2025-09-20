import { MessageCircle, ImageIcon, Calendar, ShieldAlert } from 'lucide-react';

interface QuickActionsPillsProps {
  onSendMessage?: () => void;
  onUploadPhotos?: () => void;
  onCreateEvent?: () => void;
  onEmergencyInfo?: () => void;
}

export function QuickActionsPills({
  onSendMessage,
  onUploadPhotos,
  onCreateEvent,
  onEmergencyInfo
}: QuickActionsPillsProps) {
  const actions = [
    {
      id: 'send-message',
      title: 'Send Message',
      icon: MessageCircle,
      onClick: onSendMessage,
      tooltip: 'Start a private message with family'
    },
    {
      id: 'upload-photos',
      title: 'Upload Photos',
      icon: ImageIcon,
      onClick: onUploadPhotos,
      tooltip: 'Add photos to your family album'
    },
    {
      id: 'create-event',
      title: 'Create Event',
      icon: Calendar,
      onClick: onCreateEvent,
      tooltip: 'Add to family calendar'
    },
    {
      id: 'emergency-info',
      title: 'Emergency Info',
      icon: ShieldAlert,
      onClick: onEmergencyInfo,
      tooltip: 'Quick access to critical info'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <div key={action.id} className="relative group">
          <button
            onClick={action.onClick}
            className="qa-pill w-full flex items-center gap-3 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
            aria-describedby={`${action.id}-tip`}
            data-testid={`quick-action-${action.id}`}
          >
            <div className="p-2 rounded-lg bg-[#D4AF37]/10">
              <action.icon className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-medium text-gray-200">{action.title}</h4>
            </div>
          </button>
          
          {/* Tooltip */}
          <span 
            id={`${action.id}-tip`} 
            role="tooltip" 
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
          >
            {action.tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </span>
        </div>
      ))}
    </div>
  );
}
