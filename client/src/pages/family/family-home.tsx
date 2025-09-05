import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  Users, FileText, MessageCircle, Calendar, Image as ImageIcon, Shield,
  Heart, Clock, Star, Bell, Plus, ArrowRight, Activity,
  Inbox, AlarmClock, CreditCard, Home as HomeIcon, Key, 
  Umbrella, Receipt, Scale, Building2, BookOpen, 
  Phone, DollarSign, Upload, ShieldAlert,
  UserPlus, Mail, Settings, Share, Camera, FolderOpen, AlertCircle,
  Zap, Grid, BarChart3
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
import { NewMessageModal } from '@/components/messaging/NewMessageModal';
import NotificationCenter from '@/components/family/NotificationCenter';
import QuickAccessPanel from '@/components/family/QuickAccessPanel';
import ActivityFeed from '@/components/family/ActivityFeed';
import DashboardWidget from '@/components/family/DashboardWidget';
import MobileNavigationBar from '@/components/family/MobileNavigationBar';
import { PolicyModal } from '@/components/documents/PolicyModal';
import { ApprovalsDrawer } from '@/components/documents/ApprovalsDrawer';
import { ShareDocumentModal } from '@/components/documents/ShareDocumentModal';

export default function FamilyHome() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [highlightDocumentUpload, setHighlightDocumentUpload] = useState(false);
  const [quickAccessOpen, setQuickAccessOpen] = useState(false);
  const [dashboardLayout, setDashboardLayout] = useState('default');
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [approvalsDrawerOpen, setApprovalsDrawerOpen] = useState(false);
  const [shareDocumentModalOpen, setShareDocumentModalOpen] = useState(false);
  
  // Navigation hook
  const [, setLocation] = useLocation();
  
  // Ref for the upload center section
  const uploadCenterRef = useRef<HTMLDivElement>(null);

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

  // Quick access keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setQuickAccessOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      value: familyData?.totalDocuments || 23, 
      icon: FileText,
      href: '/inbox?filter=shared&sort=recent',
      onViewAll: () => setLocation('/documents?scope=shared&sort=recent'),
      fetchPreview: async () => {
        try {
          const response = await fetch('/api/documents/recent?limit=5');
          if (!response.ok) throw new Error('Failed to fetch documents');
          const data = await response.json();
          return data.items?.map((doc: any) => ({
            id: doc.id,
            title: doc.title || doc.fileName || 'Untitled',
            sub: doc.shareInfo || `Updated ${new Date(doc.updatedAt).toLocaleDateString()}`,
            href: `/documents/${doc.id}`
          })) || [];
        } catch (error) {
          console.error('Error fetching recent documents:', error);
          return [
            { id: "1", title: "Documents will load here", sub: "Connect to see recent files", href: "#" }
          ];
        }
      },
      dropdownActions: [
        { label: "Share a Document", onClick: () => setShareDocumentModalOpen(true), icon: <Share className="h-4 w-4" /> },
        { label: "Manage Link Policies", onClick: () => setPolicyModalOpen(true), icon: <Settings className="h-4 w-4" /> },
        { label: "Pending Approvals", onClick: () => setApprovalsDrawerOpen(true), icon: <AlertCircle className="h-4 w-4" /> }
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


  return (
    <div className="flex-1 overflow-auto bg-[var(--bg-900)] pb-20 md:pb-0">
      {/* Enhanced Header with Portal Controls */}
      <div className="rich-hero relative overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="relative z-20 flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white">Family Dashboard</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDashboardLayout(dashboardLayout === 'default' ? 'compact' : 'default')}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                data-testid="button-toggle-layout"
              >
                <Grid className="h-4 w-4 text-white/70" />
              </button>
              <button
                onClick={() => setQuickAccessOpen(true)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                data-testid="button-quick-access"
              >
                <Zap className="h-4 w-4 text-white/70" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <Link href="/family/settings">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Settings className="h-4 w-4 text-white/70" />
              </button>
            </Link>
          </div>
        </div>

        {/* Gold Heart Crest Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Heart className="w-32 h-32 text-[#D4AF37]" />
        </div>
        
        <div className="relative z-10 text-center py-12 px-8">
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
            className={highlightDocumentUpload ? "upload-highlight" : ""}
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

      {/* Enhanced Dashboard Layout */}
      {dashboardLayout === 'default' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Activity Feed */}
          <ActivityFeed limit={8} showFilters={false} />
          
          {/* Announcements & Important Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[var(--ink-100)] flex items-center">
                <Bell className="w-5 h-5 mr-2 text-[var(--gold)]" />
                Family Updates
              </h2>
            </div>
            <div className="space-y-4">
              <AnnouncementCard 
                title="Insurance Renewal Due"
                body="Your family insurance policy expires in 15 days. Click to review and renew."
                meta="Due: March 15, 2024"
              />
              <AnnouncementCard 
                title="Family Meeting Scheduled"
                body="Monthly family check-in this Sunday at 6 PM. We'll discuss vacation plans and budget updates."
                meta="This Sunday, 6:00 PM"
              />
              <AnnouncementCard 
                title="Password Security Review"
                body="2 family accounts need password updates for better security."
                meta="Action required"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Compact Layout */
        <div className="space-y-6">
          <ActivityFeed limit={5} showFilters={true} className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AnnouncementCard 
              title="Quick Reminder"
              body="Insurance due in 15 days"
              meta="Due: March 15"
            />
            <AnnouncementCard 
              title="Family Meeting"
              body="Sunday at 6 PM"
              meta="This Sunday"
            />
            <AnnouncementCard 
              title="Security Check"
              body="2 accounts need updates"
              meta="Action needed"
            />
          </div>
        </div>
      )}

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
      <NewMessageModal 
        open={messagingOpen}
        onClose={() => setMessagingOpen(false)}
      />

      {/* Quick Access Panel */}
      <QuickAccessPanel 
        isOpen={quickAccessOpen}
        onClose={() => setQuickAccessOpen(false)}
      />

      {/* Mobile Navigation */}
      <MobileNavigationBar onQuickAccessOpen={() => setQuickAccessOpen(true)} />

      {/* Document Management Modals */}
      <ShareDocumentModal 
        open={shareDocumentModalOpen}
        onOpenChange={setShareDocumentModalOpen}
      />
      
      <PolicyModal 
        open={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
      />
      
      <ApprovalsDrawer 
        open={approvalsDrawerOpen}
        onClose={() => setApprovalsDrawerOpen(false)}
      />
    </div>
  );
}