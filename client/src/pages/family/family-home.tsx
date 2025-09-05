import { useState, useRef } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  Users, FileText, MessageCircle, Calendar, Image as ImageIcon, Shield,
  Heart, Clock, Star, Bell, Plus, ArrowRight, Activity,
  Inbox, AlarmClock, CreditCard, Home as HomeIcon, Key, 
  Umbrella, Receipt, Scale, Building2, BookOpen, 
  Phone, DollarSign, Upload, ShieldAlert,
  UserPlus, Mail, Settings, Share, Camera, FolderOpen, AlertCircle
} from 'lucide-react';
import { 
  ActionCard, 
  ToolCard, 
  AnnouncementCard, 
  ActivityTimeline 
} from '@/components/luxury-cards';
import { StatCard } from '@/components/StatCard';
import { InviteFamilyMemberDialog } from '@/components/InviteFamilyMemberDialog';
import QuickDocumentUpload from '@/components/upload/QuickDocumentUpload';
import QuickPhotoUpload from '@/components/upload/QuickPhotoUpload';
import { FamilyMessaging } from '@/components/messaging/FamilyMessaging';

export default function FamilyHome() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [highlightDocumentUpload, setHighlightDocumentUpload] = useState(false);
  
  // Ref for the upload center section
  const uploadCenterRef = useRef<HTMLDivElement>(null);

  // Fetch family stats from API
  const { data: familyData, isLoading: statsLoading } = useQuery<{
    totalMembers: number;
    recentlyAdded: Array<{
      id: string;
      name: string;
      createdAt: string;
    }>;
  }>({
    queryKey: ['/api/family/stats'],
  });

  // Fetch family members from API
  const { data: familyMembers, isLoading: membersLoading } = useQuery({
    queryKey: ['/api/family/members'],
  });

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, href: '/family', isActive: true },
    { id: 'inbox', label: 'Inbox', icon: Inbox, href: '/family/inbox' },
    { id: 'reminders', label: 'Reminders', icon: AlarmClock, href: '/family/reminders' },
    { id: 'family-ids', label: 'Family IDs', icon: Users, href: '/family/ids' },
    { id: 'finance', label: 'Finance', icon: DollarSign, href: '/family/finance' },
    { id: 'property', label: 'Property', icon: HomeIcon, href: '/family/property' },
    { id: 'passwords', label: 'Passwords', icon: Key, href: '/family/passwords' },
    { id: 'insurance', label: 'Insurance', icon: Umbrella, href: '/family/insurance' },
    { id: 'taxes', label: 'Taxes', icon: Receipt, href: '/family/taxes' },
    { id: 'legal', label: 'Legal', icon: Scale, href: '/family/legal' },
    { id: 'business', label: 'Business', icon: Building2, href: '/family/business' },
    { id: 'family-resources', label: 'Family Resources', icon: BookOpen, href: '/family/resources' },
    { id: 'contacts', label: 'Contacts', icon: Phone, href: '/family/contacts' },
  ];

  const [recentActivity] = useState([
    {
      id: '1',
      type: 'document',
      title: 'Medical Records Updated',
      description: 'Sarah updated emergency contact information',
      timestamp: '2 hours ago',
      icon: FileText,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: '2',
      type: 'message',
      title: 'New Family Message',
      description: 'Dad shared vacation photos in family chat',
      timestamp: '4 hours ago',
      icon: MessageCircle,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: '3',
      type: 'calendar',
      title: 'Upcoming Event',
      description: 'Family dinner this Sunday at 6 PM',
      timestamp: '1 day ago',
      icon: Calendar,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: '4',
      type: 'emergency',
      title: 'Safety Check Complete',
      description: 'All family members confirmed safe',
      timestamp: '2 days ago',
      icon: Shield,
      color: 'text-red-600 bg-red-100'
    }
  ]);

  const quickActions = [
    {
      id: 'upload-document',
      title: 'Upload Document',
      description: 'Add new family document',
      icon: Plus,
      href: '/family/documents/upload',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'send-message',
      title: 'Send Message',
      description: 'Chat with family',
      icon: MessageCircle,
      href: '/family/messages',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'view-photos',
      title: 'View Photos',
      description: 'Browse family gallery',
      icon: Image,
      href: '/family/photos',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      id: 'emergency-info',
      title: 'Emergency Info',
      description: 'Quick access to critical info',
      icon: Shield,
      href: '/family/emergency',
      color: 'bg-red-600 hover:bg-red-700'
    }
  ];

  // Create dynamic stats based on API data
  const familyStats = [
    { 
      label: 'Family Members', 
      value: familyData?.totalMembers || 0, 
      icon: Users,
      href: '/family/ids?tab=people&sort=recent',
      previewItems: familyData?.recentlyAdded?.map((member: any) => ({
        id: member.id,
        title: member.name,
        sub: `Added ${new Date(member.createdAt).toLocaleDateString()}`,
        href: `/family/ids/person/${member.id}`
      })) || [],
      dropdownActions: [
        { label: "Add Person", href: "/family/ids/new?type=person", icon: <UserPlus className="h-4 w-4" /> },
        { label: "Invite Family Member", onClick: () => setInviteDialogOpen(true), icon: <Mail className="h-4 w-4" /> },
        { label: "Manage Roles & Access", href: "/family/settings", icon: <Settings className="h-4 w-4" /> }
      ]
    },
    { 
      label: 'Documents Shared', 
      value: 23, 
      icon: FileText,
      href: '/inbox?filter=shared&sort=recent',
      previewItems: [
        { id: "1", title: "Insurance Policy.pdf", sub: "Shared with family", href: "/documents/1" },
        { id: "2", title: "Medical Records", sub: "Updated 2 hours ago", href: "/documents/2" },
        { id: "3", title: "Will & Testament", sub: "Secure access only", href: "/documents/3" }
      ],
      dropdownActions: [
        { label: "Share a Document", href: "/share/new", icon: <Share className="h-4 w-4" /> },
        { label: "Manage Link Policies", href: "/settings/sharing", icon: <Settings className="h-4 w-4" /> },
        { label: "Pending Approvals", href: "/inbox?filter=pending-approval", icon: <AlertCircle className="h-4 w-4" /> }
      ]
    },
    { 
      label: 'Messages Today', 
      value: 12, 
      icon: MessageCircle,
      href: '/messages?view=threads&sort=latest',
      previewItems: [
        { id: "1", title: "Family Group Chat", sub: "5 new messages", href: "/messages/thread/family" },
        { id: "2", title: "Dad: Vacation Plans", sub: "Just now", href: "/messages/thread/2" },
        { id: "3", title: "Sarah: Doctor Visit", sub: "30 min ago", href: "/messages/thread/3" }
      ],
      dropdownActions: [
        { label: "New Message", href: "/messages/new", icon: <Plus className="h-4 w-4" /> },
        { label: "Family Group Chat", href: "/messages/thread/family", icon: <Users className="h-4 w-4" /> },
        { label: "Mentions & Alerts", href: "/messages?filter=mentions", icon: <Bell className="h-4 w-4" /> }
      ]
    },
    { 
      label: 'Photos Uploaded', 
      value: 156, 
      icon: ImageIcon,
      href: '/photos?sort=recent',
      previewItems: [
        { id: "1", title: "Family Vacation 2024", sub: "12 new photos", href: "/photos/album/vacation-2024" },
        { id: "2", title: "Birthday Party", sub: "Uploaded yesterday", href: "/photos/album/birthday" },
        { id: "3", title: "School Graduation", sub: "Shared album", href: "/photos/album/graduation" }
      ],
      dropdownActions: [
        { label: "Upload Photos", href: "/photos/upload", icon: <Camera className="h-4 w-4" /> },
        { label: "Albums", href: "/photos/albums", icon: <FolderOpen className="h-4 w-4" /> },
        { label: "Shared Galleries", href: "/photos?filter=shared", icon: <Share className="h-4 w-4" /> }
      ]
    }
  ];

  // Function to scroll to upload center and highlight document upload
  const scrollToDocumentUpload = () => {
    setHighlightDocumentUpload(true);
    
    // Scroll to upload center
    if (uploadCenterRef.current) {
      uploadCenterRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
    
    // Remove highlight after animation
    setTimeout(() => {
      setHighlightDocumentUpload(false);
    }, 3000);
  };

  return (
    <div className="flex-1 overflow-auto bg-[var(--bg-900)]">
      {/* Luxury Header with Gradient */}
      <div className="rich-hero relative overflow-hidden">
        {/* Gold Heart Crest Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Heart className="w-32 h-32 text-[#D4AF37]" />
        </div>
        
        <div className="relative z-10 text-center py-16 px-8">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-[#D4AF37] rounded-full shadow-lg">
              <Heart className="w-10 h-10 text-black" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to Your{' '}
            <span className="text-[#D4AF37] relative group">
              Family Portal
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </span>
          </h1>
          <p className="text-lg text-[var(--ink-300)] max-w-2xl mx-auto leading-relaxed">
            Your secure, private space to stay connected and organized as a family. 
            Share important documents, communicate safely, and keep everyone informed.
          </p>
        </div>
      </div>
      
      <div className="p-8 space-y-8">

      {/* Family Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {familyStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <StatCard 
              key={stat.label}
              icon={<Icon className="h-5 w-5" />}
              value={stat.value}
              label={stat.label}
              href={stat.href}
              fetchPreview={async () => stat.previewItems}
              dropdownActions={stat.dropdownActions}
            />
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-[var(--ink-100)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionCard 
            icon={<Upload className="h-5 w-5"/>} 
            title="Upload Document" 
            subtitle="Add new family document"
            onClick={scrollToDocumentUpload}
          />
          <ActionCard 
            icon={<MessageCircle className="h-5 w-5"/>} 
            title="Send Message" 
            subtitle="Chat with family" 
            onClick={() => setMessagingOpen(true)}
          />
          <ActionCard icon={<ImageIcon className="h-5 w-5"/>} title="View Photos" subtitle="Browse family gallery" />
          <ActionCard icon={<ShieldAlert className="h-5 w-5"/>} title="Emergency Info" subtitle="Quick access to critical info" />
        </div>
      </div>

      {/* Upload Center */}
      <div ref={uploadCenterRef}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--ink-100)] flex items-center">
            <Upload className="w-5 h-5 mr-2 text-[var(--gold)]" />
            Upload Center
          </h2>
          <div className="text-sm text-[var(--ink-300)]">
            Secure S3 storage with virus scanning
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Document Upload */}
          <QuickDocumentUpload 
            familyId="family-1"
            className={highlightDocumentUpload ? "golden-glow" : ""}
            onUploadComplete={(docId) => {
              console.log('Document uploaded:', docId);
              // Invalidate stats queries to update counts
            }}
          />
          
          {/* Photo Upload */}
          <QuickPhotoUpload
            familyId="family-1"
            onUploadComplete={(photoId) => {
              console.log('Photo uploaded:', photoId);
              // Invalidate stats queries to update counts
            }}
          />
        </div>
      </div>

      {/* Recent Activity & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--ink-100)] flex items-center">
              <Activity className="w-5 h-5 mr-2 text-[var(--gold)]" />
              Recent Activity
            </h2>
            <Link to="/family/activity" className="text-sm text-[var(--gold)] hover:text-[var(--ink-100)] transition-colors">
              View all
            </Link>
          </div>
          <ActivityTimeline
            items={[
              { title: "Medical Records Updated", meta: "Sarah updated emergency contact info · 2 hours ago", tone: "info" },
              { title: "New Family Message", meta: "Dad shared vacation photos · 4 hours ago", tone: "ok" },
              { title: "Upcoming Event", meta: "Family dinner Sunday 6 PM · 1 day ago", tone: "info" },
              { title: "Safety Check Complete", meta: "All family confirmed safe · 2 days ago", tone: "ok" },
            ]}
          />
        </div>

        {/* Family Announcements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--ink-100)] flex items-center">
              <Bell className="w-5 h-5 mr-2 text-[var(--gold)]" />
              Family Announcements
            </h2>
            <Link to="/family/announcements" className="text-sm text-[var(--gold)] hover:text-[var(--ink-100)] transition-colors">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            <AnnouncementCard title="Family Vacation Planning" body="Submit preferred dates for the summer trip by Friday" meta="Posted by Mom · 3 days ago" />
            <AnnouncementCard title="Updated Family Calendar" body="New events: Sarah's graduation, reunion in July" meta="Posted by Dad · 1 week ago" />
          </div>
        </div>
      </div>

      {/* Family Tools */}
      <div>
        <h2 className="text-xl font-semibold text-[var(--ink-100)] mb-4">Family Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ToolCard icon={<Users className="h-6 w-6"/>} title="Family Members" description="Manage profiles, contacts, and emergency details." cta="Manage profiles →" />
          <ToolCard icon={<FileText className="h-6 w-6"/>} title="Document Vault" description="Securely store and share IDs, medical, legal papers." cta="View documents →" />
          <ToolCard icon={<ShieldAlert className="h-6 w-6"/>} title="Emergency Center" description="Quick access to emergency info and safety plans." cta="Access emergency info →" />
        </div>
      </div>

      {/* Luxury Footer */}
      <div className="bg-gradient-to-r from-[#0A0A1A] to-[#111111] rounded-xl mt-12 relative overflow-hidden">
        {/* Gold Crest Watermark */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-10">
          <Shield className="w-24 h-24 text-[#D4AF37]" />
        </div>
        
        <div className="relative z-10 p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-[#D4AF37] mr-2" />
            <span className="text-[#D4AF37] text-sm font-medium tracking-wider uppercase">© 2025 Family Circle Secure</span>
          </div>
          <p className="text-gray-300 text-sm">
            Private Family Portal — Where Family Legacy Meets Security
          </p>
        </div>
      </div>
      </div>

      {/* Invite Family Member Dialog */}
      <InviteFamilyMemberDialog 
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />

      {/* Family Messaging Modal */}
      <FamilyMessaging 
        isOpen={messagingOpen}
        onClose={() => setMessagingOpen(false)}
      />
    </div>
  );
}