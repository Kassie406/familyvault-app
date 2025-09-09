import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  Users, FileText, MessageCircle, Calendar, Image as ImageIcon, Shield,
  Heart, Clock, Star, Bell, Plus, ArrowRight, Activity,
  Inbox, AlarmClock, CreditCard, Home as HomeIcon, Key, 
  Umbrella, Receipt, Scale, Building2, BookOpen, 
  Phone, DollarSign, Upload, ShieldAlert, MapPin, Baby,
  UserPlus, Mail, Settings, Share, Camera, FolderOpen, AlertCircle,
  Zap, Grid, BarChart3, Video, ListTodo, CalendarDays, User,
  X, CheckCircle2, Trash2, LogOut, Search, HelpCircle, ChefHat,
  ChevronDown
} from 'lucide-react';
import { 
  ActionCard, 
  ToolCard, 
  AnnouncementCard, 
  ActivityTimeline 
} from '@/components/luxury-cards';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatCard } from '@/components/StatCard';
import { InviteFamilyMemberDialog } from '@/components/InviteFamilyMemberDialog';
import QuickDocumentUpload from '@/components/upload/QuickDocumentUpload';
import QuickPhotoUpload from '@/components/upload/QuickPhotoUpload';
import { NewMessageModal } from '@/components/messaging/NewMessageModal';
import NotificationCenter from '@/components/family/NotificationCenter';
import QuickAccessPanel from '@/components/family/QuickAccessPanel';
import ActivityFeed from '@/components/family/ActivityFeed';
import DashboardWidget from '@/components/family/DashboardWidget';
import FamilyUpdates from '@/components/family/FamilyUpdates';
import MobileNavigationBar from '@/components/family/MobileNavigationBar';
import { SharedCalendar } from '@/components/family/SharedCalendar';
import { ICESection } from '@/components/family/ICESection';
import { SharedCalendarCard } from '@/components/family/SharedCalendarCard';
import { ICECard } from '@/components/family/ICECard';
import { PolicyModal } from '@/components/documents/PolicyModal';
import { SortableGrid } from '@/components/dashboard/SortableGrid';
import { CustomizeBar } from '@/components/dashboard/CustomizeBar';
import { useUserLayout } from '@/lib/dashboard/useUserLayout';
import { CardId } from '@/lib/dashboard/cards';
import { ApprovalsDrawer } from '@/components/documents/ApprovalsDrawer';
import { ShareDocumentModal } from '@/components/documents/ShareDocumentModal';
import { SharedListsModal } from '@/components/family/SharedListsModal';
import { RecipeBookModal } from '@/components/family/RecipeBookModal';
import { BudgetTrackerModal } from '@/components/family/BudgetTrackerModal';
import { CouplesConnectionModal } from '@/components/family/CouplesConnectionModal';
import { MealPlannerWeek } from '@/components/family/MealPlannerWeek';
import ChoresCard from '@/components/family/ChoresCard';
import AllowanceMini from '@/components/family/AllowanceMini';
import ActionCenter from '@/components/family/ActionCenter';

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
  const [sharedListsOpen, setSharedListsOpen] = useState(false);
  const [recipeBookOpen, setRecipeBookOpen] = useState(false);
  const [budgetTrackerOpen, setBudgetTrackerOpen] = useState(false);
  const [mealPlannerOpen, setMealPlannerOpen] = useState(false);
  const [couplesConnectionOpen, setCouplesConnectionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Current user mock (TODO: replace with real user data)
  const currentUser = { 
    id: "current-user", 
    name: "Parent User", 
    role: "parent" as const 
  };

  // Dashboard customization
  const { layout, visible, hide, show, reorder, resetToRole } = useUserLayout(currentUser.id, currentUser.role);
  const [editing, setEditing] = useState(false);
  const hiddenIds = layout.filter((item) => item.hidden).map((item) => item.id);
  
  // Navigation hook
  const [, setLocation] = useLocation();

  // Logout function
  const handleLogout = async () => {
    try {
      await fetch('/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if logout fails
      window.location.href = '/login';
    }
  };
  
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
    totalDocuments?: number;
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
          })) || [
            { id: "1", title: "Documents will load here", sub: "Connect to see recent files", href: "#" }
          ];
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
      label: (
        <span className="flex items-center gap-1">
          Messages &nbsp;&amp;&nbsp;
          <span className="inline-flex items-center">
            Video Meetings
            <Video size={26} className="ml-1" color="#D4AF37" strokeWidth={2.5} />
          </span>
        </span>
      ), 
      value: 12, 
      icon: MessageCircle,
      href: '/messages?view=threads&sort=latest',
      fetchPreview: async () => {
        try {
          const response = await fetch('/api/threads?limit=5');
          if (!response.ok) throw new Error('Failed to fetch threads');
          const data = await response.json();
          return data.threads?.map((thread: any) => {
            const unreadText = thread.unreadCount > 0 ? `${thread.unreadCount} new message${thread.unreadCount > 1 ? 's' : ''}` : 'No new messages';
            const lastMessageTime = thread.lastMessage?.createdAt 
              ? formatDistanceToNow(new Date(thread.lastMessage.createdAt)) + ' ago'
              : 'No recent activity';
            
            return {
              id: thread.id,
              title: thread.title || 'Family Group Chat',
              sub: thread.unreadCount > 0 ? unreadText : lastMessageTime,
              href: `/messages/thread/${thread.id}`
            };
          }) || [
            { id: "1", title: "No recent messages", sub: "Start a conversation", href: "/messages/new" }
          ];
        } catch (error) {
          console.error('Error fetching recent threads:', error);
          return [
            { id: "1", title: "Messages will load here", sub: "Connect to see recent conversations", href: "/messages" }
          ];
        }
      },
      dropdownActions: [
        { 
          label: "New Message", 
          onClick: () => {
            // Trigger floating chat widget to open
            window.dispatchEvent(new Event('openFamilyChat'));
          }, 
          icon: <Plus className="h-4 w-4" /> 
        },
        { 
          label: "Family Video Meetings", 
          onClick: async () => {
            // Check for active family meeting
            try {
              const response = await fetch('/api/family/meeting/status');
              const meetingData = await response.json();
              
              if (meetingData.activeMeeting) {
                // Join existing meeting
                window.open(`/family/meeting/${meetingData.activeMeeting.id}`, '_blank');
              } else {
                // No active meeting - show create meeting dialog
                if (confirm('No active family meeting found. Would you like to start a new family meeting?')) {
                  const createResponse = await fetch('/api/family/meeting/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      title: 'Family Group Meeting',
                      type: 'group_chat'
                    })
                  });
                  const newMeeting = await createResponse.json();
                  window.open(`/family/meeting/${newMeeting.id}`, '_blank');
                }
              }
            } catch (error) {
              console.error('Error checking meeting status:', error);
              alert('Unable to access family meeting. Please try again.');
            }
          }, 
          icon: <Users className="h-4 w-4" /> 
        },
        { label: "Mentions & Alerts", href: "/messages?filter=mentions", icon: <Bell className="h-4 w-4" /> }
      ]
    },
    { 
      label: 'Photos Uploaded', 
      value: 156, 
      icon: ImageIcon,
      href: '/photos?sort=recent',
      fetchPreview: async () => {
        try {
          const response = await fetch('/api/files/family/family-1/status');
          if (!response.ok) throw new Error('Failed to fetch family files');
          const data = await response.json();
          const photos = data.files?.filter((file: any) => file.type === 'photo')?.slice(0, 5) || [];
          
          return photos.map((photo: any) => {
            const uploadTime = photo.processedAt 
              ? formatDistanceToNow(new Date(photo.processedAt)) + ' ago'
              : 'Recently uploaded';
            
            return {
              id: photo.id,
              title: `Photo ${photo.id.slice(0, 8)}`,
              sub: photo.ready ? uploadTime : photo.processing ? 'Processing...' : 'Upload pending',
              href: `/photos/${photo.id}`
            };
          });
        } catch (error) {
          console.error('Error fetching recent photos:', error);
          return [
            { id: "1", title: "Photos will load here", sub: "Connect to see recent uploads", href: "/photos" }
          ];
        }
      },
      dropdownActions: [
        { label: "Upload Photos", href: "/photos/upload", icon: <Camera className="h-4 w-4" /> },
        { label: "Albums", href: "/photos/albums", icon: <FolderOpen className="h-4 w-4" /> },
        { label: "Shared Galleries", href: "/photos?filter=shared", icon: <Share className="h-4 w-4" /> }
      ]
    },
    { 
      label: 'Shared Lists', 
      value: 8, 
      icon: ListTodo,
      href: '#',
      onClick: () => setSharedListsOpen(true),
      fetchPreview: async () => {
        try {
          const response = await fetch('/api/lists?limit=5');
          if (!response.ok) throw new Error('Failed to fetch lists');
          const data = await response.json();
          return data.slice(0, 5).map((item: any) => {
            const dueInfo = item.due ? new Date(item.due) > new Date() ? 
              `Due ${new Date(item.due).toLocaleDateString()}` : 'Overdue' : '';
            return {
              id: item.id,
              title: item.text,
              sub: item.assignee ? `Assigned to ${item.assignee}` + (dueInfo ? ` • ${dueInfo}` : '') : dueInfo,
              href: '#'
            };
          });
        } catch (error) {
          console.error('Error fetching lists:', error);
          return [
            { id: "1", title: "Buy groceries", sub: "Assigned to Mom • Due today", href: "#" },
            { id: "2", title: "Vacuum living room", sub: "Assigned to Alex", href: "#" },
            { id: "3", title: "Pack school bags", sub: "Due tomorrow", href: "#" }
          ];
        }
      },
      dropdownActions: [
        { label: "Quick Add", onClick: () => setSharedListsOpen(true), icon: <Plus className="h-4 w-4" /> },
        { label: "View All Lists", onClick: () => setSharedListsOpen(true), icon: <ListTodo className="h-4 w-4" /> },
        { label: "Family Assignments", onClick: () => setSharedListsOpen(true), icon: <User className="h-4 w-4" /> }
      ]
    },
    { 
      label: 'Recipe Book', 
      value: 12, 
      icon: ChefHat,
      href: '#',
      onClick: () => setRecipeBookOpen(true),
      fetchPreview: async () => {
        try {
          const response = await fetch('/api/recipes?limit=5');
          if (!response.ok) throw new Error('Failed to fetch recipes');
          const data = await response.json();
          return data.slice(0, 5).map((recipe: any) => {
            const servingInfo = recipe.servings ? `Serves ${recipe.servings}` : '';
            const prepTime = recipe.prepTime ? `${recipe.prepTime} min prep` : '';
            const timeInfo = [prepTime, servingInfo].filter(Boolean).join(' • ');
            return {
              id: recipe.id,
              title: recipe.title,
              sub: recipe.category ? `${recipe.category}${timeInfo ? ` • ${timeInfo}` : ''}` : timeInfo,
              href: '#'
            };
          });
        } catch (error) {
          console.error('Error fetching recipes:', error);
          return [
            { id: "1", title: "Grandma's Apple Pie", sub: "Dessert • 45 min prep • Serves 8", href: "#" },
            { id: "2", title: "Family Marinara Sauce", sub: "Sauce • 30 min prep • Serves 6", href: "#" },
            { id: "3", title: "Sunday Roast Chicken", sub: "Main Course • 2 hours • Serves 4", href: "#" }
          ];
        }
      },
      dropdownActions: [
        { label: "Add New Recipe", onClick: () => setRecipeBookOpen(true), icon: <Plus className="h-4 w-4" /> },
        { label: "Browse Categories", onClick: () => setRecipeBookOpen(true), icon: <BookOpen className="h-4 w-4" /> },
        { label: "Family Favorites", onClick: () => setRecipeBookOpen(true), icon: <Heart className="h-4 w-4" /> }
      ]
    },
    { 
      label: 'Budget Tracker', 
      value: '$2,450', 
      icon: DollarSign,
      href: '#',
      onClick: () => setBudgetTrackerOpen(true),
      fetchPreview: async () => {
        try {
          const response = await fetch('/api/budget/summary?limit=5');
          if (!response.ok) throw new Error('Failed to fetch budget data');
          const data = await response.json();
          return data.recentTransactions?.slice(0, 5).map((transaction: any) => {
            const amount = transaction.amount > 0 ? `+$${transaction.amount}` : `-$${Math.abs(transaction.amount)}`;
            const timeAgo = new Date(transaction.date).toLocaleDateString();
            return {
              id: transaction.id,
              title: transaction.description,
              sub: `${transaction.category} • ${amount} • ${timeAgo}`,
              href: '#'
            };
          }) || [];
        } catch (error) {
          console.error('Error fetching budget data:', error);
          return [
            { id: "1", title: "Grocery Shopping", sub: "Food • -$127.50 • Today", href: "#" },
            { id: "2", title: "Electricity Bill", sub: "Utilities • -$89.00 • Jan 15", href: "#" },
            { id: "3", title: "Family Dinner Out", sub: "Entertainment • -$65.00 • Jan 14", href: "#" },
            { id: "4", title: "Salary Deposit", sub: "Income • +$3,200.00 • Jan 1", href: "#" },
            { id: "5", title: "Gas Station", sub: "Transportation • -$45.00 • Jan 12", href: "#" }
          ];
        }
      },
      dropdownActions: [
        { label: "Add Expense", onClick: () => setBudgetTrackerOpen(true), icon: <Plus className="h-4 w-4" /> },
        { label: "Set Budget Goals", onClick: () => setBudgetTrackerOpen(true), icon: <BarChart3 className="h-4 w-4" /> },
        { label: "Monthly Report", onClick: () => setBudgetTrackerOpen(true), icon: <FileText className="h-4 w-4" /> }
      ]
    },
    { 
      label: 'Couple\'s Connection', 
      value: 'Together', 
      icon: Heart,
      href: '#',
      onClick: () => setCouplesConnectionOpen(true),
      fetchPreview: async () => {
        try {
          // Mock data for demonstration - replace with real API later
          return [
            { id: "1", title: "Anniversary Dinner at Luigi's", sub: "Memory • Dec 14 • Romantic evening", href: "#" },
            { id: "2", title: "Weekend Getaway to Mountains", sub: "Date Idea • Planned for Feb 15", href: "#" },
            { id: "3", title: "Learn Salsa Dancing Together", sub: "Goal • Ongoing • Dance Studio", href: "#" },
            { id: "4", title: "Love You More Every Day", sub: "Message • From Sarah • Jan 25", href: "#" },
            { id: "5", title: "First Home Purchase", sub: "Milestone • Achieved Aug 20", href: "#" }
          ];
        } catch (error) {
          console.error('Error fetching couple activities:', error);
          return [
            { id: "1", title: "Start your love story", sub: "Add your first memory together", href: "#" },
            { id: "2", title: "Plan your next date", sub: "Create romantic memories", href: "#" },
            { id: "3", title: "Set relationship goals", sub: "Grow together as a couple", href: "#" }
          ];
        }
      },
      dropdownActions: [
        { label: "Add Memory", onClick: () => setCouplesConnectionOpen(true), icon: <Camera className="h-4 w-4" /> },
        { label: "Plan Date", onClick: () => setCouplesConnectionOpen(true), icon: <Calendar className="h-4 w-4" /> },
        { label: "Send Love Note", onClick: () => setCouplesConnectionOpen(true), icon: <MessageCircle className="h-4 w-4" /> },
        { label: "Set Goals", onClick: () => setCouplesConnectionOpen(true), icon: <Star className="h-4 w-4" /> }
      ]
    },
    { 
      label: 'Meal Planner', 
      value: 'Week View', 
      icon: CalendarDays,
      href: '#',
      onClick: () => setMealPlannerOpen(true),
      fetchPreview: async () => {
        try {
          const response = await fetch('/api/mealplan/week');
          if (!response.ok) throw new Error('Failed to fetch meal plan');
          const data = await response.json();
          
          // Create a preview of planned meals for this week
          return data.entries.slice(0, 5).map((entry: any) => {
            const mealText = entry.recipe?.title || entry.title || "No meal planned";
            const date = new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' });
            return {
              id: entry.id,
              title: `${entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1)}: ${mealText}`,
              sub: date,
              href: '#'
            };
          });
        } catch (error) {
          console.error('Error fetching meal plan:', error);
          return [
            { id: "1", title: "Dinner: Chicken Alfredo", sub: "Mon, Jan 29", href: "#" },
            { id: "2", title: "Lunch: Turkey Sandwiches", sub: "Tue, Jan 30", href: "#" },
            { id: "3", title: "Breakfast: Pancakes", sub: "Wed, Jan 31", href: "#" },
            { id: "4", title: "Dinner: Taco Night", sub: "Thu, Feb 1", href: "#" },
            { id: "5", title: "Lunch: Leftover Tacos", sub: "Fri, Feb 2", href: "#" }
          ];
        }
      },
      dropdownActions: [
        { label: "Plan This Week", onClick: () => setMealPlannerOpen(true), icon: <CalendarDays className="h-4 w-4" /> },
        { label: "Add Recipe", onClick: () => setRecipeBookOpen(true), icon: <Plus className="h-4 w-4" /> },
        { label: "Generate Shopping List", onClick: async () => {
          try {
            const response = await fetch('/api/mealplan/generate-shopping-list', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
            if (response.ok) {
              const result = await response.json();
              alert(`Generated shopping list with ${result.added} items!`);
            }
          } catch (e) { alert('Failed to generate shopping list'); }
        }, icon: <ListTodo className="h-4 w-4" /> }
      ]
    },
    { 
      label: 'Family Vacation', 
      value: 'Hawaii 2024', 
      icon: MapPin,
      href: '#',
      onClick: () => alert('Family Vacation planner coming soon!'),
      fetchPreview: async () => {
        return [
          { id: "1", title: "Flight to Honolulu", sub: "Booked • July 15-22", href: "#" },
          { id: "2", title: "Beachfront Resort", sub: "Confirmed • 7 nights", href: "#" },
          { id: "3", title: "Snorkeling Tour", sub: "Scheduled • July 18", href: "#" },
          { id: "4", title: "Pearl Harbor Visit", sub: "Tickets purchased • July 20", href: "#" },
          { id: "5", title: "Luau Dinner", sub: "Reserved • July 21", href: "#" }
        ];
      },
      dropdownActions: [
        { label: "Plan Trip", onClick: () => alert('Trip planner coming soon!'), icon: <MapPin className="h-4 w-4" /> },
        { label: "Book Activities", onClick: () => alert('Activity booking coming soon!'), icon: <Calendar className="h-4 w-4" /> },
        { label: "Travel Documents", onClick: () => alert('Travel docs coming soon!'), icon: <FileText className="h-4 w-4" /> }
      ]
    },
    { 
      label: 'Babysitter', 
      value: 'Sarah M.', 
      icon: User,
      href: '#',
      onClick: () => alert('Babysitter management coming soon!'),
      fetchPreview: async () => {
        return [
          { id: "1", title: "Sarah Martinez", sub: "Available weekends • $15/hr", href: "#" },
          { id: "2", title: "Jessica Brown", sub: "Evening availability • $12/hr", href: "#" },
          { id: "3", title: "Mike Thompson", sub: "Weekday mornings • $18/hr", href: "#" },
          { id: "4", title: "Emma Wilson", sub: "Holiday coverage • $20/hr", href: "#" },
          { id: "5", title: "Alex Chen", sub: "Emergency contact • $25/hr", href: "#" }
        ];
      },
      dropdownActions: [
        { label: "Book Babysitter", onClick: () => alert('Booking coming soon!'), icon: <Calendar className="h-4 w-4" /> },
        { label: "Add New Sitter", onClick: () => alert('Add sitter coming soon!'), icon: <UserPlus className="h-4 w-4" /> },
        { label: "Payment History", onClick: () => alert('Payment history coming soon!'), icon: <DollarSign className="h-4 w-4" /> }
      ]
    },
    { 
      label: 'Emergency Contacts', 
      value: '24/7 Ready', 
      icon: ShieldAlert,
      href: '/family/emergency',
      fetchPreview: async () => {
        return [
          { id: "1", title: "911 Emergency", sub: "Police • Fire • Medical", href: "#" },
          { id: "2", title: "Dr. Sarah Johnson", sub: "Family Doctor • (555) 123-4567", href: "#" },
          { id: "3", title: "Children's Hospital", sub: "Pediatric Emergency • (555) 987-6543", href: "#" },
          { id: "4", title: "Poison Control", sub: "24/7 Hotline • 1-800-222-1222", href: "#" },
          { id: "5", title: "Mom's Cell", sub: "Always available • (555) 111-2222", href: "#" }
        ];
      },
      dropdownActions: [
        { label: "Add Contact", onClick: () => alert('Add contact coming soon!'), icon: <UserPlus className="h-4 w-4" /> },
        { label: "Medical Info", onClick: () => alert('Medical info coming soon!'), icon: <FileText className="h-4 w-4" /> },
        { label: "Quick Call", onClick: () => alert('Quick call coming soon!'), icon: <Phone className="h-4 w-4" /> }
      ]
    }
  ];

  // Card renderer function for the sortable grid
  const renderCard = (id: CardId): React.ReactNode => {
    switch (id) {
      case 'familyMembers':
        const familyMembersData = familyStats.find(s => s.label === 'Family Members');
        return (
          <StatCard 
            icon={<Users className="h-5 w-5" />}
            value={familyMembersData?.value || 0}
            label="Family Members"
            href={familyMembersData?.href || '#'}
            fetchPreview={async () => familyMembersData?.previewItems || []}
            dropdownActions={familyMembersData?.dropdownActions || []}
          />
        );

      case 'documents':
        const documentsData = familyStats.find(s => s.label === 'Documents Shared');
        return (
          <StatCard 
            icon={<FileText className="h-5 w-5" />}
            value={documentsData?.value || 0}
            label="Documents Shared"
            href={documentsData?.href || '#'}
            fetchPreview={documentsData?.fetchPreview || (async () => [])}
            dropdownActions={documentsData?.dropdownActions || []}
          />
        );

      case 'messages':
        const messagesData = familyStats.find(s => s.label === 'Messages & Video Meetings');
        return (
          <StatCard 
            icon={<MessageCircle className="h-5 w-5" />}
            value={messagesData?.value || 0}
            label="Messages & Video Meetings"
            href={messagesData?.href || '#'}
            fetchPreview={messagesData?.fetchPreview || (async () => [])}
            dropdownActions={messagesData?.dropdownActions || []}
          />
        );

      case 'photos':
        const photosData = familyStats.find(s => s.label === 'Photos Uploaded');
        return (
          <StatCard 
            icon={<ImageIcon className="h-5 w-5" />}
            value={photosData?.value || 0}
            label="Photos Uploaded"
            href={photosData?.href || '#'}
            fetchPreview={photosData?.fetchPreview || (async () => [])}
            dropdownActions={photosData?.dropdownActions || []}
          />
        );

      case 'sharedLists':
        const sharedListsData = familyStats.find(s => s.label === 'Shared Lists');
        return (
          <StatCard 
            icon={<ListTodo className="h-5 w-5" />}
            value={sharedListsData?.value || 0}
            label="Shared Lists"
            href={sharedListsData?.href || '#'}
            fetchPreview={sharedListsData?.fetchPreview || (async () => [])}
            dropdownActions={sharedListsData?.dropdownActions || []}
          />
        );

      case 'recipeBook':
        const recipeBookData = familyStats.find(s => s.label === 'Recipe Book');
        return (
          <StatCard 
            icon={<ChefHat className="h-5 w-5" />}
            value={recipeBookData?.value || 0}
            label="Recipe Book"
            href={recipeBookData?.href || '#'}
            fetchPreview={recipeBookData?.fetchPreview || (async () => [])}
            dropdownActions={recipeBookData?.dropdownActions || []}
          />
        );

      case 'budget':
        const budgetData = familyStats.find(s => s.label === 'Budget Tracker');
        return (
          <StatCard 
            icon={<DollarSign className="h-5 w-5" />}
            value={budgetData?.value || '$0'}
            label="Budget Tracker"
            href={budgetData?.href || '#'}
            fetchPreview={budgetData?.fetchPreview || (async () => [])}
            dropdownActions={budgetData?.dropdownActions || []}
          />
        );

      case 'couples':
        const couplesData = familyStats.find(s => s.label === "Couple's Connection");
        return (
          <StatCard 
            icon={<Heart className="h-5 w-5" />}
            value={couplesData?.value || 'Together'}
            label="Couple's Connection"
            href={couplesData?.href || '#'}
            fetchPreview={couplesData?.fetchPreview || (async () => [])}
            dropdownActions={couplesData?.dropdownActions || []}
          />
        );

      case 'mealPlanner':
        const mealPlannerData = familyStats.find(s => s.label === 'Meal Planner');
        return (
          <StatCard 
            icon={<CalendarDays className="h-5 w-5" />}
            value={mealPlannerData?.value || 'Week View'}
            label="Meal Planner"
            href={mealPlannerData?.href || '#'}
            fetchPreview={mealPlannerData?.fetchPreview || (async () => [])}
            dropdownActions={mealPlannerData?.dropdownActions || []}
          />
        );

      case 'familyVacation':
        const familyVacationData = familyStats.find(s => s.label === 'Family Vacation');
        return (
          <StatCard 
            icon={<MapPin className="h-5 w-5" />}
            value={familyVacationData?.value || 'Plan Trip'}
            label="Family Vacation"
            href={familyVacationData?.href || '#'}
            fetchPreview={familyVacationData?.fetchPreview || (async () => [])}
            dropdownActions={familyVacationData?.dropdownActions || []}
          />
        );

      case 'babysitter':
        const babysitterData = familyStats.find(s => s.label === 'Babysitter');
        return (
          <StatCard 
            icon={<User className="h-5 w-5" />}
            value={babysitterData?.value || 'Available'}
            label="Babysitter"
            href={babysitterData?.href || '#'}
            fetchPreview={babysitterData?.fetchPreview || (async () => [])}
            dropdownActions={babysitterData?.dropdownActions || []}
          />
        );

      case 'emergencyContacts':
        const emergencyContactsData = familyStats.find(s => s.label === 'Emergency Contacts');
        return (
          <StatCard 
            icon={<ShieldAlert className="h-5 w-5" />}
            value={emergencyContactsData?.value || '24/7 Ready'}
            label="Emergency Contacts"
            href={emergencyContactsData?.href || '#'}
            fetchPreview={emergencyContactsData?.fetchPreview || (async () => [])}
            dropdownActions={emergencyContactsData?.dropdownActions || []}
          />
        );

      case 'chores':
        return <ChoresCard currentUser={currentUser} />;

      case 'allowancePoints':
        return <AllowanceMini />;

      case 'quickActions':
        return (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 h-auto flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10">
                <Zap className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-gray-200 font-semibold">Quick Actions</h3>
                <p className="text-xs text-gray-500">Frequently used features</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
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
              <ActionCard 
                icon={<ImageIcon className="h-5 w-5"/>} 
                title="View Photos" 
                subtitle="Browse family gallery" 
              />
              <ActionCard 
                icon={<Shield className="h-5 w-5"/>} 
                title="Emergency Info" 
                subtitle="Quick access to critical info"
              />
            </div>
          </div>
        );

      case 'uploadCenter':
        return (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-auto flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-600/10">
                <Upload className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-gray-200 font-semibold">Upload Center</h3>
                <p className="text-xs text-gray-500">Add documents and photos to your family vault</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="space-y-4">
                <h4 className="text-gray-300 font-medium">Documents</h4>
                <QuickDocumentUpload />
              </div>
              
              <div className="space-y-4">
                <h4 className="text-gray-300 font-medium">Photos</h4>
                <QuickPhotoUpload />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full rounded-2xl bg-zinc-900 border border-zinc-800 p-4 shadow-sm">
            <div className="text-sm text-gray-400 mb-2">Card: {id}</div>
            <div className="text-xs text-gray-600">Coming soon...</div>
          </div>
        );
    }
  };


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
                className="p-2 rounded-lg transition-colors"
                data-testid="button-toggle-layout"
              >
                <Grid className="h-4 w-4 text-white/70" />
              </button>
              <button
                onClick={() => setQuickAccessOpen(true)}
                className="p-2 rounded-lg transition-colors"
                data-testid="button-quick-access"
              >
                <Zap className="h-4 w-4 text-white/70" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ink-400)] h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] w-64"
                data-testid="input-search"
              />
            </div>
            
            {/* Help Button */}
            <button className="text-[var(--ink-300)] hover:text-[var(--gold)] flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm">Help</span>
            </button>
            
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  id="header-profile-btn"
                  data-testid="button-profile"
                  className="profile-chip w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center hover:bg-[#B8860B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
                >
                  <span className="text-black text-sm font-medium">KC</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="header-profile-menu w-48 bg-[#1A1A1A] border-[#2A2A33] text-white absolute right-0 mt-2 z-[60]"
              >
                <DropdownMenuItem asChild>
                  <Link href="/family/settings" className="flex items-center gap-2 px-2 py-2 hover:bg-[#2A2A33] transition-colors cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#2A2A33]" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-2 py-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <NotificationCenter />
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
      
      <div className="p-8 space-y-4">
        {/* Dashboard Customization Bar */}
        <CustomizeBar
          hiddenIds={hiddenIds}
          onShow={show}
          onReset={resetToRole}
          editing={editing}
          setEditing={setEditing}
        />

        {/* Sortable Dashboard Grid */}
        <SortableGrid
          items={visible}
          onReorder={reorder}
          editing={editing}
          onHide={hide}
          renderCard={renderCard}
        />

        {/* Legacy Quick Actions Row - Hidden during editing */}
        {!editing && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10">
                <Zap className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-gray-200 font-semibold">Legacy Actions</h3>
                <p className="text-xs text-gray-500">These will be integrated into the customizable cards</p>
              </div>
            </div>
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
        )}

      {/* Row 3: Upload Center (full width) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4" ref={uploadCenterRef}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#D4AF37]/10">
              <Upload className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-gray-200 font-semibold">Upload Center</h3>
              <p className="text-xs text-gray-500">Secure S3 storage with virus scanning</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      {/* Row 4: Resizable Family Activity + Family Updates + Shared Calendar */}
      <div className="h-[600px]">
        <PanelGroup direction="horizontal" className="gap-3">
          {/* Family Activity Panel */}
          <Panel defaultSize={25} minSize={15} maxSize={40}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10">
                  <Activity className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-gray-200 font-semibold">Family Activity</h3>
                  <p className="text-xs text-gray-500">Recent family updates</p>
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(100%-80px)] custom-scrollbar">
                <ActivityFeed limit={6} showFilters={false} />
              </div>
            </div>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-3 bg-transparent hover:bg-[#D4AF37]/20 rounded-full transition-colors duration-200 group flex items-center justify-center">
            <div className="w-1 h-12 bg-zinc-700 group-hover:bg-[#D4AF37] rounded-full transition-colors duration-200"></div>
          </PanelResizeHandle>

          {/* Family Updates Panel */}
          <Panel defaultSize={35} minSize={20} maxSize={50}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10">
                  <Bell className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-gray-200 font-semibold">Family Updates</h3>
                  <p className="text-xs text-gray-500">Important notifications</p>
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(100%-80px)] custom-scrollbar">
                <FamilyUpdates />
              </div>
            </div>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-3 bg-transparent hover:bg-[#D4AF37]/20 rounded-full transition-colors duration-200 group flex items-center justify-center">
            <div className="w-1 h-12 bg-zinc-700 group-hover:bg-[#D4AF37] rounded-full transition-colors duration-200"></div>
          </PanelResizeHandle>

          {/* Calendar Panel */}
          <Panel defaultSize={40} minSize={30} maxSize={60}>
            <SharedCalendarCard />
          </Panel>
        </PanelGroup>
      </div>

      {/* Row 5: ICE (In Case of Emergency) - Full Width */}
      <ICECard />

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

      {/* Shared Lists Modal */}
      <SharedListsModal 
        open={sharedListsOpen}
        onClose={() => setSharedListsOpen(false)}
      />

      {/* Recipe Book Modal */}
      <RecipeBookModal 
        open={recipeBookOpen}
        onClose={() => setRecipeBookOpen(false)}
      />

      {/* Budget Tracker Modal */}
      <BudgetTrackerModal 
        open={budgetTrackerOpen}
        onClose={() => setBudgetTrackerOpen(false)}
      />

      {/* Couple's Connection Modal */}
      <CouplesConnectionModal 
        open={couplesConnectionOpen}
        onClose={() => setCouplesConnectionOpen(false)}
      />

      {/* Meal Planner Modal */}
      {mealPlannerOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
          onKeyDown={(e) => e.key === "Escape" && setMealPlannerOpen(false)}
        >
          <div className="bg-[#0A0A0A] border border-[#2A2A33] rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#2A2A33]">
              <h2 className="text-xl font-semibold text-white">Family Meal Planner</h2>
              <button
                onClick={() => setMealPlannerOpen(false)}
                className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors text-gray-400 hover:text-white"
                data-testid="button-close-meal-planner"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-auto max-h-[75vh]">
              <MealPlannerWeek />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}