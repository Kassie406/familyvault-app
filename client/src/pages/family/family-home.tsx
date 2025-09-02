import { useState } from 'react';
import { Link } from 'wouter';
import {
  Users, FileText, MessageCircle, Calendar, Image, Shield,
  Heart, Clock, Star, Bell, Plus, ArrowRight, Activity,
  Inbox, AlarmClock, CreditCard, Home as HomeIcon, Key, 
  Umbrella, Receipt, Scale, Building2, BookOpen, 
  Phone, DollarSign
} from 'lucide-react';

export default function FamilyHome() {
  const [activeSection, setActiveSection] = useState('dashboard');

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

  const familyStats = [
    { label: 'Family Members', value: '5', icon: Users, color: 'text-blue-600' },
    { label: 'Documents Shared', value: '23', icon: FileText, color: 'text-green-600' },
    { label: 'Messages Today', value: '12', icon: MessageCircle, color: 'text-purple-600' },
    { label: 'Photos Uploaded', value: '156', icon: Image, color: 'text-orange-600' }
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-[#111111] border-r border-gray-800 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#D4AF37] rounded-lg">
              <Heart className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-lg font-semibold text-white">Family Circle Secure</h2>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeSection;
            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 relative group ${
                  isActive
                    ? 'text-[#D4AF37] border-r-2 border-[#D4AF37] bg-[#1a1a1a]'
                    : 'text-gray-300 hover:text-[#D4AF37] hover:bg-[#1a1a1a]'
                }`}
                data-testid={`sidebar-${item.id}`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-colors ${
                  isActive ? 'text-[#D4AF37]' : 'text-gray-400 group-hover:text-[#D4AF37]'
                }`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-800">
          <Link
            to="/family/referrals"
            className="flex items-center text-sm font-medium text-[#2ECC71] hover:text-[#D4AF37] transition-colors group"
          >
            <DollarSign className="w-4 h-4 mr-2 group-hover:text-[#D4AF37]" />
            Refer & earn
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[#F8F8F8]">
        {/* Luxury Header with Gradient */}
        <div className="bg-gradient-to-r from-[#0A0A1A] via-[#111111] to-[#0A0A1A] relative overflow-hidden">
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
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
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
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gray-50`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-[#0A0A1A] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const colors = ['#D4AF37', '#2ECC71', '#3498DB', '#E74C3C'];
            const iconColor = colors[index % colors.length];
            
            return (
              <Link
                key={action.id}
                to={action.href}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:border-[#D4AF37]/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: iconColor }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#D4AF37] transition-all" />
                </div>
                <h3 className="font-semibold mb-1 text-[#0A0A1A] group-hover:text-[#D4AF37] transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-semibold text-[#0A0A1A] flex items-center relative">
              <Activity className="w-5 h-5 mr-2 text-[#D4AF37]" />
              Recent Activity
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37]"></span>
            </h2>
            <Link to="/family/activity" className="text-sm text-[#D4AF37] hover:text-[#0A0A1A] transition-colors">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${activity.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Family Announcements */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-semibold text-[#0A0A1A] flex items-center relative">
              <Bell className="w-5 h-5 mr-2 text-[#D4AF37]" />
              Family Announcements
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37]"></span>
            </h2>
            <Link to="/family/announcements" className="text-sm text-[#D4AF37] hover:text-[#0A0A1A] transition-colors">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-lg border border-[#D4AF37]/20 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-[#0A0A1A]">Family Vacation Planning</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    Don't forget to submit your preferred dates for our summer family vacation by Friday!
                  </p>
                  <p className="text-xs text-[#D4AF37] mt-2 font-medium">Posted by Mom • 3 days ago</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-[#3498DB]/10 to-[#3498DB]/5 rounded-lg border border-[#3498DB]/20 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#3498DB] flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-[#0A0A1A]">Updated Family Calendar</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    New events added including Sarah's graduation and the family reunion in July.
                  </p>
                  <p className="text-xs text-[#3498DB] mt-2 font-medium">Posted by Dad • 1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Family Navigation Grid */}
      <div>
        <h2 className="text-xl font-semibold text-[#0A0A1A] mb-4">Family Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/family/members" className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-[#D4AF37]/30 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-full bg-[#3498DB] flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg group-hover:shadow-[#D4AF37]/20 transition-all">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-[#0A0A1A] mb-2 group-hover:text-[#D4AF37] transition-colors">Family Members</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">Manage profiles, contact info, and emergency details for all family members.</p>
            <span className="text-sm text-[#3498DB] group-hover:text-[#D4AF37] font-medium transition-colors">Manage profiles →</span>
          </Link>

          <Link to="/family/documents" className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-[#D4AF37]/30 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-full bg-[#2ECC71] flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg group-hover:shadow-[#D4AF37]/20 transition-all">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-[#0A0A1A] mb-2 group-hover:text-[#D4AF37] transition-colors">Document Vault</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">Securely store and share important family documents like IDs, medical records, and legal papers.</p>
            <span className="text-sm text-[#2ECC71] group-hover:text-[#D4AF37] font-medium transition-colors">View documents →</span>
          </Link>

          <Link to="/family/emergency" className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-[#D4AF37]/30 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-full bg-[#E74C3C] flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg group-hover:shadow-[#D4AF37]/20 transition-all">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-[#0A0A1A] mb-2 group-hover:text-[#D4AF37] transition-colors">Emergency Center</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">Quick access to critical information, emergency contacts, and family safety plans.</p>
            <span className="text-sm text-[#E74C3C] group-hover:text-[#D4AF37] font-medium transition-colors">Access emergency info →</span>
          </Link>
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
      </div>
    </div>
  );
}